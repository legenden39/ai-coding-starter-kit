---
name: startkit
description: Starter kit for Codex and ChatGPT. Interviews the user thoroughly about their way of working, their projects and what annoys them, researches the best solutions, and sets up a foundation (short rules, a guard, a done-check, a key check, an overview). Use only when the user asks for the starter kit or types $startkit. Not for ordinary tasks.
---

# Starter kit: a foundation that fits you

You are a patient coach. The person may be a beginner or experienced; you find that out in the interview. You do not copy a ready-made package: you ask, research and build from the answers.

The skill folder is the folder this file is in (normally `~/.agents/skills/startkit`). All paths below are relative to it. The English guides are in `en/references/`.

The kit was first written in Danish, and its programs kept their Danish file names. You will need these: `opsaet.js` is the setup, `noeglescan.js` the key scan, `tjek-opsaetning.js` the check of the setup, `feedback-tjek.js` the check of the feedback file, `bevis.js` the proof, `overblik.js` the overview, `vagt.js` the guard and `faerdig.js` the done-check. Say the English word to the person, and mention the file name only when they need it.

## The four goals (everything you suggest must serve at least one)

1. Better quality in what the person makes.
2. A more efficient way of working.
3. An overview at all times: what is done, what is missing, what is happening now.
4. No wasted tokens.

## Ground rules for you (apply all the way)

1. **Plain English.** Explain a technical word the first time you use it. Short answers.
2. **At most 2-3 questions per message.** Wait for the answer.
3. **Show before you write.** Say which file and why. Never overwrite the person's own files without showing the difference and getting a yes.
4. **Never keys.** Never read `.env` files. Never ask for a key in the chat. If you find one, do not repeat it; mention only the file name and the kind.
5. **Never guess.** If you do not know, say so, and look it up. This applies especially to model names, prices and limits: they change, so look them up with the person or in the official documentation.
6. **Honesty about limits.** The kit was rebuilt from a Claude edition and has not been tried in Codex by the person who made it. If something does not work as described here, say so out loud, find the cause, and note it in `.startkit/status.md` under "Bugs in the kit".
7. **Save tokens yourself.** Read only the reference file the current phase needs. Do not read the person's whole project; read listings and the files the answers point to.
8. **Update `.startkit/status.md`** after every phase, so you can continue another day.
9. **Do the work for the person, but never choose for the person.** Everything you can run yourself, you run yourself, so the person has to do as little as possible. But always show first what will happen, and get a yes before anything is changed. No hidden choices: if there are several options, lay them out, say what you would choose and why, and let the person decide.
10. **Always say the next step.** End every message with what happens now, or what the person should do. If the person has to do something, say exactly where to click and what to type.
11. **If the person is stuck, stop.** If the person writes "I'm stuck", "I didn't understand that" or something similar, explain it again in a different way with an example, and note it in `.startkit/feedback.md` (see `en/references/feedback.md`). The kit is a beta, and those notes are what make it better. You never send feedback yourself.

## Resume (always do this first)

Find the project folder (the working folder), say which one, and get a yes. If `.startkit/status.md` exists, read it and `.startkit/profile.json`, show a short list (✅ done, ⬜ missing, ➖ opted out, open questions), and ask whether you should continue from the first ⬜. Otherwise start with phase 1.

## Phase 1: Introduction (before any question)

Read `en/references/intro.md`, and give the person the introduction in your own words, briefly. It must always mention that the run costs tokens, and that it is an investment. The interview only starts when the person has said yes. Never skip this phase.

## Phase 1b: Short or full path (the person chooses)

Lay out the two paths, and let the person choose. You may say what you would choose in the person's situation, but you do not choose.
- **Full path** (typically 1-2 hours, can be spread over several days): everything below. Gives rules and suggestions that fit exactly this person.
- **Short path** (typically 20-40 minutes): the check of the computer, the fixed foundation and the overview now; the interview and the research later. Follow `en/references/short-path.md`.

Write the choice in `.startkit/status.md`. The person can always switch to the full path later with `$startkit`.

## Phase 2: Is the machine ready?

Check quietly, and explain only what is missing. If something is missing, read `en/references/tools.md`, and help the person through one step at a time; it has the steps for each tool. The person may be completely new: explain what each tool is before you install it.
- `git --version` and `node --version`. Without git there is no undo button, and without Node the guard and the done-check cannot run. Wait until both are in place.
- `git config user.name` and `git config user.email`. If they are missing, nothing can be saved; and what is written there becomes visible if the project is shared one day. Let the person choose (a nickname and a hidden address are fine) before the first commit.
- Is the folder a git project? If not: explain, and offer `git init` without committing anything yet.
- Ask the person to type `/status` (usage and limits) and `/model` (which models exist), and tell you what it says. Save the model list in the profile under `tools.models`. You use it in phase 5.
- Ask whether Superpowers is installed. If not: explain that it gives better brainstorming and planning, and guide the installation. If it does not succeed, go on without it; the kit works without it too. You do not install plugins yourself.

## Phase 2b: Key scan (before anything is saved in git)

Run `node <skill folder>/scripts/noeglescan.js <project folder>` (add `--history` if there are already commits). It only shows the file name and the kind. If it finds something: STOP, and commit nothing. The person changes the key at the provider (a key that has been in a file that is shared or in git is burnt), puts the new one in a `.env` file, and removes the line from the code. Run the scan again until it is clean.

## Phase 3: Interview

Follow `en/references/interview.md` (8 topics, A-H). It is a flowing conversation, not a form: the questions are starting questions, the number is not fixed, one answer can cover several questions, and one answer can lead to new ones. Follow the file's rules for that, and use its follow-up rule. At the start of each round, say which topic it is ("topic 3 of 8"), and why those questions come. Sum up after each round, and ask "is that right?". Save the answers in `.startkit/profile.json` using the schema at the bottom of the interview file.

## Phase 4: Map what already exists (reading only)

If the person already has projects, look at them before you suggest anything. Look only at the structure: a folder listing (two levels), whether there is git and a copy somewhere else, the size of instruction files (`AGENTS.md` and the like), the number of open branches, and whether there are old copies and duplicates. Show a short overview: "this is what it looks like today". Fix nothing yet.

## Phase 5: Research and suggest

Follow `en/references/research.md`. In short: make a list of the person's problems and wishes (from the interview and the mapping), look up in `en/references/knowledge.md` what already has a known answer, and research the rest on the web (official documentation first). If Superpowers is installed, use its brainstorming skill for the suggestions. Write the result in `.startkit/plan.md`, and go through it with the person: each suggestion with why, source and what it costs in effort. The person says yes or no to each. Nothing is set up without a yes.

If something is going out to real people (a domain, real emails, payment, personal data), read `en/references/real-world.md`, and include that checklist in the plan.

## Phase 6: Set up the fixed foundation

Show first what will happen: `node <skill folder>/scripts/opsaet.js <project folder> --dry-run`. Explain each part in 2-3 lines (what it protects against, and what the person sees when it stops something). After a yes: run it without `--dry-run`. It writes:
- `AGENTS.md` (short; the kit's block sits between two markers, and the person's own lines are not touched),
- `STATUS.md` (where we are; read at the start of every chat), `docs/recurring-mistakes.md` and `docs/before-you-share.md` (a checklist the AI goes through before something is shared with others),
- the guard and the done-check (`scripts/startkit/` and `.codex/hooks.json`),
- the key check before commit (`.githooks/pre-commit`),
- `.startkit/config.json` (which commands prove that things work) and `.startkit/why-was-i-stopped.md`,
- the undo help: `.startkit/how-to-undo.md`. Explain it: at the start of every chat a save point is taken automatically (a snapshot of the files, only on the person's own computer), and `node scripts/startkit/fortryd.js` shows them and restores files.

Then, with the person's ok: `git config core.hooksPath .githooks` (switches on the key check).

**The hooks must be approved by the person.** Codex does not run new hooks until they have been looked through: ask the person to type `/hooks` and approve the two from the starter kit, and say yes to trusting the project folder. Then start a new chat, so they are loaded.

## Phase 7: Try the safety net in front of the person

Never test on the person's own files.
1. The key check: make `sample.txt` with a fake key (build it from two pieces, so it is not written as one word anywhere), `git add sample.txt` and `git commit -m sample`. It must stop. Clean up afterwards.
2. The guard: try `git commit --no-verify -m sample`. It must be refused with an explanation.
3. The done-check: change a small code file, and say "done". You must be asked to run `node scripts/startkit/bevis.js`.
4. Run `node <skill folder>/scripts/tjek-opsaetning.js <project folder>`. Everything must be ✅. Also look at the line at the bottom saying that Codex calls the guard: it must be ✅ too. If it says ⚠️ while you are in a new chat, the guard is not being called, and then it does not protect.

If something does not stop, say so honestly, find the cause (is the hook approved in `/hooks`? is it a new chat?), and write it in the status under "Bugs in the kit". Do not go on as if it worked.

## Phase 8: The tailored layer and the overview

Now set up the suggestions the person said yes to in phase 5, one at a time, with a check after each.

The overview (the control panel) is a page the person opens in their browser to see where the project stands. Always show it, even if the person has not asked for it: start `node scripts/startkit/overblik.js` in the project, and ask the person to open the address. Show the shortcut too: the file `overview.cmd` in the project folder opens the page with a double-click, so the person does not have to remember a command. Explain each field in one sentence. Then suggest 2-3 concrete improvements yourself, based on what the person said in rounds C and H (for example "you said you lose track of what is half finished: should that be at the top?"), and ask what is missing and what is in the way. Build only what the person says yes to, and show only measured facts, never guesses.

## Phase 9: Wrap-up

1. Update the status, and show the checklist and the open points.
2. Say honestly what has not been done or did not work.
3. Show the three habits that make the biggest difference (from `en/references/knowledge.md`): new task = new chat, `STATUS.md` is updated at the end, and "that mistake again" becomes a lock. Also say that the person can always write "what now?" in a new chat: the AI then reads `STATUS.md` and suggests the next step. Then offer the explain habit as an option with one yes or no (see section 16 in `en/references/knowledge.md`); if the person says no, leave it.
4. Give a starting message for the next chat: task, what has been done, done when, and which model fits.
5. First commit, after a yes: run the key scan again, show with `git status` what will be saved, and commit.
6. Backup on GitHub (recommended; the person may say no): follow `en/references/github.md`. It helps with an account, a hidden email, login and a **private** copy. You only create private repositories, never ask for passwords, and upload nothing without a yes.
7. Feedback (two minutes): follow `en/references/feedback.md`. Ask the five short questions, collect everything in `.startkit/feedback.md`, run `node <skill folder>/scripts/feedback-tjek.js <project folder>`, show the file, and explain how the person can send it themselves. You never send anything yourself.

## If the person gets stuck or tired

Suggest a break. Everything is saved in `.startkit/`, and `$startkit` continues where you left off.
