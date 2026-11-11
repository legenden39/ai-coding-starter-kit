# Feedback on the starter kit (all the way, and at the end in phase 9)

The starter kit is a beta. It only gets better if those who try it tell where it went wrong. Your job is to make that easy: you write things down along the way, and the person only has to answer five short questions at the end.

All feedback is collected in one file: `.startkit/feedback.md`. If it does not exist yet, create it from `en/assets/feedback.template.md`, and write in the kit's version (it is in the file `VERSION` in the skill folder).

## Fixed rules

1. **You never send anything.** Neither the file nor parts of it. The person sends it themselves, if they want to.
2. **Nothing private in the file.** No keys, passwords, names, email addresses, paths with a user name or content from the person's project. Write "the project folder", not the path. Write "a key for a payment service", not the key.
3. **Write what happened, not a tidy version.** "Did not understand the word hook" is useful. "Everything went fine" is not, if it is not true.
4. **The person sees the file before it leaves the computer,** and may edit and delete in it.

## Along the way: write it down when it happens

Write a short line under "Along the way" in the file every time:
- the person says something like "I'm stuck", "I didn't understand that", "what does that mean?", "it doesn't work" or "why do I have to do that?",
- a step did not work as the kit says (write it in `.startkit/status.md` under "Bugs in the kit" too),
- you had to guess or look something up yourself, because the kit's guide did not fit,
- the person skipped something or wanted to stop.

The form is: phase, what happened, and what helped. Example: "Phase 2: did not know what a terminal is. It helped to be told how to open it."

Tell the person the first time: "I'm just noting that this was unclear, so the kit can get better. It is not sent anywhere without you." After that you simply note, without interrupting.

Tell the person in the introduction that they can write "I'm stuck" or "I didn't understand that" at any time, and that it both gives help and is noted.

## At the end: five short questions

Ask them in phase 9, one or two at a time. Say first that it takes two minutes, and that the answers are what make the kit better for the next person. The person may skip.

1. Where did you get stuck?
2. What did you not understand?
3. What was unnecessary?
4. How long did it take?
5. Would you recommend it to someone else? Why, or why not?

Write the answers in using the person's own words. Fill in "About the run" (short or full path, level, which phases were completed, operating system).

## Before the file is sent

1. Run `node <skill folder>/scripts/feedback-tjek.js <project folder>`. It looks for keys, email addresses and paths with a user name, and shows only the line number and the kind. Fix what it finds.
2. Show the person the whole file, and ask: "Is there anything here you do not want to share?" Fix it.
3. Explain the two ways to send it, and let the person choose. The person may also choose not to.
   - **To whoever you got the kit from:** send the file `.startkit/feedback.md` (it is in the project folder), or copy the text into a message.
   - **As an issue on GitHub:** go to the kit's page on GitHub, press **Issues**, **New issue**, choose "Beta-feedback", and paste the text in. Say clearly that everything there is public and can be read by anyone.

Say thank you, whatever the person chooses.
