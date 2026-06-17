export interface IdentityData {
  brandName: string;
  oneSentence: string;
  audience: string;
  problem: string;
  alternative: string;
}

export interface SixtySecondData {
  outcome: string;
  uniqueMethod: string;
  ultimateBenefit: string;
}

export interface OnlynessData {
  category: string;
  uniqueCapability: string;
  specificBenefit: string;
}

export interface BrandPromiseData {
  promise: string;
  processProof: string;
  outcomeProof: string;
  transparencyProof: string;
}

export interface VoiceData {
  personalityTrait: string;
  soundLike: string;
  oppositeTone: string;
  bannedWords: string;
}

export interface HeavenHellData {
  hellFunctional: string;
  hellEmotional: string;
  hellSocial: string;
  heavenFunctional: string;
  heavenEmotional: string;
  heavenSocial: string;
}

export interface VillainData {
  villain: string;
  whyWrong: string;
}

export interface AntiPositioningData {
  notFor: string;
  loseByExcluding: string;
  gainByExcluding: string;
}

export interface PositioningData {
  version: number;
  identity: IdentityData;
  sixtySecond: SixtySecondData;
  onlyness: OnlynessData;
  brandPromise: BrandPromiseData;
  voice: VoiceData;
  heavenHell: HeavenHellData;
  villain: VillainData;
  antiPositioning: AntiPositioningData;
}

export type TemplateMode = 'full' | 'pitch' | 'one-pager';

export interface CliOptions {
  output: string;
  saveJson?: string;
  resume?: string;
  name?: string;
  audience?: string;
  problem?: string;
  template: TemplateMode;
}
