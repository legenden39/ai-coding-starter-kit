# AI Coding Starter Kit (for ChatGPT / Codex and for Claude Code)

English · [Dansk](README.da.md)

> **Beta, version 0.5.0-beta.** This is a trial edition. The edition for Codex has not been tried in Codex by the person who made it. The edition for Claude Code is new: its safety nets have been tried in Claude Code on Linux, but not on Windows, and the whole flow has not been run through by a human. There will be bugs. If you try it, please give feedback: the kit helps you with that at the end. See the [changelog](CHANGELOG.md).

**Do you want to build something with AI but don't know where to start, or are you tired of the AI making the same mistakes over and over? Then this is for you.**

You don't need to know how to code, and you don't need to know the words used below. They are explained along the way, and there is a glossary at the bottom.

> **The kit speaks English or Danish.** You choose when you install it: `install-english.cmd` gives you the English edition, `installer.cmd` the Danish one (for Claude Code: `install-claude-english.cmd` and `installer-claude.cmd`). The English edition was translated from the Danish one and has been tried by fewer people. A few file names in the kit are still Danish; they are explained [further down](#the-file-names-are-danish).

## What is the problem?

When you build something together with an AI, almost everyone runs into the same things:

- **It forgets.** You agreed on something yesterday. Today you have to explain it all again.
- **It repeats mistakes.** You have said it three times, and it still does it.
- **It says "done", and it doesn't work.** It never tried what it made.
- **You lose track.** What works? What is half finished? Which folder is the newest?
- **Something disappears.** A file gets deleted or overwritten, and you can't get it back.
- **You burn through your usage** without knowing why.

This is rarely because you are doing something wrong. It is because a foundation is missing: some fixed rules and safety nets that the AI has to work within. Most people only discover that after months of frustration.

## What does the starter kit do about it?

The starter kit is a helper you start inside your AI tool. It takes you by the hand from A to Z:

1. **It helps you get the tools in place.** If something is missing on your computer, it shows you how to install it, one step at a time.
2. **It interviews you.** What do you want to build? What annoys you? How do you want the AI to talk to you?
3. **It researches solutions** to your particular problems and presents a plan. You say yes or no to each proposal.
4. **It sets up the foundation** in your project and tries out, together with you, that it works.
5. **It shows you an overview page** that you open in your browser, and extends it to your wishes.
6. **It helps you make a private backup** online, so your work does not live on one computer only.

The kit does the work for you, but it never chooses for you. It always shows what will happen first, and waits for your yes.

Afterwards you can start building without having to worry about the mistakes listed above.

### What you get

| This | means for you |
|---|---|
| Short, fixed rules | The AI reads them at the start of every conversation, so you don't have to explain the same things again. |
| A status file | It always says where you are: what has been done, and what the next step is. |
| A guard | It stops the AI before it deletes your work or puts a secret code in the wrong place. |
| A done-check | The AI may only say "done" once it has been tried that it works. |
| A key check | Secret codes (keys) are stopped before they are saved somewhere others can see them. |
| A list of repeated mistakes | Mistakes that happened twice are written down and locked, so they don't happen a third time. |
| An overview page | One page in your browser that shows where the project stands right now. |
| A private backup | Your project also lives on GitHub, where only you can see it. |

## Codex or Claude Code?

The kit exists for two AI tools: **Codex** (from OpenAI, the company behind ChatGPT) and **Claude Code** (from Anthropic, the company behind Claude). You choose when you install. The flow, the rules and the programs are the same; only the names of some files and commands differ.

The rest of this page is written with Codex's names. If you use Claude Code, read "Codex" as "Claude Code", and use this table:

| Thing | Codex | Claude Code |
|---|---|---|
| File you double-click to install (English) | `install-english.cmd` | `install-claude-english.cmd` |
| File you double-click to install (Danish) | `installer.cmd` | `installer-claude.cmd` |
| The folder the kit is copied to | `C:\Users\<you>\.agents\skills\startkit` | `C:\Users\<you>\.claude\skills\startkit` |
| What you type to start the kit | `$startkit` | `/startkit` |
| The file with the fixed rules in your project | `AGENTS.md` | `CLAUDE.md` |
| The file that switches on the guard and the done-check | `.codex/hooks.json` | `.claude/settings.local.json` |
| See your usage | `/status` | `/usage` |
| New chat | `/new` | `/clear` |

## Read this first (honest caveat)

The kit was rebuilt from an edition made for Claude. The person who made it does not use ChatGPT and has therefore **not been able to try it in Codex**. The individual parts are tested separately (see below), but the whole flow has not been run through in Codex by a human. So there may be bugs, and buttons may be in a different place than described here.

The edition for Claude Code is built from the edition for Codex. Its safety nets (the guard, the done-check and the rules in `CLAUDE.md`) and the start with `/startkit` have been tried in Claude Code in a terminal on Linux. It has not been tried on Windows or in the Claude app, and there too the whole flow has not been run through by a human.

If you hit a bug, ask Codex to write it down (it knows where), and please report it. See "Report a bug" below. That makes the kit better for the next person.

The kit is made for Windows. Mac and Linux are untested.

## Get started

There are four things you have to do yourself before the starter kit can take over. Expect 15-30 minutes if you start from scratch.

Going to use the kit with a class? See the [guide for teachers](TEACHING.md).

### Step 1: Get Codex or Claude Code

You only need one of them. If you already have a ChatGPT or Claude subscription, choose the tool that goes with it.

**Codex**

Codex is OpenAI's tool for building with AI. It is from the same company as ChatGPT, and you sign in with your ChatGPT account. The difference is that Codex can work in the folders on your computer. The ordinary ChatGPT chat in the browser cannot, which is why the starter kit does not work there.

- Get the Windows app through OpenAI's own guide: [learn.chatgpt.com/codex/quickstart](https://learn.chatgpt.com/codex/quickstart).
- Open it and sign in with your ChatGPT account.
- Which plans give access, and how much usage you get, is on OpenAI's pricing page. It changes, so check it there.

**Claude Code**

Claude Code is Anthropic's tool for building with AI. It is from the same company as Claude, and you sign in with your Claude account. Like Codex, Claude Code can work in the folders on your computer. The ordinary Claude chat in the browser cannot, which is why the starter kit does not work there.

- Get the Windows app at [claude.com/download](https://claude.com/download), open it, and sign in with your Claude account. Claude Code is the **Code** tab in the app.
- Claude Code requires a paid subscription. Which plans give access, and how much usage you get, is on [claude.com/pricing](https://claude.com/pricing). It changes, so check it there.

### Step 2: Get Git and Node

These are two free programs the starter kit uses behind the scenes.

- **Git** saves every version of your files. It is your undo button. Get it at [git-scm.com](https://git-scm.com) (choose Windows), run the file, and press "Next" to every question.
- **Node** runs the starter kit's small programs (the guard, the done-check, the overview). Get it at [nodejs.org](https://nodejs.org) (choose the one called **LTS**), and run the file.

Not sure whether you have them? Just move on. The starter kit checks and helps you if something is missing.

### Step 3: Download and install the starter kit

1. Download the kit: **[ai-coding-starter-kit.zip](https://github.com/legenden39/ai-coding-starter-kit/releases/latest/download/ai-coding-starter-kit.zip)**. The link always gives you the newest edition.
2. Find the file in your "Downloads" folder, right-click it, and choose **Extract All**. Put the folder somewhere you can find again, for example in Documents.
3. Open the extracted folder, and **double-click the file `install-english.cmd`** (it may show as just `install-english`). If you use Claude Code, double-click **`install-claude-english.cmd`** instead. The two files called `installer.cmd` and `installer-claude.cmd` install the Danish edition.
4. A window with text appears. It tells you what will happen: the folder `startkit` is copied to `C:\Users\<you>\.agents\skills\startkit`, which is where Codex looks for this kind of thing (for Claude Code: `C:\Users\<you>\.claude\skills\startkit`). Nothing else. Type `y` and press Enter to agree.
5. At the end, the window tells you what the next step is.

Does Windows say "Windows protected your PC"? That happens with files downloaded from the internet. You can press **More info** and **Run anyway** if you trust the file. It is short, and you can open it in Notepad and read what it does.

**Using Claude Code? Then you can also install without the ZIP file.** Type these two lines in Claude Code, one at a time, and press Enter after each:

```
/plugin marketplace add legenden39/ai-coding-starter-kit
/plugin install startkit@ai-coding-starter-kit
```

The first tells Claude Code where the kit lives. The second installs the English edition as a plugin (an add-on). For the Danish edition, type `startkit-da` instead of `startkit`. Start a new chat afterwards, and type `/startkit`. Use only one of the two ways (ZIP file or plugin), not both. A plugin does not update itself: type `/plugin` to get a new edition. You remove it again with `/plugin uninstall startkit@ai-coding-starter-kit`.

This way has been tried in Claude Code on Linux from a copy of the repository, but not on Windows.

<details>
<summary>Rather not double-click? Two other ways</summary>

- **In the terminal:** right-click an empty spot in the folder, choose **Open in Terminal**, and run `powershell -ExecutionPolicy Bypass -File install.ps1 -Sprog en` ("sprog" is Danish for language; without `-Sprog en` you get the Danish edition; for Claude Code, add `-Vaerktoej claude` at the end, "vaerktoej" being Danish for tool). The terminal is a window where you type commands instead of clicking. The part `-ExecutionPolicy Bypass` lets Windows run this one file, this one time; it changes no settings.
- **By hand:** copy the folder `startkit` to `C:\Users\<you>\.agents\skills\`. For the English edition, then copy `startkit\en\SKILL.en.md` over `startkit\SKILL.md`, and create the file `startkit\scripts\projekt\sprog.json` with the content `{"sprog": "en"}`. For Claude Code: copy the folder to `C:\Users\<you>\.claude\skills\` instead, copy `startkit\claude\en\SKILL.claude.en.md` over `startkit\SKILL.md`, create `sprog.json` as above, and create the file `startkit\scripts\projekt\vaerktoej.json` with the content `{"vaerktoej": "claude"}`.

</details>

### Step 4: Start the starter kit

1. Make a folder for what you want to build (or use one you already have). If you don't have an idea yet, just make an empty folder called, for example, `my-first-project`.
2. Open Codex, and open that folder as a project. In Claude Code: choose the folder before you start a chat (in a terminal: open the folder, and type `claude`).
3. Type this in the chat and press Enter (in Claude Code you type `/startkit` instead):

   ```
   $startkit
   ```

Now the starter kit takes over and tells you what will happen. If it does not show up, close Codex, open it again, and try once more. You can also type `/skills` and pick it from the list.

## What happens then?

The starter kit asks at most 2-3 things at a time.

1. **Introduction.** You are told what you are about to go through, and why, before a single question is asked.
   Then you choose your own path: the **short** one (the computer is checked, the safety nets and the overview are set up; typically 20-40 minutes) or the **full** one (everything below; typically 1-2 hours, which can be spread over several days). You can always do the rest later.
2. **Check of your computer.** If Git, Node or anything else is missing, you are helped through it. You also get help choosing the name and email that are stamped on your work, so you don't end up sharing something you did not mean to.
3. **Superpowers.** A free add-on for Codex that makes the AI ask questions and make a plan before it builds. The starter kit shows you how to install it. You can do without it.
4. **Interview** on 8 topics. It is a conversation, not a form: the number of questions is not fixed. If you answer thoroughly, there are fewer. Typically 30-60 minutes.
5. **Mapping** of what you already have. Nothing is changed.
6. **Research and plan.** You say yes or no to each proposal.
7. **The foundation** is set up and tried out in front of you, so you see that the safety nets actually stop something.
8. **The overview page** is shown, and you get suggestions for what it should show for you in particular. Afterwards you open it by double-clicking the file `overview.cmd` in your project folder (`overblik.cmd` in the Danish edition).
9. **Private backup on GitHub.** You are helped with an account, a hidden email and signing in. You can opt out.
10. **Feedback.** Five short questions, two minutes. See "Give feedback" below.

**Stuck?** Just write "jeg sidder fast" ("I am stuck") or say that you did not understand. The kit then explains it another way.

You can pause at any time. Type `$startkit` again another day, and it continues where you left off. The more detailed your answers, the better the result fits you.

## Give feedback (that is why it is a beta)

The kit takes notes along the way when something is unclear or goes wrong, and at the end it asks five short questions: where did you get stuck, what did you not understand, what was unnecessary, how long did it take, and would you recommend it.

Everything is collected in one file in your project: `.startkit/feedback.md`. **The kit never sends it itself.** You see it first, you may edit it, and you decide whether to send it. There are two ways:

- Send the file (or paste the text) to whoever you got the kit from.
- Open an issue on GitHub: the **Issues** tab at the top of this page, **New issue**, choose "Beta-feedback". Everything there is public.

## It costs usage, and that is on purpose

An AI subscription has a limit on how much you can use. It is measured in "tokens", which is roughly the amount of text the AI reads and writes.

Running the starter kit uses a fair share of your usage: the interview is a long conversation, and the research afterwards reads sources on the web. See it as an investment. You spend usage once on building the foundation, and afterwards you save it every day, because you don't have to explain the same things again or fix the same mistakes again. No number can be promised for how much you save.

Type `/status` in Codex to see your usage before you start. You can spread the flow over several days; everything is saved.

## Is it safe?

- **The kit sends nothing anywhere.** Its programs run only on your own computer.
- **It never stores your secret codes.** The key check reads your files on your own computer to find codes that are in the wrong place, but it only shows the file's name and the kind of code.
- **You decide.** Nothing is changed without you having seen it and said yes.
- **The backup is private.** The starter kit only creates private copies on GitHub. If you want to share something publicly, that is your own choice, and you press the button yourself.
- **You sign in yourself.** The starter kit never asks for passwords.
- During research, Codex searches the web the way Codex normally does. That happens through your own Codex, not through the kit.
- The safety nets are nets, not walls. They catch the common mistakes, but they cannot guarantee that nothing goes wrong.

Everything in the kit is open, so anyone can read what it does.

## Glossary

| Word | Means |
|---|---|
| **Codex** | OpenAI's tool for building with AI. It can work in the folders on your computer. |
| **Claude Code** | Anthropic's tool for building with AI. It can also work in the folders on your computer. |
| **Terminal** | A window where you type commands instead of clicking. |
| **Git** | A program that saves every version of your files, so you can go back. |
| **Commit** | Saving a version in git. Like pressing "save" for the whole project at once. |
| **GitHub** | A place online where git can put a copy of your project. |
| **Repository** | A project that git keeps track of. |
| **Node** | A program that runs small scripts. The starter kit's guard and overview use it. |
| **Skill** | A recipe that Codex can follow. The starter kit is a skill. |
| **Plugin** | An add-on that gives Codex more abilities. Superpowers is a plugin. |
| **Hook** | A small program Codex runs automatically at certain moments, for example before it changes a file. The guard is a hook. |
| **Key** (API key) | A secret code that gives access to a service, often one you pay for. Must never be shared. |
| **Token** | The unit for how much text the AI reads and writes. Your usage is counted in tokens. |
| **Model** | The AI itself. There are several: some are fast and cheap, others smarter and more expensive. |

## For the curious: what does the kit put in your project?

| File | What it does |
|---|---|
| `AGENTS.md` (in Claude Code: `CLAUDE.md`) | Short, fixed rules that the AI reads in every chat. Your own lines are not touched. |
| `STATUS.md` | Where you are: now, last done, next step, open problems. |
| `docs/recurring-mistakes.md` | Mistakes that must not happen again, and whether they are locked by a hook or a test. |
| `scripts/startkit/vagt.js` | The guard: stops keys in code, deletion of work, and skipping of checks. |
| `scripts/startkit/faerdig.js` and `bevis.js` | The done-check: "done" requires green proof for the code as it is right now. |
| `.githooks/pre-commit` | Key check before every commit, and a lock on the length of `AGENTS.md`. |
| `scripts/startkit/overblik.js` | The overview page on your own computer. |
| `overview.cmd` | Shortcut: double-click to open the overview page in your browser. |
| `.codex/hooks.json` (in Claude Code: `.claude/settings.local.json`) | Tells Codex or Claude Code to run the guard and the done-check. |
| `.startkit/` | Your profile, the plan, settings, your feedback, and the explanation "why was I stopped". |

### The file names are Danish

The kit was first written in Danish. Everything you read, and everything the AI is told, is in English in the English edition, but the programs kept their Danish file names, because the two editions share them:

| File | Danish word | What it is |
|---|---|---|
| `vagt.js` | vagt = guard | The guard |
| `faerdig.js` | færdig = done | The done-check |
| `bevis.js` | bevis = proof | The proof |
| `overblik.js` | overblik = overview | The overview page |
| `forbrug-gem.js` | gem forbrug = save usage | Saves the usage numbers you read off |
| `regler.js`, `tekster.js`, `tilstand.js` | rules, texts, state | Shared parts the others use |
| `opsaet.js`, `noeglescan.js`, `tjek-opsaetning.js`, `feedback-tjek.js` | setup, key scan, check of the setup, check of the feedback | Programs in the kit's own folder |

In the Danish edition, three files in your project have Danish names too: `docs/gentagne-fejl.md`, `.startkit/hvorfor-blev-jeg-stoppet.md` and `overblik.cmd`.

There are two status files, and they are not the same: `STATUS.md` is about your project and is used every day. `.startkit/status.md` is only about how far you are in the kit's own flow, and that is where bugs in the kit are written down.

`.codex/hooks.json` (and `.claude/settings.local.json` in Claude Code) contains the full path to the project folder, which typically includes your user name on the computer (`C:\Users\<you>\...`). The starter kit therefore keeps the file out of git, so it does not come along if you share the project. The path only fits your own computer anyway. `.startkit/profile.json` holds your answers from the interview; you are asked whether it should be part of the backup.

## Remove it again

Delete the folder `C:\Users\<you>\.agents\skills\startkit` (Claude Code: `C:\Users\<you>\.claude\skills\startkit`). Codex's file names are used below; in Claude Code the two files are called `.claude/settings.local.json` and `CLAUDE.md`. In a project: delete `scripts/startkit/`, `.githooks/`, `.startkit/` and the kit's entries in `.codex/hooks.json`, remove the block between `startkit:start` and `startkit:slut` in `AGENTS.md`, delete `overview.cmd`, and run `git config --unset core.hooksPath`. `STATUS.md`, `docs/recurring-mistakes.md` and the lines under "Added by the starter kit" in `.gitignore` are yours now; keep them or delete them as you like.

## What has been tried, and what has not?

| Part | Status |
|---|---|
| The guard's rules (what is allowed and what is refused) | Tested automatically |
| The guard and the done-check run as programs with the kind of input Codex sends according to the documentation | Tested automatically |
| The setup on an empty project, and that it preserves your own files | Tested automatically |
| The key check and the length lock with real git | Tested automatically |
| The overview page | Tested automatically and seen in a browser |
| The installation (`install.ps1`): asks first, copies only the folder, and does nothing on a no | Tested automatically |
| The check of the feedback file (finds keys, email addresses and paths with user names) | Tested automatically |
| The English edition: the setup, the guard, the key check, the proof and the overview page with English text | Tested automatically |
| The installation in both languages, run on Windows at GitHub every time something changes | Tested automatically |
| The edition for Claude Code: the setup, the guard and the done-check with the kind of input Claude Code sends, in both languages | Tested automatically |
| That the guides for Claude Code match those for Codex (they are made from them) | Tested automatically |
| The installation for Claude Code in both languages, run on Windows at GitHub | Tested automatically |
| That Claude Code actually runs the guard (for commands, when it edits files, and when it wants to read a `.env` file) and the done-check | Tried in Claude Code 2.1.322 in a terminal on Linux |
| That `/startkit` shows up in Claude Code and begins with the introduction | Tried in Claude Code 2.1.322 in a terminal on Linux |
| The self-test: that the check of the setup shows whether Claude Code actually calls the guard | Tested automatically, and tried in Claude Code 2.1.322 on Linux |
| That Claude Code's own deny rules stop reading of `.env`, even without the guard | Tried in Claude Code 2.1.322 on Linux |
| The plugin edition: that the folders match the source, and that an installed copy sets up correctly in both languages | Tested automatically |
| The plugin edition installed with `/plugin` from a local copy of the repository, and started with `/startkit` | Tried in Claude Code 2.1.322 on Linux |
| The plugin edition installed straight from GitHub with `claude plugin marketplace add` and `claude plugin install`, both languages: the installed folders are identical to the ones in the repository | Tried in Claude Code 2.1.322 on Linux |
| The plugin edition installed in the real Claude Code at GitHub, on Windows and Linux, every time something changes: both plugins install, and a project is set up from the installed copy | Tested automatically |
| The plugin edition started with `/startkit` on Windows | **Not tried** |
| The edition for Claude Code on Windows and in the Claude app | **Not tried** |
| Double-clicking `installer-claude.cmd` and `install-claude-english.cmd` on a real computer | **Not tried** |
| The help with installing Superpowers in Claude Code | **Not tried** |
| Double-clicking `install-english.cmd` on a real computer | **Not tried** |
| The English edition run through Codex with a real person | **Not tried** |
| Double-clicking `installer.cmd` and `overblik.cmd` on someone else's computer (Windows may warn) | **Not tried** |
| The short path, the feedback questions and the notes along the way, run through Codex | **Not tried** |
| The kit used with a class | **Not tried** |
| That Codex actually runs the hooks the way the documentation describes | **Not tried** |
| That the guard is also called when Codex edits files (and not only for commands) | **Not tried** |
| That `$startkit` shows up and follows the phases in Codex | **Not tried** |
| The help with installing Git, Node and Superpowers, as it looks in Codex | **Not tried** |
| The help with a GitHub backup, run through Codex | **Not tried** |
| Installation on a computer other than the one the kit was made on | **Not tried** |
| The whole flow with a real person (neither in Codex nor in Claude Code) | **Not tried** |
| Mac and Linux | **Not tried** |

Run the tests yourself with `node tests/run.js` (requires git and Node).

Facts about Codex, Claude Code, GitHub and Superpowers (where skills and hooks live, how a hook responds, limits for `AGENTS.md`, where the buttons are) were looked up in the publishers' own documentation in November 2026. If they change something, parts of the kit may stop matching.

## Report a bug

Press the **Issues** tab at the top of this page, and press **New issue**. Write three things: what you did, what happened, and what you expected. Feel free to copy what Codex wrote under "Bugs in the kit" in the file `.startkit/status.md`. English and Danish are both fine.

Never write keys, passwords or personal information in an issue; everything there is public. Also check that what you paste does not contain paths with your user name, if you do not want to share it.

## Support the work

The kit is free, and it stays free. You do not have to pay anything to use it, and nothing is held back.

If it saved you time, and you would like to help more tools like this get made, you can leave a donation here: [paypal.me/KasperJensen798](https://paypal.me/KasperJensen798). Feedback helps just as much.

## License

MIT. You may use, change and share the kit freely, as long as the license text is included. See the file `LICENSE`. The kit comes with no warranty. It is an unofficial hobby project and is not affiliated with OpenAI or Anthropic.
