# The project steps (after the foundation, optional)

This is NOT part of the foundation. It is only run when the foundation is ✅ in `.startkit/status.md`, when the person asks for it, and preferably in a new chat. The foundation protects the work; this is the work of finding out what the project should be.

## Before you begin

- Read `STATUS.md` and `docs/recurring-mistakes.md`, so the safety net is in use from the first minute.
- Ask whether the person wants to do it now or another day. The run uses a fair amount of usage (a long interview and research on the web); say so, and check `Settings`.
- Save progress in `.startkit/status.md` under "Project steps", so it can be done in stages.

## Step 1: The thorough interview

Follow `gemini/en/references/interview.md` (8 topics, A-H). It is a flowing conversation, not a form: the questions are starting questions, the number is not fixed, and one answer can cover several questions or lead to new ones. At the start of each round, say which topic it is ("topic 3 of 8"), and why the questions come. Sum up after each round, and ask "is that right?". Update `.startkit/profile.json`; skip the questions the small interview already answered.

## Step 2: Map what already exists (reading only)

If the person already has projects, look only at the structure: a folder listing (two levels), whether there is git and a copy somewhere else, the size of instruction files, the number of open branches, and whether there are old copies and duplicates. Show a short overview. Fix nothing.

## Step 3: Research and suggest

Follow `gemini/en/references/research.md`. Write the result in `.startkit/plan.md`, and go through it with the person: each suggestion with why, source and effort. The person says yes or no to each; nothing is set up without a yes. If Superpowers is installed, use its brainstorming skill. If something is going out to real people (a domain, emails, payment, personal data), include `gemini/en/references/real-world.md` in the plan. After the plan, run `opsaet.js` again (it can be run several times), so the rules are adapted.

## Step 4: The tailored layer

Set up the suggestions the person said yes to, one at a time, with a check after each. Suggest 2-3 improvements to the overview page yourself, based on what the person said in rounds C and H (for example "you said you lose track of what is half finished: should that be at the top?"), and build only what the person says yes to. If the project has a way to publish to the internet (for example a deploy command), suggest that the direct command is forbidden (in Claude Code: `permissions.deny` in `.claude/settings.local.json`), so nothing goes out without the owner's yes and the proof. Show only measured facts, never guesses. The project itself is not built here, but in ordinary chats with the foundation as the safety net.
