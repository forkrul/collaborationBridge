#!/usr/bin/env node

import { Command } from 'commander'
import { createComponent } from './commands/create-component'
import { generateTheme } from './commands/generate-theme'
import { analyzeBundle } from './commands/analyze-bundle'
import { runTests } from './commands/run-tests'

const program = new Command()

program
  .name('@company/cli')
  .description('CLI tool for managing the design system')
  .version('1.0.0')

// Component generation command
program
  .command('create')
  .alias('c')
  .description('Create a new component')
  .option('-n, --name <name>', 'Component name')
  .option('-t, --type <type>', 'Component type (basic, form, data, layout)')
  .option('--no-tests', 'Skip test file generation')
  .option('--no-stories', 'Skip Storybook story generation')
  .action(createComponent)

// Theme generation command
program
  .command('theme')
  .alias('t')
  .description('Generate or modify themes')
  .option('-n, --name <name>', 'Theme name')
  .option('-b, --base <base>', 'Base theme to extend from')
  .action(generateTheme)

// Bundle analysis command
program
  .command('analyze')
  .alias('a')
  .description('Analyze bundle size and performance')
  .option('-p, --package <package>', 'Specific package to analyze')
  .option('-o, --output <output>', 'Output format (json, html, text)')
  .action(analyzeBundle)

// Testing command
program
  .command('test')
  .description('Run tests with various options')
  .option('-w, --watch', 'Watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .option('-a, --a11y', 'Run accessibility tests')
  .action(runTests)

program.parse()
