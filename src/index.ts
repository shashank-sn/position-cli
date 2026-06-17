import { Command } from 'commander';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import type { CliOptions, PositioningData, TemplateMode } from './types.js';
import { runQuestions } from './questions.js';
import { buildTemplate } from './template.js';
import { createEmptyPositioningData } from './frameworks.js';

const program = new Command();

program
  .name('position')
  .description(
    'Interactive CLI that scaffolds brand positioning docs from the Stand The F*ck Out methodology',
  )
  .version('0.1.0')
  .option('-o, --output <path>', 'Output markdown file path', './positioning.md')
  .option('--save-json <path>', 'Save raw responses as JSON for resumption')
  .option('--resume <path>', 'Resume from a saved JSON file')
  .option('--name <name>', 'Brand/product name (skip prompt)')
  .option('--audience <audience>', 'Target audience (skip prompt)')
  .option('--problem <problem>', 'Problem you solve (skip prompt)')
  .option(
    '-t, --template <mode>',
    'Output template: full, pitch, one-pager',
    'full',
  )
  .action(async (opts: CliOptions) => {
    try {
      const validTemplates: TemplateMode[] = ['full', 'pitch', 'one-pager'];
      if (!validTemplates.includes(opts.template as TemplateMode)) {
        p.log.error(
          chalk.red(`Invalid template "${opts.template}". Use: full, pitch, one-pager`),
        );
        process.exit(1);
      }

      let data: PositioningData;

      if (opts.resume) {
        const resumePath = path.resolve(opts.resume);
        if (!fs.existsSync(resumePath)) {
          p.log.error(chalk.red(`Resume file not found: ${resumePath}`));
          process.exit(1);
        }
        const raw = fs.readFileSync(resumePath, 'utf-8');
        data = JSON.parse(raw) as PositioningData;
        p.log.success(chalk.green(`Loaded responses from ${resumePath}`));
      } else {
        data = await runQuestions(opts);
      }

      if (opts.saveJson) {
        const jsonPath = path.resolve(opts.saveJson);
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
        p.log.success(chalk.green(`Saved responses to ${jsonPath}`));
      }

      const markdown = buildTemplate(data, opts.template as TemplateMode);
      const outputPath = path.resolve(opts.output);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, markdown, 'utf-8');

      p.outro(
        chalk.green(`✓ Positioning doc written to ${outputPath}`) +
          '\n' +
          chalk.dim(`  Template: ${opts.template}`),
      );
    } catch (err) {
      p.log.error(
        chalk.red(err instanceof Error ? err.message : String(err)),
      );
      process.exit(1);
    }
  });

program.parse();
