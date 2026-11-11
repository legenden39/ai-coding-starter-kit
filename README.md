# AI Coding Starter Kit (ChatGPT / Codex edition)

English · [Dansk](README.da.md)

A starter kit that helps you get AI to work properly for you: better quality, a faster workflow, a clear overview at all times, and fewer wasted tokens.

It is not a ready-made package. The kit interviews you, researches the best solutions to your particular problems, and builds a foundation from your answers.

This is an unofficial hobby project. It is not affiliated with OpenAI.

## Read this first (honest caveats)

**The kit itself speaks Danish.** This README is in English, but the interview, the rules it writes, and the messages from its scripts are in Danish for now. An English edition is planned. Until then, the kit is only useful if you read Danish.

**It has not been tried in Codex.** The kit was rebuilt from an edition made for Claude. The person who made it does not use ChatGPT and has therefore **not been able to try it in Codex**. The individual parts are tested separately (see below), but the whole flow has not been run through in Codex by a human. So there may be bugs.

If you hit one, ask Codex to write it down in `.startkit/status.md` under "Fejl i kittet" ("Bugs in the kit"), and please report it (see "Report a bug" below) so the kit can get better.

## What you need

- **Codex** (OpenAI's tool for building with AI; it comes with your ChatGPT subscription). Either the desktop app or the terminal version. The kit does not work in the ordinary ChatGPT chat in the browser, because that cannot work in your folders.
- **Git** (git-scm.com) and **Node** (nodejs.org, choose LTS). If they are missing, the kit helps you install them.
- The kit is made for Windows. Mac and Linux are untested.

## Install (3 steps)

1. Get the project: press the green **Code** button at the top of the GitHub page, choose **Download ZIP**, and unpack the file somewhere, for example in Documents. (If you know git, you can clone it instead.)
2. Right-click in the folder, choose "Open in Terminal", and run:

   ```
   powershell -ExecutionPolicy Bypass -File install.ps1
   ```

   The script copies the folder `startkit` to `C:\Users\<you>\.agents\skills\startkit`. That is all it does. `-ExecutionPolicy Bypass` lets Windows run this one script, this one time; it changes no settings. The script is short, so feel free to read it first. You can also just copy the folder there yourself.
3. Open Codex in the project folder you want to work in, and type:

   ```
   $startkit
   ```

   If it does not show up, restart Codex, or find it under Skills (`/skills`).

**Recommended:** also install Superpowers, if you can find it in your Codex (in the app: Plugins in the side menu; in the terminal: `/plugins`). It gives better brainstorming and planning, and the kit uses it if it is there. The kit also works without it.

## What happens when you start

1. **Introduction.** You are told what you are about to go through, and why, before a single question is asked.
2. **Check of your computer** (git, Node, which models you have).
3. **Interview** on 8 topics, 2-3 questions at a time. It is a conversation, not a form: the number of questions is not fixed. If you answer thoroughly there are fewer, and if you say something worth understanding better, you get follow-up questions. Typically 30-60 minutes. You can pause at any time; `$startkit` continues where you left off.
4. **Mapping** of what you already have. Nothing is changed.
5. **Research and plan.** The kit researches solutions to your problems and presents proposals. You say yes or no to each.
6. **The fixed foundation** is set up and tried out together with you.
7. **Your overview** is built to your wishes.

The more detailed your answers, the better the result fits you.

## It costs tokens, and that is on purpose

Running the kit uses a fair share of your usage: the interview is a long conversation, and the research afterwards reads sources on the web. See it as an investment. You spend tokens once on building the foundation, and afterwards you save them every day, because you do not have to explain the same things again, fix the same mistakes again, or use an expensive model for a simple task.

Check your usage (`/status`) before you start. You can spread the flow over several days; everything is saved, so nothing has to be repeated.

## What you get in your project

| File | What it does |
|---|---|
| `AGENTS.md` | Short, fixed rules that the AI reads in every chat. Your own lines are not touched. |
| `STATUS.md` | Where you are: now, last done, next step, open problems. Carries knowledge from one session to the next. |
| `docs/gentagne-fejl.md` | Mistakes that must not happen again, and whether they are locked by a hook or a test. |
| `scripts/startkit/vagt.js` | The guard: stops keys in code, deletion of work, and skipping of checks. |
| `scripts/startkit/faerdig.js` and `bevis.js` | The done-check: "done" requires green proof for the code as it is right now. |
| `.githooks/pre-commit` | Key check before every commit, and a lock on the length of `AGENTS.md`. |
| `scripts/startkit/overblik.js` | A small page on your own computer that shows where the project stands. |
| `.codex/hooks.json` | Tells Codex to run the guard and the done-check. |
| `.startkit/` | Your profile, the plan, settings, and the explanation "why was I stopped". |

There are two status files, and they are not the same: `STATUS.md` is about your project and is used every day. `.startkit/status.md` is only about how far you are in the kit's own flow, and that is where bugs in the kit are written down.

**What the kit does with your data:** The kit's scripts send nothing anywhere. The key check reads your files on your own computer to find keys that are in the wrong place, but it only shows the file name and the kind of key, and it never stores or sends a key. In the research phase, Codex searches the web the way Codex normally does; that happens through your own Codex, not through the kit.

**If you put your project on GitHub:** `.codex/hooks.json` contains the full path to the project folder, which typically includes your user name on the computer (`C:\Users\<you>\...`). If you do not want to share that, keep the file out of git by adding `.codex/hooks.json` to your `.gitignore`. The path only fits your own computer anyway.

## Remove it again

Delete the folder `C:\Users\<you>\.agents\skills\startkit`. In a project: delete `scripts/startkit/`, `.githooks/`, `.startkit/` and the kit's entries in `.codex/hooks.json`, remove the block between `startkit:start` and `startkit:slut` in `AGENTS.md`, and run `git config --unset core.hooksPath`. `STATUS.md`, `docs/gentagne-fejl.md` and the lines under "Tilføjet af startkittet" in `.gitignore` are yours now; keep them or delete them as you like.

## What has been tried, and what has not?

| Part | Status |
|---|---|
| The guard's rules (what is allowed and what is refused) | Tested automatically |
| The guard and the done-check run as programs with the kind of input Codex sends according to the documentation | Tested automatically |
| The setup on an empty project, and that it preserves your own files | Tested automatically |
| The key check and the length lock with real git | Tested automatically |
| The overview page | Tested automatically and seen in a browser |
| That Codex actually runs the hooks the way the documentation describes | **Not tried** |
| That the guard is also called when Codex edits files (and not only for commands) | **Not tried** |
| That `$startkit` shows up and follows the phases in Codex | **Not tried** |
| Installation on a computer other than the one the kit was made on | **Not tried** |
| The whole flow with a real person | **Not tried** |
| Mac and Linux | **Not tried** |

Run the tests yourself with `node tests/run.js` (requires git and Node).

Facts about Codex (where skills and hooks live, how a hook responds, limits for `AGENTS.md`) were looked up in OpenAI's own documentation in November 2026. If OpenAI changes something, parts of the kit may stop working.

## Report a bug

Open an issue under the **Issues** tab here on the GitHub page. Write three things: what you did, what happened, and what you expected. Feel free to copy what is under "Fejl i kittet" in your `.startkit/status.md`. English and Danish are both fine.

Never write keys, passwords or personal information in an issue; everything there is public. Also check that what you paste does not contain paths with your user name, if you do not want to share it.

## License

MIT. You may use, change and share the kit freely, as long as the license text is included. See the file `LICENSE`. The kit comes with no warranty.
