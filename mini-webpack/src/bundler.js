/**
 * Mini Webpack —— 教学版 Bundler（核心逻辑）
 *
 * 职责：从入口出发构建依赖图，把 ESM 转成带缓存的 IIFE bundle。
 * 刻意简化：不支持动态 import、CSS、Plugin/Loader、完整 ESM 语义、循环依赖的 TDZ。
 *
 * 调试：node --inspect-brk mini-webpack/src/cli.js <entry> -o <out> --debug
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

let moduleIdCounter = 0;

/**
 * 读取文件并解析为 Babel AST
 * @param {string} filePath
 * @param {boolean} debug
 */
function parseFile(filePath, debug) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    sourceFilename: filePath,
  });
  if (debug) {
    console.log(`\n[AST] ${filePath}`);
    console.log(`  type=${ast.type}, body.length=${ast.program.body.length}`);
  }
  return { code, ast };
}

/**
 * 从 AST 中收集静态 import 依赖（相对路径字符串）
 * @param {object} ast
 * @returns {string[]}
 */
function collectDependencies(ast) {
  const deps = [];
  traverse(ast, {
    ImportDeclaration(p) {
      deps.push(p.node.source.value);
    },
  });
  return deps;
}

/**
 * 把 ESM import/export 改写成 CommonJS 风格，以便塞进模块函数
 * - import { x } from './m'  -> const { x } = __require(depId)
 * - import d from './m'      -> const d = __require(depId).default
 * - export function f(){}    -> exports.f = function f(){}
 * - export const a = 1       -> const a = 1; exports.a = a
 * - export default expr      -> exports.default = expr
 *
 * 局限：不处理 export *、re-export、import()、顶层 await。
 *
 * @param {object} ast
 * @param {Record<string, number>} depIdMap  相对路径 -> 模块 id
 */
function transformEsmToCjs(ast, depIdMap) {
  traverse(ast, {
    ImportDeclaration(p) {
      const source = p.node.source.value;
      const id = depIdMap[source];
      if (id === undefined) {
        throw new Error(`Unresolved import: ${source}`);
      }
      const requireCall = t.callExpression(t.identifier('__require'), [
        t.numericLiteral(id),
      ]);

      const specifiers = p.node.specifiers;
      if (specifiers.length === 0) {
        // side-effect import: import './x'
        p.replaceWith(t.expressionStatement(requireCall));
        return;
      }

      const decls = [];
      for (const spec of specifiers) {
        if (t.isImportDefaultSpecifier(spec)) {
          decls.push(
            t.variableDeclarator(
              spec.local,
              t.memberExpression(requireCall, t.identifier('default'))
            )
          );
        } else if (t.isImportNamespaceSpecifier(spec)) {
          decls.push(t.variableDeclarator(spec.local, requireCall));
        } else if (t.isImportSpecifier(spec)) {
          // import { foo as bar } from './m'
          const imported = spec.imported.name || spec.imported.value;
          decls.push(
            t.variableDeclarator(
              spec.local,
              t.memberExpression(requireCall, t.identifier(imported))
            )
          );
        }
      }
      p.replaceWith(t.variableDeclaration('const', decls));
    },

    ExportDefaultDeclaration(p) {
      const decl = p.node.declaration;
      if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) {
        const name = decl.id ? decl.id.name : null;
        if (name) {
          p.replaceWithMultiple([
            decl,
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('exports'), t.identifier('default')),
                t.identifier(name)
              )
            ),
          ]);
        } else {
          p.replaceWith(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('exports'), t.identifier('default')),
                decl
              )
            )
          );
        }
      } else {
        p.replaceWith(
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(t.identifier('exports'), t.identifier('default')),
              decl
            )
          )
        );
      }
    },

    ExportNamedDeclaration(p) {
      // export { a, b as c } from './m' —— 教学版不支持，明确报错
      if (p.node.source) {
        throw new Error(
          'Mini Webpack 不支持 re-export (export ... from). 请改为先 import 再 export。'
        );
      }

      if (p.node.declaration) {
        const decl = p.node.declaration;
        if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) {
          const name = decl.id.name;
          p.replaceWithMultiple([
            decl,
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('exports'), t.identifier(name)),
                t.identifier(name)
              )
            ),
          ]);
        } else if (t.isVariableDeclaration(decl)) {
          const assignments = [];
          for (const d of decl.declarations) {
            if (t.isIdentifier(d.id)) {
              assignments.push(
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(t.identifier('exports'), t.identifier(d.id.name)),
                    t.identifier(d.id.name)
                  )
                )
              );
            }
          }
          p.replaceWithMultiple([decl, ...assignments]);
        }
      } else if (p.node.specifiers && p.node.specifiers.length) {
        const stmts = p.node.specifiers.map((spec) => {
          const exported = spec.exported.name || spec.exported.value;
          const local = spec.local.name;
          return t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(t.identifier('exports'), t.identifier(exported)),
              t.identifier(local)
            )
          );
        });
        p.replaceWithMultiple(stmts);
      }
    },
  });
}

/**
 * 创建单个模块记录：解析依赖、分配 id、转换代码
 * @param {string} absolutePath
 * @param {Map<string, object>} moduleMap  absPath -> module
 * @param {boolean} debug
 */
function createModule(absolutePath, moduleMap, debug) {
  if (moduleMap.has(absolutePath)) {
    return moduleMap.get(absolutePath);
  }

  const id = moduleIdCounter++;
  const { code, ast } = parseFile(absolutePath, debug);
  const rawDeps = collectDependencies(ast);

  const depIdMap = {}; // relative specifier -> id (filled after resolving)
  const resolvedDeps = [];

  const mod = {
    id,
    absolutePath,
    rawDeps,
    depIdMap,
    code: null, // filled after transform
    factory: null,
  };
  moduleMap.set(absolutePath, mod);

  // 先递归解析依赖，再变换 AST（需要 dep id）
  const dir = path.dirname(absolutePath);
  for (const rel of rawDeps) {
    let resolved = path.resolve(dir, rel);
    if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.js')) {
      resolved = resolved + '.js';
    }
    if (!fs.existsSync(resolved)) {
      throw new Error(`Cannot resolve "${rel}" from ${absolutePath}`);
    }
    const child = createModule(resolved, moduleMap, debug);
    depIdMap[rel] = child.id;
    resolvedDeps.push(resolved);
  }

  transformEsmToCjs(ast, depIdMap);
  const generated = generate(ast, { comments: false }, code).code;
  mod.code = generated;
  mod.resolvedDeps = resolvedDeps;

  if (debug) {
    console.log(`\n[Module #${id}] ${absolutePath}`);
    console.log(`  deps: ${JSON.stringify(depIdMap)}`);
    console.log(`  transformed preview:\n${generated.slice(0, 200)}...`);
  }

  return mod;
}

/**
 * 从入口递归构建模块表（依赖图）
 * @param {string} entryPath
 * @param {boolean} debug
 */
function buildDependencyGraph(entryPath, debug) {
  moduleIdCounter = 0;
  const absEntry = path.resolve(entryPath);
  const moduleMap = new Map();
  createModule(absEntry, moduleMap, debug);

  const modules = Array.from(moduleMap.values()).sort((a, b) => a.id - b.id);

  if (debug) {
    console.log('\n[Dependency Graph]');
    for (const m of modules) {
      console.log(`  #${m.id} ${path.relative(process.cwd(), m.absolutePath)}`);
      for (const [rel, depId] of Object.entries(m.depIdMap)) {
        console.log(`      └─ ${rel} -> #${depId}`);
      }
    }
  }

  return { modules, entryId: moduleMap.get(absEntry).id };
}

/**
 * 生成最终 bundle：IIFE + __require + 模块缓存
 * @param {{modules: object[], entryId: number}} graph
 * @param {boolean} debug
 */
function generateBundle(graph, debug) {
  const { modules, entryId } = graph;

  const moduleTable = modules
    .map((m) => {
      return `  ${m.id}: function(exports, __require) {\n${m.code
        .split('\n')
        .map((l) => '    ' + l)
        .join('\n')}\n  }`;
    })
    .join(',\n');

  const bundle = `/**
 * Generated by Mini Webpack (teaching bundler)
 * entry module id: ${entryId}
 */
(function(modules) {
  var cache = {};

  /**
   * 教学版 __require：查缓存 → 执行工厂 → 返回 exports
   * 与 Webpack 的 __webpack_require__ 同构，但功能少得多。
   */
  function __require(id) {
    if (cache[id]) {
      return cache[id].exports;
    }
    var module = (cache[id] = { exports: {} });
    modules[id](module.exports, __require);
    return module.exports;
  }

  __require(${entryId});
})({
${moduleTable}
});
`;

  if (debug) {
    console.log('\n[Module Table]');
    for (const m of modules) {
      console.log(`  #${m.id} ${m.absolutePath}`);
    }
    console.log('\n[Bundle preview] first 500 chars:');
    console.log(bundle.slice(0, 500));
  }

  return bundle;
}

/**
 * 主入口：打包并可选写入文件
 * @param {string} entry
 * @param {{ output?: string, debug?: boolean }} options
 */
function bundle(entry, options = {}) {
  const debug = !!options.debug;
  if (debug) console.log(`[Mini Webpack] entry=${entry}`);

  const graph = buildDependencyGraph(entry, debug);
  const code = generateBundle(graph, debug);

  if (options.output) {
    const out = path.resolve(options.output);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, code, 'utf-8');
    if (debug) console.log(`\n[Write] ${out} (${code.length} bytes)`);
  }

  return { code, graph };
}

module.exports = {
  bundle,
  buildDependencyGraph,
  generateBundle,
  parseFile,
  collectDependencies,
  createModule,
};
