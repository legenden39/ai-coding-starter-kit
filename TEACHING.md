# The starter kit with a class: guide for the teacher

English · [Dansk](UNDERVISNING.md)

This page is for you if you want to use the starter kit with a class, for example 10-20 participants, most of them beginners.

## Read this first

- **It is a beta.** Some things will not work as described.
- **The kit has not been tried in Codex** by the person who made it. The individual parts are tested automatically, but the whole flow has not been run through in Codex by a human. See the table "What has been tried, and what has not?" in the [README](README.md).
- **It has not been tried with a class.** The schedule below is an estimate, not experience.
- **The kit itself speaks Danish for now.** It is only useful for participants who read Danish.
- The kit is made for Windows. Mac and Linux are untested.

So the most important advice: **run the whole flow yourself, on your own computer, before you stand in front of a class.** Then you know where it is rough, and you can report it before the participants hit it.

## What participants should have ready beforehand

Installation is what most often derails a session. Ask participants to have this in place in advance, and set aside time for those who did not get it done:

1. **A ChatGPT account** they can sign in to, with access to Codex. Check OpenAI's pricing page for which plans give access and how much usage is included. It changes.
2. **Codex installed** and opened at least once, so sign-in is done.
3. **Git and Node installed.** Step 2 in the [README](README.md) shows how. The kit can also help with it, but that takes time in a room.
4. **The starter kit downloaded and installed** (step 3 in the README: download the ZIP, extract, double-click `installer.cmd`).
5. **Their own computer, with permission to install programs.** A work computer locked down by an IT department often cannot install Git and Node, and Windows may refuse to run the installer file.
6. **Access to their own email and phone,** if they want to create a GitHub account along the way (it asks for a verification code).

## Suggested schedule

The short path fits a single session best. The full path has an interview of typically 30-60 minutes per person, which works better as homework.

**One session of about 2 hours (short path):**

| Time | What |
|---|---|
| 15 min | Why a foundation? Go through the six problems at the top of the README. Ask who recognises them. |
| 15 min | Everyone opens Codex in an empty folder and types `$startkit`. Help those who cannot get it to show up. |
| 20 min | The introduction, choosing the short path, and the computer check. Most problems arise here. |
| 10 min | Break. Use it for those who are behind. |
| 30 min | The small interview, the foundation is set up, and the hooks are approved. |
| 15 min | The safety net is tried: watch the guard stop something. This is where it clicks for most people. |
| 10 min | The overview page is opened with `overblik.cmd`. |
| 5 min | The five feedback questions. |

**The GitHub backup** needs an account, verification codes and sign-in, and easily takes 20-30 minutes with a class. Make it a separate session or homework.

**The full path** can be done at home afterwards by typing `$startkit` again. It continues where they left off.

## What can go wrong in a room

| Problem | What you can do |
|---|---|
| **Usage runs out.** The kit uses a fair amount, and many start on a small plan. | Ask everyone to type `/status` in Codex before you begin. Choose the short path. Say that the flow can be continued another day. |
| **`$startkit` does not show up.** | Close Codex completely and open it again. Try `/skills`. Check that the folder is in `C:\Users\<you>\.agents\skills\startkit`. |
| **Windows warns about the installer file** ("Windows protected your PC"). | That happens with files downloaded from the internet. Show that you can press "More info" and "Run anyway", or copy the `startkit` folder by hand. Let participants choose. |
| **A new program cannot be found right after installing it.** | A new terminal window must be opened, and Codex restarted. This is the most common mistake. |
| **Hooks do not run.** | Hooks must be approved by the participant with `/hooks`, and a new chat must be started afterwards. |
| **Wifi and sign-in.** Twenty people signing in at once can trigger extra security checks. | Get sign-in done at home. |
| **Participants move at different speeds.** The kit is a conversation, so nobody is on the same step. | Expect it. Have the fast ones help their neighbour, and do not try to steer the class step by step. |
| **Someone pastes a key or password into the chat.** | Say beforehand that this must never happen. If it does, the key must be replaced at the provider. |
| **The screen looks different from what is described.** | Expected in a beta. Ask the participant to tell the kit what the screen says. It is noted as feedback. |

Say from the start that anyone can type "jeg sidder fast" ("I am stuck") or "det her forstod jeg ikke" ("I did not understand this") to the kit at any time. It then explains in another way and notes it.

## How the class's feedback is collected

Each participant gets a file in their project: `.startkit/feedback.md`. It contains the kit's version, what was noted along the way, and the answers to five questions: where did you get stuck, what did you not understand, what was unnecessary, how long did it take, and would you recommend it.

The kit never sends the file itself. The participant sees it first and decides.

1. Set aside five minutes at the end, so everyone reaches the questions.
2. Ask participants to send you the file, or paste the text into a message to you. Make clear that it is voluntary.
3. Collect it and pass it on to whoever you got the kit from, or open an issue under **Issues** on the kit's GitHub page (choose "Beta-feedback"). Everything on GitHub is public, so remove names first.
4. Feel free to add your own observations: where did most people get stuck, and how long did each step really take? That is exactly what this guide is missing.

The feedback file must not contain keys, names, email addresses or paths with user names. The kit checks for that before showing the file, but ask participants to read it through themselves.
