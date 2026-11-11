# Phase 5: research and suggest

The purpose is to find the solutions that fit exactly this person. Neither the person nor you have the answer in advance. You must not simply build from what you believe; you have to research it.

## Step 1: Make the problem list

Go through the profile and the mapping, and write a numbered list in `.startkit/plan.md`:
- every annoyance and every recurring mistake (round C),
- every place where the way of working loses time or overview (round B),
- every wish for the overview (round H),
- everything in round F that concerns the real world,
- things the person did *not* mention, but which the answers reveal (for example no backup, keys in the code, one chat for everything, no way to check "done").

Write the person's own words next to each point. Show the list, and ask: "Are these the right problems, and are any missing?" Ask the person to point out the three most important.

## Step 2: Sort

For each point:
- **Known answer:** if the solution is in `knowledge.md`, use it. Do not search the web for something you already have a tried answer to.
- **Covered by the fixed foundation:** say so, and move on.
- **Needs research:** everything else, and everything that depends on current facts (models, prices, limits, what Codex can do right now, requirements for payment, emails and personal data).

## Step 3: Research (targeted)

The research must not itself become a waste of tokens. Rules:
- Research only points from the list. The three most important first.
- Official documentation first (OpenAI's Codex documentation, the provider's own pages, authorities for legal requirements). Blogs and forums only as a supplement, and say so when a source is unofficial.
- At most 3-4 lookups per point. If you do not find a good answer, write "not found" in the plan. Do not guess.
- Check the date. Advice about AI tools that is more than six months old may be out of date.
- If the sources disagree, say so, and suggest that you try it in practice instead of picking one.
- Note the source (address) next to each finding.

If Superpowers is installed, use its brainstorming skill when you have to choose between several possible solutions to a point.

## Step 4: Write the suggestions

For each point in `.startkit/plan.md`:

```
### 3. Loses track of what is finished
Your words: "…"
Suggestion: …
Why it helps: … (which of the four goals)
How it is enforced: hook / test / check before commit / fixed habit / text rule
Effort: small / medium / large (and what it requires of you)
Source: …
Uncertainty: … (what has not been tried)
Your answer: yes / no / later
```

Rules for the suggestions:
- Always choose the **smallest** solution that solves the problem. No new tool if a file or a habit can do it.
- Prefer a lock (hook, test) over a text rule when something must not go wrong.
- Do not prefer agents or more add-ons unless the gain is clear. Every add-on costs tokens in every chat.
- Say honestly if a problem cannot be solved completely, and what the next best thing is.
- Do not promise numbers ("saves 50 %") that you cannot measure.

## Step 5: Go through it with the person

Go through the suggestions one at a time, most important first. Get yes, no or later for each, and write the answer in. End with a short order: "First we set up the fixed foundation (phase 6), then 1, 3 and 5."

## The model guide (always made)

Based on the person's own model list (from `/model` in phase 2) and the principles in `knowledge.md` point 5: write a short guide of 3-4 lines, "use X for ...". Look up the models' current descriptions in OpenAI's documentation if the list does not explain itself. Save it in `.startkit/config.json` under `model_guide` (a list of text lines), so it is shown in the overview, and put a date on it. Tell the person that the guide should be checked again when new models arrive.
