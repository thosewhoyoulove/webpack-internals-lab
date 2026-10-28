#!/usr/bin/env node
/**
 * Mini Webpack CLI
 * 用法: node cli.js <entry> -o <output> [--debug]
 */
const path = require('path');
const { bundle } = require('./bundler');

function parseArgs(argv) {
  const args = { entry: null, output: null, debug: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '-o' || rest[i] === '--output') {
      args.output = rest[++i];
    } else if (rest[i] === '--debug' || rest[i] === '-d') {
      args.debug = true;
    } else if (!rest[i].startsWith('-') && !args.entry) {
      args.entry = rest[i];
    }
  }
  return args;
}

const args = parseArgs(process.argv);
if (!args.entry) {
  console.error('Usage: node cli.js <entry.js> -o <bundle.js> [--debug]');
  process.exit(1);
}

const result = bundle(args.entry, {
  output: args.output || path.join(process.cwd(), 'dist', 'bundle.js'),
  debug: args.debug,
});

console.log(
  `Mini Webpack OK: ${Object.keys(result.graph.modules).length || result.graph.modules.length} modules → ${args.output || 'dist/bundle.js'}`
);
