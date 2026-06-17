import { describe, it, expect } from 'vitest';
import {
  isVagueAnswer,
  validateAudience,
  validateOnlyness,
  assemblePositioningStatement,
  assembleSixtySecondStatement,
  assembleOnlynessStatement,
  assembleBrandPromise,
  assembleVoiceStatement,
  assembleVillainStatement,
  assembleAntiPositioning,
  createEmptyPositioningData,
  getTemplateSections,
} from '../frameworks.js';
import type { PositioningData } from '../types.js';

// ── isVagueAnswer ──

describe('isVagueAnswer', () => {
  it('flags empty string', () => {
    expect(isVagueAnswer('')).toBe(true);
  });

  it('flags whitespace-only', () => {
    expect(isVagueAnswer('   ')).toBe(true);
  });

  it('flags very short answers (<5 chars)', () => {
    expect(isVagueAnswer('yes')).toBe(true);
    expect(isVagueAnswer('no')).toBe(true);
    expect(isVagueAnswer('ok')).toBe(true);
    expect(isVagueAnswer('a')).toBe(true);
  });

  it('flags exactly 4 chars', () => {
    expect(isVagueAnswer('test')).toBe(true);
  });

  it('passes exactly 5 chars', () => {
    expect(isVagueAnswer('tests')).toBe(false);
  });

  it('flags "everyone"', () => {
    expect(isVagueAnswer('everyone')).toBe(true);
    expect(isVagueAnswer('Everyone')).toBe(true);
    expect(isVagueAnswer('for everyone')).toBe(true);
  });

  it('flags "all"', () => {
    expect(isVagueAnswer('all businesses')).toBe(true);
    expect(isVagueAnswer('All of them')).toBe(true);
  });

  it('flags "anyone"', () => {
    expect(isVagueAnswer('anyone who wants')).toBe(true);
  });

  it('passes specific answers', () => {
    expect(isVagueAnswer('B2B SaaS founders with $50K MRR who hit a growth plateau')).toBe(false);
    expect(isVagueAnswer('remote-first engineering teams building developer tools')).toBe(false);
  });

  it('handles leading/trailing whitespace', () => {
    expect(isVagueAnswer('  everyone  ')).toBe(true);
  });

  it('handles unicode and special chars', () => {
    expect(isVagueAnswer('émojis 🎯 and spëcial chars work fine here')).toBe(false);
  });
});

// ── validateAudience ──

describe('validateAudience', () => {
  it('warns on "everyone"', () => {
    expect(validateAudience('everyone')).not.toBeNull();
  });

  it('warns on "all businesses"', () => {
    expect(validateAudience('all businesses')).not.toBeNull();
  });

  it('warns on short input', () => {
    expect(validateAudience('biz')).not.toBeNull();
  });

  it('passes specific audience', () => {
    expect(validateAudience('B2B SaaS founders with $50K MRR')).toBeNull();
  });

  it('passes long specific audience', () => {
    expect(validateAudience('remote-first engineering teams of 10-50 people building developer tools in Series A startups')).toBeNull();
  });
});

// ── validateOnlyness ──

describe('validateOnlyness', () => {
  it('warns on short capability', () => {
    expect(validateOnlyness('tool', 'best')).not.toBeNull();
  });

  it('warns when 2+ generic words', () => {
    expect(validateOnlyness('tool', 'we have the best quality and great service')).not.toBeNull();
    expect(validateOnlyness('tool', 'fast cheap and easy to use')).not.toBeNull();
  });

  it('passes with 1 generic word (still acceptable)', () => {
    expect(validateOnlyness('tool', 'the fastest AI-powered code review that catches design smells')).toBeNull();
  });

  it('warns on capability under 10 chars', () => {
    expect(validateOnlyness('tool', 'fast')).not.toBeNull();
    expect(validateOnlyness('tool', 'best q')).not.toBeNull();
  });

  it('passes at exactly 10 chars with only 1 generic word', () => {
    expect(validateOnlyness('tool', 'good stuff')).toBeNull();
  });

  it('passes specific capability', () => {
    expect(validateOnlyness('sales tool', 'uses AI to personalize cold emails from founder voice')).toBeNull();
    expect(validateOnlyness('coffee company', 'direct-trade beans roasted within 48 hours of order')).toBeNull();
  });

  it('handles empty inputs', () => {
    expect(validateOnlyness('', '')).not.toBeNull();
  });
});

// ── Assembly Functions ──

function makeData(overrides?: Partial<PositioningData>): PositioningData {
  return {
    ...createEmptyPositioningData(),
    identity: {
      brandName: 'Acme',
      oneSentence: 'We help founders build better products',
      audience: 'B2B SaaS founders with $50K MRR',
      problem: 'slow sales cycles',
      alternative: 'manual outreach and spreadsheets',
    },
    sixtySecond: {
      outcome: 'predictable revenue without burning out',
      uniqueMethod: '4-week intensive with peer accountability',
      ultimateBenefit: 'sleep better knowing business runs without you',
    },
    onlyness: {
      category: 'sales tool',
      uniqueCapability: 'uses AI to personalize cold emails from founder voice',
      specificBenefit: 'emails that sound like them, not templates',
    },
    brandPromise: {
      promise: '30% reply rate on cold outreach',
      processProof: 'AI voice matching from past successful emails',
      outcomeProof: 'Average 32% reply rate across 200+ customers',
      transparencyProof: 'we share our training data methodology publicly',
    },
    voice: {
      personalityTrait: 'Bold',
      soundLike: 'honest and direct',
      oppositeTone: 'corporate and intimidating',
      bannedWords: 'synergy, leverage, disrupt, innovative',
    },
    heavenHell: {
      hellFunctional: 'spending 4 hours/day on manual outreach',
      hellEmotional: 'feeling like a spammer',
      hellSocial: 'being seen as desperate by peers',
      heavenFunctional: 'automated outreach that still feels personal',
      heavenEmotional: 'confident about pipeline',
      heavenSocial: 'respected as someone who scales smartly',
    },
    villain: {
      villain: 'mass-produced, impersonal cold email templates',
      whyWrong: 'They treat founders like data points, not people.',
    },
    antiPositioning: {
      notFor: 'people who want to blast 10,000 emails and hope for the best',
      loseByExcluding: 'volume-focused customers',
      gainByExcluding: 'a community of founders who care about quality',
    },
    ...overrides,
  };
}

describe('assemblePositioningStatement', () => {
  it('strips "We help" from oneSentence', () => {
    const d = makeData();
    const result = assemblePositioningStatement(d);
    expect(result).toBe('We help B2B SaaS founders with $50K MRR founders build better products better than manual outreach and spreadsheets.');
    expect(result).not.toContain('We help B2B SaaS founders with $50K MRR We help');
  });

  it('handles oneSentence without "We help"', () => {
    const d = makeData();
    d.identity.oneSentence = 'build better products faster';
    const result = assemblePositioningStatement(d);
    expect(result).toContain('build better products faster');
  });

  it('strips trailing period from oneSentence', () => {
    const d = makeData();
    d.identity.oneSentence = 'build better products.';
    const result = assemblePositioningStatement(d);
    expect(result).not.toContain('..');
  });

  it('strips "We enable" prefix', () => {
    const d = makeData();
    d.identity.oneSentence = 'We enable teams to ship faster';
    const result = assemblePositioningStatement(d);
    expect(result).toContain('teams to ship faster');
    expect(result).not.toContain('We enable');
  });
});

describe('assembleSixtySecondStatement', () => {
  it('contains all parts', () => {
    const d = makeData();
    const result = assembleSixtySecondStatement(d);
    expect(result).toContain('B2B SaaS founders');
    expect(result).toContain('predictable revenue');
    expect(result).toContain('4-week intensive');
    expect(result).toContain('sleep better');
  });

  it('starts with "We help"', () => {
    expect(assembleSixtySecondStatement(makeData()).startsWith('We help')).toBe(true);
  });
});

describe('assembleOnlynessStatement', () => {
  it('passes through when capability starts with a verb', () => {
    const d = makeData();
    const result = assembleOnlynessStatement(d);
    expect(result).toContain('that uses AI');
    expect(result).not.toContain('that uses uses');
  });

  it('prepends "uses" when capability has no leading verb', () => {
    const d = makeData();
    d.onlyness.uniqueCapability = 'AI voice matching from founder emails';
    const result = assembleOnlynessStatement(d);
    expect(result).toContain('that uses AI voice matching');
  });

  it('handles various verb starts', () => {
    const d = makeData();
    d.onlyness.uniqueCapability = 'leverages blockchain for supply chain tracking';
    expect(assembleOnlynessStatement(d)).toContain('that leverages blockchain');

    d.onlyness.uniqueCapability = 'combines AI with human editors';
    expect(assembleOnlynessStatement(d)).toContain('that combines AI');

    d.onlyness.uniqueCapability = 'provides 24/7 on-call access';
    expect(assembleOnlynessStatement(d)).toContain('that provides 24/7');
  });
});

describe('assembleBrandPromise', () => {
  it('contains brand name, promise, and proof', () => {
    const d = makeData();
    const result = assembleBrandPromise(d);
    expect(result).toContain('Acme');
    expect(result).toContain('30% reply rate');
    expect(result).toContain('AI voice matching');
  });
});

describe('assembleVoiceStatement', () => {
  it('formats trait, sound, and opposite', () => {
    const d = makeData();
    const result = assembleVoiceStatement(d);
    expect(result).toBe('We are Bold, so we sound honest and direct, not corporate and intimidating.');
  });
});

describe('assembleVillainStatement', () => {
  it('contains villain and reason', () => {
    const d = makeData();
    const result = assembleVillainStatement(d);
    expect(result).toContain('mass-produced');
    expect(result).toContain('data points');
  });
});

describe('assembleAntiPositioning', () => {
  it('contains NOT for, lose, and gain', () => {
    const d = makeData();
    const result = assembleAntiPositioning(d);
    expect(result).toContain('NOT for');
    expect(result).toContain('volume-focused');
    expect(result).toContain('quality');
  });
});

// ── getTemplateSections ──

describe('getTemplateSections', () => {
  it('full returns 8 sections', () => {
    expect(getTemplateSections('full')).toHaveLength(8);
  });

  it('pitch returns positioning, onlyness, promise', () => {
    const sections = getTemplateSections('pitch');
    expect(sections).toEqual(['positioning', 'onlyness', 'promise']);
  });

  it('one-pager returns positioning, onlyness, villain, anti-positioning', () => {
    const sections = getTemplateSections('one-pager');
    expect(sections).toEqual(['positioning', 'onlyness', 'villain', 'anti-positioning']);
  });
});

// ── createEmptyPositioningData ──

describe('createEmptyPositioningData', () => {
  it('returns version 1', () => {
    expect(createEmptyPositioningData().version).toBe(1);
  });

  it('has all empty string fields', () => {
    const d = createEmptyPositioningData();
    expect(d.identity.brandName).toBe('');
    expect(d.identity.audience).toBe('');
    expect(d.sixtySecond.outcome).toBe('');
    expect(d.onlyness.category).toBe('');
    expect(d.brandPromise.promise).toBe('');
    expect(d.voice.personalityTrait).toBe('');
    expect(d.heavenHell.hellFunctional).toBe('');
    expect(d.villain.villain).toBe('');
    expect(d.antiPositioning.notFor).toBe('');
  });

  it('has all 8 top-level sections', () => {
    const d = createEmptyPositioningData();
    expect(d).toHaveProperty('identity');
    expect(d).toHaveProperty('sixtySecond');
    expect(d).toHaveProperty('onlyness');
    expect(d).toHaveProperty('brandPromise');
    expect(d).toHaveProperty('voice');
    expect(d).toHaveProperty('heavenHell');
    expect(d).toHaveProperty('villain');
    expect(d).toHaveProperty('antiPositioning');
  });
});
