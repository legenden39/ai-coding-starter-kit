# Backup on GitHub (phase 9, optional)

The purpose is that the person's project is somewhere other than on one computer. If the computer breaks, the work is still there. It is a backup, not a publication: the project is uploaded as **private**, so only the person can see it.

Explain it like this: "GitHub is a place on the internet where git can put a copy of your project. It is private unless you choose otherwise yourself."

The person may say no. Then write ➖ in the status, and mention it under open points.

## Fixed rules (apply all the way)

1. **Always private.** You only create private repositories. You never make a repository public, not even if you are asked to: it is the person's own choice, and the person presses the button on GitHub themselves. Feel free to explain how (the repository's Settings, at the bottom), and say that step 5 here must be gone through first.
2. **Never passwords.** The person creates the account and logs in themselves. Never ask for passwords, codes from text messages or tokens, and do not repeat them if they are written in the chat.
3. **One step at a time.** Show what the person has to do, and wait for "that's done".
4. **Nothing leaves the computer without a yes.** Show what will be uploaded before you do it.
5. The steps were looked up with GitHub in November 2026. If the screen looks different, say so, look it up in GitHub's own guide (docs.github.com), and note it under "Bugs in the kit".

## Step 1: An account

Ask whether the person has an account on github.com. If not, the person creates it there themselves (it is free).

Say this before the user name is chosen: the user name can be seen by everyone and is part of the address of everything you later share. A nickname is perfectly fine. Do not write your full name in the "Name" field on the profile if you do not want to be findable.

Recommend two-step login (GitHub: Settings, Password and authentication). The account holds all the work.

## Step 2: Hide the email address

Git stamps an email address on everything that is saved. GitHub has a special address for that, which does not reveal the real one.

The person does this on GitHub: press the picture at the top right, choose **Settings**, and choose **Emails** in the menu on the left.
1. Switch on **Keep my email addresses private**.
2. Switch on **Block command line pushes that expose my email** (it appears when the first one is switched on). Then GitHub rejects an upload if the real address has been included by mistake.
3. Copy the address shown in the text next to the first switch. It ends in `@users.noreply.github.com` and has a number before the user name.

Set it in git (ask whether it should apply to all projects with `--global`, or only this one): `git config user.email "<the address>"` and `git config user.name "<the user name or a nickname>"`.

The special address is not secret; it may be written in the chat.

## Step 3: The program gh

What: GitHub's own small program for the terminal. It is what uploads the project.

Check: `gh --version`. If it is missing, the person installs it with `winget install --id GitHub.cli --source winget` in their own terminal. After that a **new terminal window** has to be opened (a new tab is not enough), and Codex has to be restarted, before `gh` can be found.

## Step 4: Log in (the person does this, in their own terminal)

Login asks questions and opens a browser, so it cannot be run through you. Ask the person to open a terminal (the Windows key, type "Terminal", Enter) and run `gh auth login`. It does not matter which folder the terminal is in.

The answers, in order:
1. Where do you use GitHub? → **GitHub.com**
2. Preferred protocol? → **HTTPS**
3. Authenticate Git with your GitHub credentials? → **Yes**
4. How would you like to authenticate? → **Login with a web browser**
5. The terminal shows a code. The browser opens; the person types the code there, logs in and presses **Authorize github**.

Explain the page with "Authorize" before the person presses: it gives the program `gh` on this computer access to the account, private repositories included. That is normal and necessary. Check that the time on the page matches that it was the person who just asked for it. The access can be withdrawn at any time with `gh auth logout`, or on GitHub under Settings, Applications.

Check afterwards: `gh auth status` should show that the person is logged in. Never show the token itself.

## Step 5: Look before anything is uploaded

1. Run the key scan: `node <skill folder>/scripts/noeglescan.js <project folder>` and again with `--history`. If it finds something: STOP. Upload nothing until the key has been changed at the provider and removed.
2. See which email addresses are already in the history: `git log --format=%ae` (show each address once). If there is a real address in older commits, say so: "As long as the repository is private, nobody can see it. If you make it public one day, it comes along. Tell me beforehand, and we clean up first." Note it under "Open problems" in `STATUS.md`.
3. Show with `git status` and `git ls-files` what will be included. Ask whether there is anything that should not be included (private notes, customer data, pictures of people). What should not be included is written in `.gitignore`. Mention two things yourself: `.startkit/profile.json` holds the person's answers from the interview (it is included unless the person opts it out), and `.codex/hooks.json` is kept out by the starter kit, because it contains a path with the user name on the computer. If `git ls-files` shows that `.codex/hooks.json` is included anyway from earlier, say so, and offer to take it out with `git rm --cached .codex/hooks.json`.
4. If there are changes that are not saved, commit them first (after a yes).

## Step 6: Upload (private)

Suggest a name for the repository (the project folder's name, lower-case letters and hyphens), and get a yes. Then run:

`gh repo create <name> --private --source=. --remote=origin --push`

If GitHub rejects it with a message that the email address would be exposed (GH007), the real address has ended up in a commit. Say it as it is. If it only concerns the latest commit, it can be re-stamped with `git commit --amend --reset-author --no-edit` once the address from step 2 is set. If it concerns older commits, stop, explain the options, and let the person choose. Do not switch off GitHub's protection to get on.

## Step 7: Check that it succeeded

1. `gh repo view --json visibility,url` should show `PRIVATE`. Give the person the address, and ask them to open it and see that the files are there.
2. Ask the person to open the address in a private browser window (where you are not logged in). There the page must **not** be visible. That is the proof that the repository is private.

## Step 8: The habit afterwards

The copy only stays up to date if it is updated: after every commit, `git push` is run. Write it in `STATUS.md` under "Next step" the first time, and suggest that it becomes a fixed part of "when the task is finished".

Say at the end what is now in place: an account, a hidden email, a private copy, and how it is kept up to date.
