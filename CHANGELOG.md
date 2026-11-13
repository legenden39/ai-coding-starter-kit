# Changelog

English · [Dansk](CHANGELOG.da.md)

The version number is in `startkit/VERSION` and is written into your feedback file, so it is clear which edition the feedback is about.

All editions are betas. None of them has been tried in Codex by the person who made the kit.

## Not released yet

- **Model choice with every task:** one new line in the rules. With every new task the AI says which model it needs: the smallest (text, routine, running commands), the middle model (ordinary building from a clear plan) or the strongest (debugging, review, design, security). These are the same three steps as in section 5 of the knowledge note, and if you have a model guide, the AI follows it. It speaks up if the model does not fit, or you switch to one that is too weak in the middle of the task. Before, the model choice was only in "what now?" and in the suggestion for the next chat. It is a text rule, not a lock: it can be forgotten in a long chat, and it has not been tried in a real chat.

## 0.8.0-beta (November 2026)

Explain habit as an option, and honest information in the README.

- **Explain habit (optional):** new section 16 in the knowledge note and a yes/no offer in the wrap-up, so a person can choose to learn along the way. In Claude Code it points to the built-in answer styles `/output-style Explanatory` and `/output-style Learning` and to how to turn them off again (read in Anthropic's documentation, not tried in a real chat). In Codex it is a habit (ask for an explanation and for "why"), because nothing equivalent was found. If the person already said yes to explanations in the interview, they are not asked again. The basis is one small experiment on developers, where the link was only seen in groups of a few people, so the section says it is a hint, not proof, and that the experiment does not show the explanations were the cause.
- **README:** new section "Who is behind this, and what can you expect?": the kit is not affiliated with OpenAI or Anthropic, it is free and comes with no guarantee, help covers the kit and not your project, and the kit has no telemetry.
- **Maintenance:** the GitHub actions are updated to Node 24, so the Node 20 warning is gone.

## 0.7.0-beta (November 2026)

Undo help with save points, and the status file loads by itself in Claude Code.

- **Save points:** at the start of every chat the kit automatically takes a snapshot of all the files in the project, including those that were never saved in git. It touches neither your files, your branch nor your history, and it stays on your own computer. Files in `.gitignore` (for example `.env` with your keys) are never included. The 30 newest are kept. Applies to both Codex and Claude Code.
- **Undo:** `node scripts/startkit/fortryd.js` shows the save points. `--show 1` shows which files are different now, and `--restore 1` restores them (or only one file). Before anything is restored, what is there now is saved, so an undo can be undone too. Nothing is deleted.
- **A page about going back:** the setup writes `.startkit/how-to-undo.md` (Danish: `.startkit/saadan-fortryder-du.md`) with the four ways: undo in the tool itself, save points, git and the copy on GitHub. One new line in the rules points to it.
- **The status file at the start of the chat (Claude Code):** `STATUS.md` and the list of recurring mistakes are now loaded automatically when a chat begins, continues or is compacted. In Codex the AI still reads them because the rules say so; the automatic way is not confirmed there.
- The overview page shows the latest save point.
- Fixed: the guard refused a combined command that only read and printed text (`echo`), as if it changed the kit's controls. Found in the trial in Claude Code.
- If you set the kit up with an older version, run the setup again in the project to get the new parts.
- Tried in Claude Code 2.1.322 on Linux: the status file was loaded without tools, and Claude itself found the save point and restored a broken file by following the page.
- Not tried: save points and undo on Windows beyond the automatic tests, save points in a real Codex, and the `/rewind` part of the page.

## 0.6.0-beta (November 2026)

The guard now stops deletion, not just two git commands.

- **Fixed a gap:** until now the guard only stopped `git reset --hard` and `git clean`. Ordinary deletion went through, and the README promised more. `rm -rf ~/`, `rm -rf src`, `rmdir /s /q src`, `del /s /q *.*`, `Remove-Item -Recurse -Force` on a folder, and `git checkout .` all passed.
- **Now stopped:** deletion outside the project folder or in your home folder; "everything" in a folder; whole folders with contents; paths with a variable in them (an empty variable can turn `"$DIR/"` into `/`); `find ... -delete` without a `-name` filter; and the git commands that throw away unsaved changes (`git checkout .`, `git restore .`, `git checkout -f`, `git switch -f`, `git stash drop`, `git branch -D`).
- **Still allowed:** single files in the project, folders that can be recreated (`node_modules`, `dist`, `build`, `.next`, `coverage` and the like), `find ... -name ... -delete`, `git checkout -- one-file`, `git restore --staged`, and `git branch -d`.
- The message says what is wrong and that the owner can run the command themselves. Both languages and both editions (Codex and Claude Code).
- Honest limit: the guard reads the text of the command. Deleting through a script, or through `node -e` and the like, it cannot see.
- **Loop breaker:** one new line in the rules the kit writes (`AGENTS.md` or `CLAUDE.md`): if a fix has not worked after two attempts, the AI stops, writes the exact error text and what it tried in `STATUS.md`, and suggests a new chat. Debugging in circles is the most common complaint from beginners. Projects set up earlier get the line when the setup is run again.
- **When the usage limit hits mid-change:** a new point 15 in the kit's knowledge notes with a short recipe (wait, read `STATUS.md`, check `git status` and run the proof, and `git stash` if it is broken), and one new line in the rules: update `STATUS.md` at every sub-goal, not only at the end.
- **Before you share (draft):** the setup now writes `docs/before-you-share.md` (Danish: `docs/foer-du-deler.md`), a short checklist the AI goes through with the owner before a link, a website or an app goes out: three questions first, then secrets in browser code, login and open databases, what can cost money, real people's information, and what a stranger sees. The AI answers in three lists (checked, needs fixing, not checked) and never says "it is safe". One new line in the rules points to the file. Projects set up earlier get it when the setup is run again.
- This is a first draft. It is built from the research report and general knowledge, not from beginners using it. It is a checklist, not a security review, and it does not replace a professional when there is money, health, children or many users.
- **"What now?":** one new line in the rules. If the owner writes "what now?" in a chat, the AI reads `STATUS.md`, runs `git status`, looks at the latest commits, and answers briefly: where we are, one suggestion for the next task, whether open problems or unsaved changes come first, and which model fits. It does not start until the owner says yes. It is a rule, not a command, so it works the same in Codex and Claude Code, and a rule can be forgotten (see point 1 in the knowledge notes).
- Corrected the README: Linux is tested automatically at GitHub, Mac is not tried.
- Found by reading the earlier research report; not tried in Claude Code or Codex on a real computer, only in the automatic tests, which now cover more than 230 cases for the guard.

## 0.5.0-beta (November 2026)

A self-test of the guard, an extra layer for secret files, and installation as a plugin in Claude Code.

- **Self-test:** the guard notes every time the AI tool calls it (only the time and the tool's name, never what the AI was doing). The check of the setup and the overview page show it. If the guard is not being called, you can now see it. Before, that happened without a message. Applies to both Codex and Claude Code.
- **Extra layer in Claude Code:** the setup writes Claude Code's own deny rules for `.env` files in `.claude/settings.local.json`. They stop reading of the files even if a hook one day is not run. Your own rules in the file are kept.
- **Plugin for Claude Code:** the kit can be installed with two commands inside Claude Code (`/plugin marketplace add legenden39/ai-coding-starter-kit` and `/plugin install startkit@ai-coding-starter-kit`), without the ZIP file. The double-click installation works as before. The plugin folders are made from the source (`node tools/byg-plugin.js`), and a test stops if they drift apart.
- If you set the kit up with an older version, run the setup again in the project to get the self-test and the deny rules.
- Tried in Claude Code 2.1.322 on Linux: the self-test, the deny rules, and plugin installation from a local copy of the repository.
- Tried after the release, in Claude Code 2.1.322 on Linux: plugin installation straight from GitHub, in both languages.
- Tested automatically after the release: plugin installation in the real Claude Code at GitHub, on Windows and Linux (`node tests/plugin-installation.js`).
- Not tried: the self-test and the deny rules in Claude Code on Windows, and `/startkit` from the plugin on Windows.

## 0.4.0-beta (November 2026)

The kit is now available for Claude Code too.

- **Edition for Claude Code:** double-click `install-claude-english.cmd` (English) or `installer-claude.cmd` (Danish). The kit goes into `.claude\skills`, is started with `/startkit`, and sets up `CLAUDE.md` and `.claude/settings.local.json` instead of `AGENTS.md` and `.codex/hooks.json`. `install-english.cmd` and `installer.cmd` still give the edition for Codex, and it is unchanged.
- The two editions share the same programs and the same rules, so a fix applies to both. The guides for Claude Code are made from those for Codex (`node tools/byg-claude.js`), and a test stops if they drift apart.
- In Claude Code the guard is also called when the AI wants to read a file with its own tool, so a `.env` file cannot be read around it.
- The guard now also protects Claude Code's settings (`.claude/settings.json` and `.claude/settings.local.json`), in both editions. In the edition for Claude Code the length lock covers `CLAUDE.md` instead of `AGENTS.md`.
- Tried in Claude Code 2.1.322 in a terminal on Linux: the guard stops `git commit --no-verify`, writing and reading of `.env`, the done-check requires proof, and `/startkit` begins with the introduction.
- Not tried: the edition for Claude Code on Windows and in the Claude app, double-clicking the two new installation files, and the whole flow with a real person.

## 0.3.0-beta (November 2026)

The kit is now available in English too.

- **English edition:** double-click `install-english.cmd`. The interview, the guides, the rules in `AGENTS.md`, the templates and all messages from the programs are in English. `installer.cmd` still gives the Danish edition, and it is unchanged.
- The two editions share the same programs and the same rules, so a fix applies to both. Only the text is different.
- In the English edition, three files in the project have different names: `docs/recurring-mistakes.md`, `.startkit/why-was-i-stopped.md` and `overview.cmd`. The programs in `scripts/startkit/` have kept their Danish names.
- The programs also understand English flags: `--dry-run`, `--history`, `--5h`, `--week` and `--open`.
- Fixed: on Mac and Linux the key check before commit did not run, because the file was not marked as executable.
- The tests now run automatically on Windows and Linux at GitHub every time something changes.
- The kit is now published as a ZIP file under Releases, and the README links straight to it. GitHub counts the downloads; the kit itself still sends nothing.
- A section about supporting the work at the bottom of the README, and a Sponsor button on GitHub.
- The English edition and both installations are tested automatically (the installation on Windows at GitHub), but the English edition has not been tried in Codex, and nobody has double-clicked `install-english.cmd` on a real computer.

## 0.2.0-beta (November 2026)

First edition for more testers and for teaching.

- **Installation with a double-click:** `installer.cmd`. It says what will happen, and asks for a yes, before anything is copied.
- **Shortcut to the overview:** `overblik.cmd` in your project opens the overview page in the browser with a double-click.
- **Feedback built in:** the kit makes notes along the way when something is unclear, asks five short questions at the end and collects it in `.startkit/feedback.md`. It never sends anything itself.
- **Short or full path:** you choose yourself after the introduction.
- **Help from A to Z:** Git, name and email in git, Node, Superpowers and a private backup on GitHub.
- **The overview is always shown,** and the kit suggests improvements itself based on your answers.
- `.codex/hooks.json` is kept out of git, because the path in it contains your user name on the computer.
- README rewritten for beginners, in Danish and English, with a glossary.
- Guide for teaching: `TEACHING.md` (Danish: `UNDERVISNING.md`).
- Template for feedback as an issue on GitHub.

## 0.1.0-beta (November 2026)

First edition: introduction, interview about 8 topics, research and plan, the fixed foundation (rules, guard, done-check, key check, status file) and the overview page.
