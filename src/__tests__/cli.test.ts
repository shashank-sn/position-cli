import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CLI = path.resolve(__dirname, '../../dist/index.js');
const TMP = path.resolve(__dirname, '../../.tmp-test');
const run = (args: string) =>
  execSync(`node "${CLI}" ${args}`, { encoding: 'utf-8', timeout: 5000 }).trim();

describe('CLI smoke tests', () => {
  it('--help prints usage', () => {
    const out = run('--help');
    expect(out).toContain('Usage: position');
    expect(out).toContain('--output');
    expect(out).toContain('--save-json');
    expect(out).toContain('--resume');
    expect(out).toContain('--template');
    expect(out).toContain('--name');
    expect(out).toContain('--audience');
    expect(out).toContain('--problem');
  });

  it('--version prints version', () => {
    const out = run('--version');
    expect(out).toBe('0.1.0');
  });

  it('exits with error for invalid template', () => {
    try {
      run('--template bogus');
      expect.fail('should have thrown');
    } catch (err: unknown) {
      const e = err as { status?: number; stderr?: string; stdout?: string };
      expect(e.status).not.toBe(0);
    }
  });

  it('exits with error for missing resume file', () => {
    try {
      run('--resume /tmp/nonexistent-position-file-xyz.json');
      expect.fail('should have thrown');
    } catch (err: unknown) {
      const e = err as { status?: number; stderr?: string; stdout?: string };
      expect(e.status).not.toBe(0);
    }
  });

  it('resume + template pipeline writes output', () => {
    fs.mkdirSync(TMP, { recursive: true });
    const jsonPath = path.join(TMP, 'test-data.json');
    const outPath = path.join(TMP, 'test-output.md');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        version: 1,
        identity: {
          brandName: 'CLITest',
          oneSentence: 'ship products faster',
          audience: 'startup founders',
          problem: 'slow iteration',
          alternative: 'hiring more engineers',
        },
        sixtySecond: { outcome: '', uniqueMethod: '', ultimateBenefit: '' },
        onlyness: { category: '', uniqueCapability: '', specificBenefit: '' },
        brandPromise: { promise: '', processProof: '', outcomeProof: '', transparencyProof: '' },
        voice: { personalityTrait: '', soundLike: '', oppositeTone: '', bannedWords: '' },
        heavenHell: { hellFunctional: '', hellEmotional: '', hellSocial: '', heavenFunctional: '', heavenEmotional: '', heavenSocial: '' },
        villain: { villain: '', whyWrong: '' },
        antiPositioning: { notFor: '', loseByExcluding: '', gainByExcluding: '' },
      }),
      'utf-8',
    );

    const out = run(`--resume "${jsonPath}" --template full --output "${outPath}"`);
    expect(out).toContain('Positioning doc written to');
    expect(fs.existsSync(outPath)).toBe(true);
    const md = fs.readFileSync(outPath, 'utf-8');
    expect(md).toContain('# Brand Positioning: CLITest');
    expect(md).toContain('ship products faster');

    // cleanup
    fs.unlinkSync(outPath);
    fs.unlinkSync(jsonPath);
  });

  it('resume + pitch template writes minimal output', () => {
    fs.mkdirSync(TMP, { recursive: true });
    const jsonPath = path.join(TMP, 'test-pitch.json');
    const outPath = path.join(TMP, 'test-pitch.md');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        version: 1,
        identity: {
          brandName: 'PitchTest',
          oneSentence: 'automate compliance',
          audience: 'fintech startups',
          problem: 'regulatory overhead',
          alternative: 'manual audits',
        },
        sixtySecond: { outcome: 'zero audit findings', uniqueMethod: 'continuous monitoring', ultimateBenefit: 'peace of mind' },
        onlyness: { category: 'compliance tool', uniqueCapability: 'real-time regulatory change detection', specificBenefit: 'never miss a rule change' },
        brandPromise: { promise: 'zero audit findings', processProof: 'automated monitoring', outcomeProof: '99.8% compliance rate', transparencyProof: 'full audit trail' },
        voice: { personalityTrait: '', soundLike: '', oppositeTone: '', bannedWords: '' },
        heavenHell: { hellFunctional: '', hellEmotional: '', hellSocial: '', heavenFunctional: '', heavenEmotional: '', heavenSocial: '' },
        villain: { villain: '', whyWrong: '' },
        antiPositioning: { notFor: '', loseByExcluding: '', gainByExcluding: '' },
      }),
      'utf-8',
    );

    run(`--resume "${jsonPath}" --template pitch --output "${outPath}"`);
    const md = fs.readFileSync(outPath, 'utf-8');
    expect(md).toContain('# PitchTest — Positioning Pitch');
    expect(md).toContain('## Positioning Statement');
    expect(md).toContain('## Onlyness Statement');
    expect(md).toContain('## Brand Promise');
    expect(md).not.toContain('## Heaven vs Hell');

    fs.unlinkSync(outPath);
    fs.unlinkSync(jsonPath);
  });

  it('resume + one-pager template writes correct sections', () => {
    fs.mkdirSync(TMP, { recursive: true });
    const jsonPath = path.join(TMP, 'test-onepager.json');
    const outPath = path.join(TMP, 'test-onepager.md');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        version: 1,
        identity: {
          brandName: 'OnePagerTest',
          oneSentence: 'simplify hiring',
          audience: 'engineering managers',
          problem: 'bad hires',
          alternative: 'gut feeling',
        },
        sixtySecond: { outcome: '', uniqueMethod: '', ultimateBenefit: '' },
        onlyness: { category: 'hiring platform', uniqueCapability: 'blind skill-based assessments', specificBenefit: 'bias-free hiring' },
        brandPromise: { promise: '', processProof: '', outcomeProof: '', transparencyProof: '' },
        voice: { personalityTrait: '', soundLike: '', oppositeTone: '', bannedWords: '' },
        heavenHell: { hellFunctional: '', hellEmotional: '', hellSocial: '', heavenFunctional: '', heavenEmotional: '', heavenSocial: '' },
        villain: { villain: 'resume-based hiring', whyWrong: 'resumes tell you where someone worked, not how they think' },
        antiPositioning: { notFor: 'companies that hire on culture fit alone', loseByExcluding: 'fast-moving startups', gainByExcluding: 'teams that actually ship' },
      }),
      'utf-8',
    );

    run(`--resume "${jsonPath}" --template one-pager --output "${outPath}"`);
    const md = fs.readFileSync(outPath, 'utf-8');
    expect(md).toContain('# OnePagerTest — One Pager');
    expect(md).toContain('## Positioning');
    expect(md).toContain('## Onlyness');
    expect(md).toContain('## The Villain');
    expect(md).toContain('## Anti-Positioning');
    expect(md).not.toContain('## Brand Promise');
    expect(md).not.toContain('## Heaven vs Hell');

    fs.unlinkSync(outPath);
    fs.unlinkSync(jsonPath);
  });

  it('--save-json writes valid JSON', () => {
    fs.mkdirSync(TMP, { recursive: true });
    const jsonPath = path.join(TMP, 'test-save.json');
    const outPath = path.join(TMP, 'test-save.md');
    const resumePath = path.join(TMP, 'test-save-src.json');

    // Need a resume file since we can't run interactive
    fs.writeFileSync(
      resumePath,
      JSON.stringify({
        version: 1,
        identity: { brandName: 'SaveTest', oneSentence: 'test', audience: 'testers', problem: 'bugs', alternative: 'manual QA' },
        sixtySecond: { outcome: '', uniqueMethod: '', ultimateBenefit: '' },
        onlyness: { category: '', uniqueCapability: '', specificBenefit: '' },
        brandPromise: { promise: '', processProof: '', outcomeProof: '', transparencyProof: '' },
        voice: { personalityTrait: '', soundLike: '', oppositeTone: '', bannedWords: '' },
        heavenHell: { hellFunctional: '', hellEmotional: '', hellSocial: '', heavenFunctional: '', heavenEmotional: '', heavenSocial: '' },
        villain: { villain: '', whyWrong: '' },
        antiPositioning: { notFor: '', loseByExcluding: '', gainByExcluding: '' },
      }),
      'utf-8',
    );

    run(`--resume "${resumePath}" --save-json "${jsonPath}" --output "${outPath}"`);
    expect(fs.existsSync(jsonPath)).toBe(true);
    const saved = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(saved.version).toBe(1);
    expect(saved.identity.brandName).toBe('SaveTest');

    fs.unlinkSync(jsonPath);
    fs.unlinkSync(outPath);
    fs.unlinkSync(resumePath);
  });

  it('output flag creates parent directories', () => {
    fs.mkdirSync(TMP, { recursive: true });
    const deepPath = path.join(TMP, 'nested', 'dir', 'output.md');
    const resumePath = path.join(TMP, 'deep-test.json');
    fs.writeFileSync(
      resumePath,
      JSON.stringify({
        version: 1,
        identity: { brandName: 'DeepTest', oneSentence: 'nested output test', audience: 'devs', problem: 'paths', alternative: 'flat files' },
        sixtySecond: { outcome: '', uniqueMethod: '', ultimateBenefit: '' },
        onlyness: { category: '', uniqueCapability: '', specificBenefit: '' },
        brandPromise: { promise: '', processProof: '', outcomeProof: '', transparencyProof: '' },
        voice: { personalityTrait: '', soundLike: '', oppositeTone: '', bannedWords: '' },
        heavenHell: { hellFunctional: '', hellEmotional: '', hellSocial: '', heavenFunctional: '', heavenEmotional: '', heavenSocial: '' },
        villain: { villain: '', whyWrong: '' },
        antiPositioning: { notFor: '', loseByExcluding: '', gainByExcluding: '' },
      }),
      'utf-8',
    );

    run(`--resume "${resumePath}" --output "${deepPath}"`);
    expect(fs.existsSync(deepPath)).toBe(true);

    // cleanup
    fs.rmSync(path.join(TMP, 'nested'), { recursive: true });
    fs.unlinkSync(resumePath);
  });
});
