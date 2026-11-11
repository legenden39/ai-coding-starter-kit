# The tools: help with what is missing (phase 2)

Read only if something is missing in phase 2. The person may be completely new. So go through one tool at a time, and follow the same pattern each time:

1. Say in one sentence what the tool is, and why you need it.
2. Show exactly what the person has to do. One step per message, and wait for "that's done".
3. Check that it worked (the command is listed under each tool).
4. If it does not work, ask for what is on the screen, and find the cause. Do not guess.

Rules:
- The person installs. You do not install programs and plugins on your own.
- After an installation, a **new** terminal window has to be opened (or Codex has to be restarted) before the new program can be found. Say it every time; it is the mistake most people run into.
- Never ask for a password, and never type one for the person.
- The steps here were looked up with the publishers in November 2026. If the screen looks different for the person, say so, look it up in the official guide, and note it under "Bugs in the kit".

## Git

What: a program that saves every version of your files. It is your undo button: if something breaks, you can go back to the last time it worked.

How: go to git-scm.com, download the Windows edition, and run the installer. Press "Next" for all questions; the default choices are fine. (Someone who prefers the terminal can run `winget install --id Git.Git -e --source winget`.)

Check: open a new terminal window, and run `git --version`. It should show a version number.

## Name and email in git (important, and it must be done before the first commit)

What: git stamps a name and an email address on everything that is saved. Without them git refuses to save. If the project is later put on the internet publicly, everyone can see them, and they cannot be removed afterwards without trouble.

Check: `git config user.name` and `git config user.email`. Show the person what it says (or that it says nothing).

Explain the choice, and let the person decide:
- **Name:** a nickname is perfectly fine. It does not have to be the real name.
- **Email:** if the person has a GitHub account, or wants a backup on GitHub (recommended, see phase 9), do steps 1 and 2 in `en/references/github.md` now. There the person gets a special address from GitHub that does not reveal the real one. If the person does not want to use GitHub, use `not-set@example.invalid`; it can be changed later.

Set them when the person has chosen. Ask whether it should apply to all projects on the computer (`git config --global user.name "…"` and `git config --global user.email "…"`) or only this one (the same commands without `--global`, run in the project folder).

If a real email address is already there, do not change it without a yes. Explain what it means, and let the person choose.

## Node

What: a program that can run small scripts. The starter kit's guard, done-check and overview are written for it. Without Node they cannot run.

How: go to nodejs.org, download the edition called LTS (the stable one) for Windows, and run the installer. The default choices are fine.

Check: open a new terminal window, and run `node --version`. The number must be 18 or higher.

## Superpowers (recommended, but you can do without)

What: a free add-on (a plugin) for Codex. It makes the AI ask questions and lay out a plan before it builds, instead of diving straight in. The starter kit uses it in phase 5 if it is there.

How in the app:
1. Press **Plugins** in the menu on the left.
2. Find **Superpowers**. It is under the section "Coding".
3. Press **+** next to it, and follow what the screen says.

How in the terminal:
1. Type `/plugins`.
2. Search for `superpowers`.
3. Choose "Install Plugin".

Start a new chat afterwards, so it is loaded. `$startkit` continues where you left off.

Check: ask the person to see whether Superpowers is listed as installed under Plugins.

If the person cannot find it, or the installation fails, go on without it. The kit works without it too. Note it under "Open questions".

## Usage and models

Ask the person to type `/status` (shows usage and limits) and `/model` (shows which models can be chosen), and tell you what it says. Explain briefly: the model is "how clever and expensive" the AI is, and the usage is how much of the subscription has been used. Save the model list in the profile under `tools.models`.
