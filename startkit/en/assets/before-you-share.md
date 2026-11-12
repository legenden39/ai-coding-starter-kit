# Before you share something

The AI reads this file when something is going out to others: a link, a website, an app on the internet, a trial version for a friend. What is safe on your own computer is not safe as soon as others can reach it. Here is what most often goes wrong for people who build with AI.

This is a checklist, not a security review. The AI never says "it is safe". It says what has been checked, what has not, and what needs fixing. You decide whether it goes out.

## 1. Three questions first

1. Who should be able to see it: only you, a few people you know, or everyone with the link?
2. Does it store anything about people or accounts (login, email, forms, pictures)?
3. Will it take payments, or send emails?

If you answer "only me" or "a few people I know", and there is no information about others, do points 2, 3 and 6. Otherwise do them all.

## 2. Secrets

- Run `sh .githooks/pre-commit --scan`. It looks for keys in all files.
- Is there a key in code that runs in the browser? A stranger can see everything there. Only keys made to be public may be there. Keys with words like secret, service or private never. Look up the provider's own guide; do not guess.
- Is `.env` in `.gitignore`, and have the keys never been in git? If they have, they are burnt and must be changed.

## 3. Login and access

- Open the site in a private window without being logged in. Can you see something you should not?
- Can one user see another's things by changing a number in the address?
- Do you use a database service? Many start with rules where everyone can read and write, so it is easy to try. Check that the access rules are turned on and apply to real users. Look up the provider's current guide.
- Are you only hiding a button? Then it is not protected. The rule has to live on the server or in the database.

## 4. What can cost money

- Do the keys for paid services (for example AI) have a spending limit at the provider? A stranger can use them up.
- Can a form or an upload be abused at scale?
- Payments: only the provider's test mode, no real payments, until a professional has looked at it.

## 5. Real people

- Use made-up data in tests. Never real people's information in a chat, an error message or git.
- If it stores real information about others, stop and talk to a professional (GDPR). The AI does not give legal advice.
- Children, health and money need more than this list.

## 6. What does a stranger see?

- Error messages and test pages that show internal things?
- Files and folders that should not be open (`.git`, backups, notes)?
- Does the address start with https?
- Who gets the link? Only those who should. Can you switch it off again?

## How the AI answers

Three short lists:
- ✅ **Checked:** what, and how.
- ⚠️ **Needs fixing:** what, and why it matters.
- ❓ **Not checked:** what the AI could not see (for example what happens in your browser, or what the provider shows).

What needs fixing goes into `STATUS.md` under "Open problems". Nothing goes out until you have said yes.
