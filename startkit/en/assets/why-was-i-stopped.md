# Why was the AI stopped?

The starter kit has set up three controls in your project. They stop the AI on purpose. It is not an error when it happens.

## 1. The guard (runs before the AI uses a tool)

It refuses:
- **Keys and passwords** in files or commands, and all reading and writing of `.env` files. A key that ends up in a file or a chat is burnt and must be changed.
- **`git commit --no-verify`**: it skips the key check.
- **`git push --force`, `git reset --hard` and `git clean`**: they can delete work that cannot be recovered.
- **Commands that throw away changes** that are not saved in a commit: `git checkout .`, `git restore .` (without `--staged`), `git checkout -f`, `git switch -f`, `git stash drop` and `git stash clear`, and `git branch -D`. A single file the AI may restore.
- **Deletion that cannot be undone:** anything outside the project folder or in your home folder, "everything" in a folder (`rm -rf *`, `del /s /q *.*`), whole folders with contents (`rm -rf src`), and paths with a variable in them (`rm -rf "$FOLDER/"`, where an empty variable hits something completely different). Single files in the project, and folders that can be recreated (`node_modules`, `dist`, `build`), the AI may delete.
- **Changes to the controls themselves** (`.codex/hooks.json`, `scripts/startkit/`, `.githooks/`, `.startkit/config.json`, the proof). Otherwise the AI could switch them off when they are in the way.

If it is something you want done yourself, run the command in your own terminal. The guard only stops the AI, not you.

## 2. The done-check (runs when the AI wants to stop)

If the code has changed in the chat, and there is no green proof for exactly that code, the AI is asked to run `node scripts/startkit/bevis.js` first ("bevis" is Danish for proof). It is asked at most once per stop.

Which commands the proof runs is written in `.startkit/config.json` under `checks`. You edit that file yourself.

## 3. The key check (runs before git saves a commit)

It stops a commit if a key is about to be included, or if `AGENTS.md` has become too long (more than 80 lines). Long rule files cost tokens in every chat, and the important rules drown.

## Honest limits

- The guard is a safety net, not a wall. A creative command can get around a pattern.
- The guard reads the text of the command. If the AI deletes through a program it cannot see into (a script, or `node -e` and the like), the guard cannot stop it.
- If a hook fails, or runs out of time, Codex lets the tool carry on.
- New or changed hooks only run once you have approved them with `/hooks`.

## Did it stop something it should not have?

Write it in `STATUS.md` under "Open problems", and run the command yourself in the meantime. Do not switch the controls off to get on.

## The file names are Danish

The kit was first written in Danish, and the programs in `scripts/startkit/` kept their Danish names:
`vagt.js` is the guard, `faerdig.js` the done-check, `bevis.js` the proof, `overblik.js` the overview, `forbrug-gem.js` saves your usage numbers, `regler.js` holds the guard's rules, `tekster.js` the messages and `tilstand.js` shared helpers.
