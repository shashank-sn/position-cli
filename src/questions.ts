import * as p from '@clack/prompts';
import chalk from 'chalk';
import type { PositioningData, CliOptions } from './types.js';
import {
  createEmptyPositioningData,
  validateAudience,
  validateOnlyness,
  isVagueAnswer,
} from './frameworks.js';

const PERSONALITY_TRAITS = [
  { value: 'Approachable', label: 'Approachable' },
  { value: 'Authentic', label: 'Authentic' },
  { value: 'Bold', label: 'Bold' },
  { value: 'Caring', label: 'Caring' },
  { value: 'Minimalist', label: 'Minimalist' },
  { value: 'Rebellious', label: 'Rebellious' },
  { value: 'Authoritative', label: 'Authoritative' },
  { value: 'Playful', label: 'Playful' },
];

function warnIfVague(value: string, hint: string): void {
  if (isVagueAnswer(value)) {
    p.log.warn(chalk.yellow(hint));
  }
}

async function askText(message: string, placeholder?: string): Promise<string> {
  const result = await p.text({
    message,
    placeholder,
    validate: (value) => {
      if (!value || value.trim().length === 0) return 'This field is required.';
    },
  });
  if (p.isCancel(result)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
  return result.trim();
}

async function askOptionalSection(
  sectionName: string,
): Promise<boolean> {
  const skip = await p.confirm({
    message: `Skip the ${sectionName} section?`,
    initialValue: false,
  });
  if (p.isCancel(skip)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
  return !skip;
}

function sectionHeader(current: number, total: number, name: string): void {
  p.log.info(
    chalk.dim(`Section ${current} of ${total}:`) + ' ' + chalk.bold(name),
  );
}

export async function runQuestions(
  options: Partial<CliOptions>,
): Promise<PositioningData> {
  const data = createEmptyPositioningData();
  const totalSections = 8;

  p.intro(chalk.bold('🎯 Position — Brand Positioning Generator'));
  p.log.message(
    chalk.dim(
      "Based on the Stand The F*ck Out methodology. Answer each question honestly — you can skip sections.\n",
    ),
  );

  // ─── Section 1: Identity ───
  sectionHeader(1, totalSections, 'Identity');

  data.identity.brandName =
    options.name ||
    (await askText("What's your brand/product called?", 'e.g. Acme'));

  data.identity.oneSentence = await askText(
    'In one sentence, what do you do?',
    'Not features — the transformation you create',
  );

  data.identity.audience =
    options.audience ||
    (await askText(
      'Who specifically is this for?',
      'e.g. B2B SaaS founders with $50K MRR who hit a growth plateau',
    ));
  const audienceWarning = validateAudience(data.identity.audience);
  if (audienceWarning) p.log.warn(chalk.yellow(audienceWarning));

  data.identity.problem =
    options.problem ||
    (await askText(
      'What problem do they have?',
      'The real problem, not surface symptoms',
    ));

  data.identity.alternative = await askText(
    'What do they currently use instead?',
    'Not competitors — the alternative (e.g. "spreadsheets and manual work")',
  );

  // ─── Section 2: 60-Second Positioning ───
  const doSixty = await askOptionalSection('60-Second Positioning');
  if (doSixty) {
    sectionHeader(2, totalSections, 'The 60-Second Positioning Test');

    data.sixtySecond.outcome = await askText(
      'What specific outcome do they achieve?',
      'Not "growth" — e.g. "predictable revenue without burning out"',
    );
    warnIfVague(
      data.sixtySecond.outcome,
      'Try to be more specific about the outcome.',
    );

    data.sixtySecond.uniqueMethod = await askText(
      "What's your unique method?",
      'Not "consulting" — e.g. "4-week intensive with peer accountability"',
    );

    data.sixtySecond.ultimateBenefit = await askText(
      "What's the ultimate benefit?",
      'Not "success" — e.g. "sleep better knowing business runs without you"',
    );
  }

  // ─── Section 3: Onlyness USP ───
  const doOnlyness = await askOptionalSection('Onlyness USP');
  if (doOnlyness) {
    sectionHeader(3, totalSections, 'The Onlyness USP');

    data.onlyness.category = await askText(
      'What category do you belong to?',
      'e.g. "coffee company", "project management tool", "marketing agency"',
    );

    data.onlyness.uniqueCapability = await askText(
      "What's your unique capability?",
      'What can you credibly own that competitors can\'t copy overnight?',
    );

    data.onlyness.specificBenefit = await askText(
      'What specific benefit does that give customers?',
      'What do they get that others can\'t provide?',
    );

    const onlynessWarning = validateOnlyness(
      data.onlyness.category,
      data.onlyness.uniqueCapability,
    );
    if (onlynessWarning) {
      p.log.warn(chalk.yellow(onlynessWarning));
      p.log.message(
        chalk.dim(
          'Consider: Could a competitor claim this? Could they copy it in a week?',
        ),
      );
    }
  }

  // ─── Section 4: Brand Promise + Proof ───
  const doPromise = await askOptionalSection('Brand Promise + Proof');
  if (doPromise) {
    sectionHeader(4, totalSections, 'Brand Promise + Proof');

    data.brandPromise.promise = await askText(
      "What's your one specific promise?",
      'One thing customers can count on',
    );

    data.brandPromise.processProof = await askText(
      "What's your process proof?",
      'How do you deliver differently?',
    );

    data.brandPromise.outcomeProof = await askText(
      "What's your outcome proof?",
      'Measurable results, metrics',
    );

    data.brandPromise.transparencyProof = await askText(
      "What's your transparency proof?",
      'What do you show that others hide?',
    );
  }

  // ─── Section 5: Voice Definition ───
  const doVoice = await askOptionalSection('Voice Definition');
  if (doVoice) {
    sectionHeader(5, totalSections, 'Voice Definition');

    const trait = (await p.select({
      message: "What's your brand's personality trait?",
      options: [
        ...PERSONALITY_TRAITS,
        { value: '__custom', label: 'Something else...' },
      ],
    })) as string;
    if (p.isCancel(trait)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
    data.voice.personalityTrait =
      trait === '__custom'
        ? await askText('Describe your personality trait')
        : trait;

    data.voice.soundLike = await askText(
      'How do you sound?',
      'e.g. "friendly and helpful", "honest and direct"',
    );

    data.voice.oppositeTone = await askText(
      "What's the opposite tone you avoid?",
      'e.g. "corporate and intimidating", "polished and salesy"',
    );

    data.voice.bannedWords = await askText(
      'What words/phrases will you never use?',
      'Comma-separated list',
    );
  }

  // ─── Section 6: Heaven vs Hell ───
  const doHeavenHell = await askOptionalSection('Heaven vs Hell');
  if (doHeavenHell) {
    sectionHeader(6, totalSections, 'Heaven vs Hell Mapping');

    p.log.message(chalk.red.bold('🔥 HELL — Where they are now'));

    data.heavenHell.hellFunctional = await askText(
      'Functional frustration: What\'s the practical pain?',
    );
    data.heavenHell.hellEmotional = await askText(
      'Emotional frustration: How does it feel?',
    );
    data.heavenHell.hellSocial = await askText(
      'Social frustration: What\'s the social cost?',
    );

    p.log.message(chalk.green.bold('✨ HEAVEN — Where they want to be'));

    data.heavenHell.heavenFunctional = await askText(
      'Functional desire: What do they want practically?',
    );
    data.heavenHell.heavenEmotional = await askText(
      'Emotional desire: How do they want to feel?',
    );
    data.heavenHell.heavenSocial = await askText(
      'Social desire: What\'s the social payoff?',
    );
  }

  // ─── Section 7: The Villain ───
  const doVillain = await askOptionalSection('The Villain');
  if (doVillain) {
    sectionHeader(7, totalSections, 'The Villain');

    data.villain.villain = await askText(
      "What's your villain?",
      'Not a competitor — an approach, norm, or industry habit that\'s broken',
    );

    data.villain.whyWrong = await askText(
      'Why is this villain wrong?',
      'The case against the status quo',
    );
  }

  // ─── Section 8: Anti-Positioning ───
  const doAnti = await askOptionalSection('Anti-Positioning');
  if (doAnti) {
    sectionHeader(8, totalSections, 'Anti-Positioning');

    data.antiPositioning.notFor = await askText(
      'Who is this NOT for?',
      'Explicit exclusion — be honest',
    );

    data.antiPositioning.loseByExcluding = await askText(
      'What do you lose by excluding them?',
      'Honest about the tradeoff',
    );

    data.antiPositioning.gainByExcluding = await askText(
      'What do you gain?',
      'The belonging you create for the right customer',
    );
  }

  return data;
}
