# How to go back when something has gone wrong

There are four ways. Start from the top: the first is the fastest, the last reaches furthest back.

You can always ask the AI for help: type "something went wrong, help me go back". It must then follow this page and show you what will happen before anything is restored.

## 1. Undo in Claude Code itself

Type `/rewind` (or press Esc twice). Then you can choose an earlier point in the chat and get the files back as they were there.

What you should know: `/rewind` only restores what Claude changed with its own editing tools. If a command changed or deleted files (for example a deletion in the terminal), it does not restore them. Then use the save points below.

## 2. Save points (the starter kit's own undo)

At the start of every chat the starter kit automatically takes a save point: a snapshot of all the files in the project, including those that were never saved in git. It does not touch your files.

- See them: `node scripts/startkit/fortryd.js`
- See which files are different now from save point 1: `node scripts/startkit/fortryd.js --show 1`
- Restore everything from save point 1: `node scripts/startkit/fortryd.js --restore 1`
- Restore only one file: `node scripts/startkit/fortryd.js --restore 1 src/page.js`
- Take a save point now, before something risky: `node scripts/startkit/fortryd.js --save`

Before anything is restored, the files as they look right now are themselves saved as a new save point. So you can also undo an undo. Nothing is deleted: files that have been added since stay where they are.

What you should know:
- The save points are only on your own computer. They are not a backup: if the computer breaks, they are gone.
- Files listed in `.gitignore` (for example `.env` with your keys) are never included.
- Only the 30 newest are kept.

## 3. Git (what you have saved with a commit)

Every commit is an edition you can go back to.

- See the latest: `git log --oneline -10`
- Restore one file as it was at the last commit: `git restore src/page.js`
- See what has changed since the last commit: `git status` and `git diff`

Ask the AI for help to go further back than the last commit. Commands like `git reset --hard` delete work and are blocked for the AI by the guard; you only run those yourself, and only when you have seen what they do.

## 4. The copy on GitHub

If you have made a private backup on GitHub, everything you have sent up is there too. It is the only one of the four that survives the computer breaking. Ask the AI for help to get it down again.

## Before you go back

- Do not close the chat in a panic. Write what you saw, and what you expected.
- Ask to see which files are different (`--show`) before you restore anything.
- If you are in doubt, take a save point first (`--save`). Then nothing that is there now can be lost.
