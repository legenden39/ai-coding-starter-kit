# Changelog

English · [Dansk](CHANGELOG.da.md)

The version number is in `startkit/VERSION` and is written into your feedback file, so it is clear which edition the feedback is about.

All editions are betas. None of them has been tried in Codex by the person who made the kit.

## 0.4.0-beta (November 2026)

The kit is now available for Claude Code too.

- **Edition for Claude Code:** double-click `install-claude-english.cmd` (English) or `installer-claude.cmd` (Danish). The kit goes into `.claude\skills`, is started with `/startkit`, and sets up `CLAUDE.md` and `.claude/settings.local.json` instead of `AGENTS.md` and `.codex/hooks.json`. `install-english.cmd` and `installer.cmd` still give the edition for Codex, and it is unchanged.
- The two editions share the same programs and the same rules, so a fix applies to both. The guides for Claude Code are made from those for Codex (`node tools/byg-claude.js`), and a test stops if they drift apart.
- In Claude Code the guard is also called when the AI wants to read a file with its own tool, so a `.env` file cannot be read around it.
- The guard now also protects Claude Code's settings (`.claude/settings.json` and `.claude/settings.local.json`), and the length lock also covers `CLAUDE.md`. This applies to both editions.
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
