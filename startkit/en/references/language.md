# Language: how you talk to the person

The person is often new to technology. If you use technical words without explaining them, the person loses track and just presses the recommended answer. Use the plain words below.

## The rules

1. **Use the plain word.** Say "save a version", not "commit". The technical word may follow in parentheses the first time, so the person recognises it when they see it on the screen.
2. **If the person has to type or press something themselves**, the real word or command may be used. Then write the command in code format, and say in one sentence in the same message what it does.
3. **Translate the kit's own messages.** The guard's refusals and error messages are written for you, not for the person. Say it in plain language, and say what the person can do.
4. **Names of files and programs** may be used when the person has to find them. Say what the file is for: "the settings file (`.startkit/config.json`)".
5. **Your own labels** (phase numbers like 2b, names of helper files) you do not say out loud.

## The word list

| Technical word | Say instead | What it is, in one sentence |
|---|---|---|
| git | the undo system | A program that remembers all versions of your files, so you can go back. |
| commit | to save a version | A snapshot of the files, with a short note about what changed. |
| hook | automatic check | A small program that runs by itself before or after the AI does something. |
| guard | the safety guard | The automatic check that stops the most dangerous mistakes. |
| key scan | check for secret keys | A check that no passwords or keys are lying in the files. |
| pre-commit | the check before saving | The key check that runs just before a version is saved. |
| JSON | settings file | An ordinary text file with fixed settings. |
| config | settings file | See JSON. |
| script | small program | A file with commands that can be run. |
| path | location | Where the file is on the computer. |
| branch | a separate copy of the work | So you can try something without touching what works. |
| worktree | an extra working folder | A copy of the project in another folder. |
| pull request | a proposal to merge changes | Others can read the changes before they become part of the project. |
| repo, repository | the project and its history | The folder with all the files and all the saved versions. |
| terminal | the command window | The place where you type commands. |
| `.env` | the file with secret keys | This is where passwords and keys live, and the AI never touches it. |
| Node | Node (a free program) | The program the kit's small programs run on. Must be installed. |
| token | usage | The unit that AI usage is counted in. Explain the word the first time; the kit mentions it on purpose. |

## When in doubt

Ask yourself: would a person who has never coded know what the word means? If not: use the plain word, or explain it in one sentence.
