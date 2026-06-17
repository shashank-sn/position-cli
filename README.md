# position

`npx position` — walks you through the Stand The F*ck Out positioning playbook and writes a complete brand positioning doc. Takes your raw answers, runs them through 5 frameworks, and gives you a markdown file you can paste into your README, landing page, or pitch deck.

Most founders skip positioning because it feels abstract. This makes it concrete — 30 questions, 8 sections, one document.

---

## Quick start

```bash
npx position
```

That's it. The CLI walks you through every section.

---

## All commands

```bash
# Interactive questionnaire (default)
npx position

# Output to a specific file
npx position --output ./brand-positioning.md

# Save responses as JSON (resume later)
npx position --save-json ./draft.json

# Pick up where you left off
npx position --resume ./draft.json

# Skip prompts — pass answers as flags
npx position --name "Acme" --audience "SaaS founders" --problem "slow sales"

# Choose a template
npx position --template pitch
npx position --template one-pager
```

---

## Templates

| Template | What you get |
|----------|-------------|
| `full` | All 8 sections — positioning, 60-second test, onlyness, brand promise, voice, heaven/hell, villain, anti-positioning |
| `pitch` | Positioning + onlyness + brand promise. Enough for a one-pager. |
| `one-pager` | Positioning + onlyness + villain + anti-positioning. Enough to know who you are and who you're not. |

---

## The 8 sections

Each section maps to a framework from the STFO playbook. You can skip any section.

1. **Identity** — Name, what you do, who it's for, what problem, what alternative
2. **60-Second Positioning Test** — Outcome, method, benefit. One sentence that holds up.
3. **Onlyness USP** — The only [category] that [capability]. Hard to copy.
4. **Brand Promise + Proof** — What you promise, how you prove it, what you show that others hide.
5. **Voice Definition** — Personality, tone, banned words.
6. **Heaven vs Hell** — Functional/emotional/social frustrations vs desires. The bridge between them.
7. **The Villain** — What you're against. Not a competitor — a broken norm.
8. **Anti-Positioning** — Who you're NOT for. What you lose. What you gain.

---

## What the output looks like

```markdown
# Brand Positioning: Acme

## Positioning Statement
We help B2B SaaS founders with $50K MRR predictably grow revenue
better than manual outreach and spreadsheets.

## Onlyness Statement
We're the only sales tool that uses AI to write cold emails in
your founder voice, which means replies come faster and sound like you.

## The Villain
We're against mass-produced, impersonal cold email templates.
They treat founders like data points, not people.

## Anti-Positioning
This is NOT for people who want to blast 10,000 emails and hope
for the best. We lose volume-focused customers, but we gain a
community of founders who care about quality.
```

---

## Methodology

Derived from the [Stand The F*ck Out](https://github.com/shashank-sn/stand-the-fuck-out) playbook:

- **The Positioning Playbook** — 5 frameworks for finding and claiming a defensible position
- **The Positioning Statement Generator** — Anatomy of statements that work vs. ones that don't
- **The Competitive Differentiation System** — Tiers, maps, and competitor types
- **Brand Foundation Sprint** — WHO/WHAT/ALTERNATIVE in under 30 minutes
- **How to Stand the F\*ck Out** — Onlyness, villain framing, anti-positioning, signal-finding

---

## License

MIT
