# What most people do not know (experience that saves months)

Use this file in phase 5: look up the person's problems here before you search the web. Each point has a problem, a cause and a solution. Explain them in your own words, and only those that fit the person's answers. Facts about Codex were looked up in the official documentation in November 2026; check them again if something does not fit.

## 1. A text rule gets forgotten. A hook or a test does not.

Problem: "I have said it three times, and it still does it."
Cause: Rules in a text file are something the AI reads and weighs. In a long chat they take up less and less room. Nobody enforces them.
Solution: What must *never* happen has to be locked by something that runs automatically:
- a **hook** (a small script Codex runs before a tool is used, or before it says "done"),
- a **test** (a script that fails if something has broken),
- a **check before commit** (git refuses to save if, for example, a key is about to be included).
Text rules are used for matters of taste and style. Locks are used for what must not go wrong.

Honest limit: a hook is a safety net, not a wall. OpenAI itself writes that a hook that fails or runs out of time lets the tool carry on, and that a creative command can get around a pattern.

## 2. Short rule files. Long files lose information.

Problem: "I have written a long instruction, and it only follows half of it."
Cause: Everything in `AGENTS.md` is sent along in every single chat. A long file costs tokens every time, and the important rules drown. Codex also stops reading instruction files when together they reach a limit (32 KiB by default).
Solution: `AGENTS.md` of about 60 lines at most with the fixed rules. Everything else goes in `docs/` and is only read when the task needs it ("read `docs/payment.md` before you touch payment"). The starter kit puts a lock on the length, so the file does not grow again. The lock only stops at 80 lines, so there is a little room above the target of 60.

## 3. New task = new chat

Problem: "It gets dumber the longer we work." / "It suddenly thinks for a very long time."
Cause: A chat has a limited memory (context). When it is nearly full, older parts are compressed, and details are lost. Everything in the chat is sent along every time, so a long chat is also expensive.
Solution: One task per chat. When the task is finished: update `STATUS.md`, and start a new chat (`/new`). If you are in the middle of something long, use `/compact` before it does it itself. `STATUS.md` is what carries knowledge from one session to the next, not the chat's memory.

## 4. The overview from one session to the next comes from one file, not from memory

Problem: "When I come back, I don't know where I left off."
Solution: `STATUS.md` in the root of the project with four short sections: Now (what we are working on), Last done, Next step, Open problems. The AI reads it at the start of every chat and updates it at the end. It must not get long: old things are moved to `docs/history.md`. If you come back and are unsure, write "what now?": the AI reads the file, checks `git status` and suggests one next step and a fitting model, and only starts when you have said yes.

## 5. Choose the model by the task

Problem: "Sometimes it thinks for 30 minutes, other times 5 seconds." / "I run out of usage."
Cause: There are two dials: the **model** (how strong and expensive) and the **thinking level** (how long it may think). The highest thinking levels can spend many minutes and a lot of usage on a task that does not need it.
Principle:
- The **smallest and fastest** model: simple fixes, renaming, text, small questions, finding something in the code.
- The **middle model** (the default choice): ordinary building of features from a clear plan.
- The **strongest** model and a high thinking level: architecture, security, money, personal data, bugs that are hard to find, and planning something big.
A good rule of thumb: plan with a strong model, build with a cheaper one from the plan.
The model names change several times a year. So use the list from the person's own `/model`, and write the person's own model guide into `.startkit/config.json` (`model_guide`), so it is shown in the overview. The thinking level is chosen together with the model in `/model`. Usage is seen with `/status` and on the usage page under settings.

## 6. Save tokens in the right places

- Give only the files the task is about. Do not ask the AI to "read the whole project".
- Write what is *required* and what is *optional*, so it does not build more than necessary.
- Switch off add-ons and MCP servers you do not use: each of them takes up room in every chat.
- Keep `AGENTS.md` short (point 2).
- Check the usage before you start something big. Agree on a limit (for example 85 %) where you stop and save the status.

## 7. Agents: use them rarely and on purpose

Problem: "I set agents to work, and the result was messy and expensive."
Cause: Each agent starts without knowing what the others know, and has to read itself in from scratch. Several agents multiply the usage and can overwrite each other's work.
Solution: One agent at a time as the starting point. Several only when the tasks are completely independent and touch separate files, and then each in its own working copy (worktree). A rule that has to be enforced is a hook, not a "control agent".

## 8. "Done" must be provable

Problem: "It said done, and it did not work."
Solution: Agree on what proves that it works (a test command, that the page opens without errors), and let a done-check demand the proof before the AI may stop. The starter kit's `bevis.js` (the proof) runs the project's check commands and saves the result; the done hook refuses "done" if the code has changed since the last green proof. Always ask for: "say what you have not tried".

## 9. Recurring mistakes become locks

Every time a mistake happens for the second time: write it in `docs/recurring-mistakes.md` (date, what happened, cause), and ask: can a hook or a test prevent it? The column "Locked by" shows whether the mistake is only a text rule (weak) or has a lock (strong). The rules should grow out of real mistakes, not out of imagination.

## 10. Fix the cause, not the symptom

Problem: The AI builds a warning or a workaround instead of removing the bug.
Solution: A fixed question in the done report: "What was the cause, and has it been removed?" If the cause cannot be found, that must be said out loud.
If a fix has not worked after two attempts, stop: the error text and what was tried go into `STATUS.md`, and the owner starts a new chat with them. A chat that has guessed several times is full of its own wrong tracks.

## 11. Git is your undo button and your backup

- Commit every time something works. Then everything can be rolled back.
- Put a copy somewhere else (a private repository on GitHub). A folder on one computer is not a backup.
- One branch per task, so half-finished work does not mix with what works.
- Commands that delete work that is not saved (`git reset --hard`, `git clean`, `git checkout .`, `git stash drop`, `git branch -D`), and deletion outside the project or of whole folders (`rm -rf src`), are run by the owner. The guard stops the AI. Folders that can be recreated (`node_modules`, `dist`, `build`) it may delete.

## 12. Keys never belong in code or chat

Keys live in a `.env` file that is listed in `.gitignore`. The AI never reads or writes it. A key that has been in git or in a chat is burnt and must be changed at the provider. A plain HTML file in the browser cannot keep a key secret; it has to sit behind a server.

## 13. Hidden choices

Problem: The AI chooses a database, a structure or a library without saying so.
Solution: A rule in `AGENTS.md`: choices that are hard to undo are laid out as 2-3 options with pros, cons and a recommendation, and the owner chooses. Use a planning skill (for example Superpowers' brainstorming) before anything new.

## 14. Messy folders

Problem: "I can't find the newest version."
Cause: Copies such as `project-new`, `project-final2` appear when git is not used as the undo button.
Solution: One project = one folder = one git repository. No copies of folders; use branches. A short `docs/structure.md` that says what lives where, and a rule that new top-level folders require a yes.

## 15. The usage limit hits in the middle of a change

Problem: "The limit hit in the middle of the work, and I don't know whether the code is broken."
Cause: The chat stops where it is, even in the middle of a change to several files. Then something can be half done, and the next chat does not know about it.
Before it hits:
- Update `STATUS.md` every time a sub-goal is reached, not only at the end, and commit when something works (points 4 and 11). Then there is little to go back to.
- Check the usage before anything big begins, and stop at the limit you agreed on (point 6).
When it has hit:
1. Wait until the limit resets. The time is in the message. Touch nothing in the meantime, and do not delete anything to "tidy up".
2. Start a new chat, and ask the AI to read `STATUS.md` and run `git status` and `git diff --stat`, so it sees which files are half changed. Then `node scripts/startkit/bevis.js`, so you know whether it works as it says.
3. If it works and only a little is missing: continue, and write in `STATUS.md` what has been done. If it is broken and you cannot see why: ask the AI to run `git stash`. That puts the half changes aside without deleting them (`git stash pop` brings them back), and you start from the last commit that worked.
4. Write in `STATUS.md` under "Next step" what the next chat should do, in one paragraph.
