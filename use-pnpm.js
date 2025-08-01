#!/usr/bin/env node

console.log(
  '\x1b[31m%s\x1b[0m',
  '╔════════════════════════════════════════════════════════════╗'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║                                                            ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║   ⚠️  Please use pnpm instead of npm or yarn               ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║                                                            ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║   Install pnpm:                                            ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║   npm install -g pnpm                                      ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║                                                            ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║   Then run:                                                ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║   pnpm install                                             ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '║                                                            ║'
);
console.log(
  '\x1b[31m%s\x1b[0m',
  '╚════════════════════════════════════════════════════════════╝'
);

process.exit(1);
