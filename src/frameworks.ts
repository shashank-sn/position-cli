import type { PositioningData, TemplateMode } from './types.js';

const VAGUE_PATTERNS = [
  /\beveryone\b/i,
  /\ball\b/i,
  /\banyone\b/i,
  /\bbetter\b(?! than)/i,
  /\bhelp\b(?! (?:[a-z]+ )*(?:do|achieve|get|build|create))/i,
];

export function isVagueAnswer(answer: string): boolean {
  const trimmed = answer.trim().toLowerCase();
  if (trimmed.length < 5) return true;
  if (VAGUE_PATTERNS.some((p) => p.test(trimmed))) return true;
  return false;
}

export function validateAudience(audience: string): string | null {
  if (isVagueAnswer(audience)) {
    return 'Your audience sounds broad. Try: "B2B SaaS founders with $50K MRR" instead of "businesses".';
  }
  return null;
}

export function validateOnlyness(
  category: string,
  capability: string,
): string | null {
  if (capability.length < 10) {
    return 'Your unique capability needs more detail. What specifically can you credibly own?';
  }
  const generic = ['best', 'quality', 'great', 'good', 'fast', 'cheap', 'easy'];
  const words = capability.toLowerCase().split(/\s+/);
  const genericCount = words.filter((w) => generic.includes(w)).length;
  if (genericCount >= 2) {
    return '"Best quality" or "great service" are generic. What can competitors NOT copy in a week?';
  }
  return null;
}

function stripLeadingWeHelp(s: string): string {
  return s
    .replace(/^(we help|we enable|we make it easy for .*? to)\s+/i, '')
    .replace(/\.$/, '')
    .trim();
}

export function assemblePositioningStatement(d: PositioningData): string {
  const what = stripLeadingWeHelp(d.identity.oneSentence).toLowerCase();
  return `We help ${d.identity.audience} ${what} better than ${d.identity.alternative}.`;
}

export function assembleSixtySecondStatement(d: PositioningData): string {
  return `We help ${d.identity.audience} achieve ${d.sixtySecond.outcome} through ${d.sixtySecond.uniqueMethod} so they can ${d.sixtySecond.ultimateBenefit}.`;
}

function ensureVerb(s: string): string {
  const verbs = ['uses', 'use', 'has', 'have', 'is', 'are', 'does', 'do', 'builds', 'build', 'offers', 'offer', 'leverages', 'combines', 'provides', 'creates', 'delivers'];
  const firstWord = s.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  if (verbs.includes(firstWord)) return s;
  return `uses ${s}`;
}

export function assembleOnlynessStatement(d: PositioningData): string {
  const cap = ensureVerb(d.onlyness.uniqueCapability);
  return `We're the only ${d.onlyness.category} that ${cap}, which means customers get ${d.onlyness.specificBenefit}.`;
}

export function assembleBrandPromise(d: PositioningData): string {
  return `When you choose ${d.identity.brandName}, you can count on ${d.brandPromise.promise} because we ${d.brandPromise.processProof}.`;
}

export function assembleVoiceStatement(d: PositioningData): string {
  return `We are ${d.voice.personalityTrait}, so we sound ${d.voice.soundLike}, not ${d.voice.oppositeTone}.`;
}

export function assembleVillainStatement(d: PositioningData): string {
  return `We're against ${d.villain.villain}. ${d.villain.whyWrong}`;
}

export function assembleAntiPositioning(d: PositioningData): string {
  return `This is NOT for ${d.antiPositioning.notFor}. We lose ${d.antiPositioning.loseByExcluding}, but we gain ${d.antiPositioning.gainByExcluding}.`;
}

export function getTemplateSections(mode: TemplateMode): string[] {
  switch (mode) {
    case 'pitch':
      return ['positioning', 'onlyness', 'promise'];
    case 'one-pager':
      return ['positioning', 'onlyness', 'villain', 'anti-positioning'];
    case 'full':
    default:
      return [
        'positioning',
        'sixty-second',
        'onlyness',
        'promise',
        'voice',
        'heaven-hell',
        'villain',
        'anti-positioning',
      ];
  }
}

export function createEmptyPositioningData(): PositioningData {
  return {
    version: 1,
    identity: {
      brandName: '',
      oneSentence: '',
      audience: '',
      problem: '',
      alternative: '',
    },
    sixtySecond: {
      outcome: '',
      uniqueMethod: '',
      ultimateBenefit: '',
    },
    onlyness: {
      category: '',
      uniqueCapability: '',
      specificBenefit: '',
    },
    brandPromise: {
      promise: '',
      processProof: '',
      outcomeProof: '',
      transparencyProof: '',
    },
    voice: {
      personalityTrait: '',
      soundLike: '',
      oppositeTone: '',
      bannedWords: '',
    },
    heavenHell: {
      hellFunctional: '',
      hellEmotional: '',
      hellSocial: '',
      heavenFunctional: '',
      heavenEmotional: '',
      heavenSocial: '',
    },
    villain: {
      villain: '',
      whyWrong: '',
    },
    antiPositioning: {
      notFor: '',
      loseByExcluding: '',
      gainByExcluding: '',
    },
  };
}
