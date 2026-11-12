<!-- startkit:start (this block is maintained by the starter kit; write your own rules outside the block) -->
# Working rules for the AI: {{PROJEKT}}

{{BESKRIVELSE}}
Owner: {{NAVN}}. Only the owner approves new or changed agreements.

## Start here (every new chat)
- Read `STATUS.md` (where we are) and `docs/recurring-mistakes.md` (mistakes that must not happen again).
- Say in one line what you understand the task to be, before you begin.
- One task per chat. A new task belongs in a new chat.

## Fixed rules
- Never write, show or read real keys and passwords. Only the owner touches `.env` files.
- Only say "done" when `node scripts/startkit/bevis.js` (the proof) is green, and you have said what you have not tried.
- Fix the cause, not the symptom. If you cannot find the cause, say so.
- Update `STATUS.md` every time a sub-goal is reached, not only at the end. Then a chat that is cut off by the usage limit can be picked up again without losing the thread.
- If a fix has not worked after two attempts, stop. Write the exact error text and what you tried in `STATUS.md`, and suggest the owner starts a new chat with it. Do not keep guessing.
- Never guess. If you do not know, say "I don't know", and suggest how we find out.
- Choices that are hard to undo (structure, database, new tools): lay out 2-3 options with a recommendation, and let the owner choose.
- Ask the owner before you: {{ALDRIG_UDEN_OK}}.
- If you are in doubt: {{VED_TVIVL}}.
- If the owner says "that mistake again": write the mistake in `docs/recurring-mistakes.md`, and suggest a lock (a hook or a test), not a new text rule.
- If the owner writes "what now?": read `STATUS.md`, run `git status`, and look at the latest commits. Answer briefly with: where we are, one suggestion for the next task, whether there are open problems or unsaved changes to deal with first, and which model fits (cheap for the simple, strong for the hard). Do not start until the owner has said yes.
- If something is to be shared with others (a link, a website, an app on the internet): read `docs/before-you-share.md`, and go through it with the owner before anything goes out. Say what has been checked, and what has not.
- If a guard stops you, do not work around it. Explain to the owner what happened (see `.startkit/why-was-i-stopped.md`).
- Keep this file short. Long explanations belong in `docs/` and are only read when the task needs them.

## How the owner wants answers
{{SVARFORM}}

## When the task is finished
- Update `STATUS.md`: what was done, what is missing, next step. Keep it short.
- Suggest the next chat: task, what has been done, done when, and which model fits (cheap for the simple, strong for the hard).
<!-- startkit:slut -->
