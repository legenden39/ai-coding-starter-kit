# The short path

The short path is for someone who wants the safety nets and the overview in place now and will take the thorough interview later. It typically takes 20-40 minutes and uses far less usage than the full path.

The person chooses the path in phase 1b. You may tell them what the difference is, and what you would choose in their situation, but you do not choose for the person.

## What the short path gives, and what it does not give

Gives: a check of the computer, the fixed rules, the guard, the done-check, the key check, the status file, the overview page and (if the person wants it) a private backup.

Also gives: a small safety minimum (questions 7-11 below), so the kit knows about keys, backup and whether anything is going out to real people before building further.

Does not give yet: the thorough interview, the research into the person's own problems (what is annoying, and the mistakes the AI repeats), the plan with suggestions, the model guide and usage, and the tailored layer. The rules are therefore more general until the full path has been taken.

Say it honestly before the person chooses.

## The order

1. Phases 2 and 2b as usual (the computer, name and email in git, key scan).
2. The small interview below instead of phase 3.
3. Skip phases 4 and 5. Write ⏳ next to them and next to phase 3 in `.startkit/status.md`.
4. Phases 6 and 7 as usual (the foundation is set up and tried).
5. Phase 8: show the overview, but do not build a tailored layer.
6. Phase 9 as usual (wrap-up, backup, feedback).

## The small interview

If the person has brought over their answers from an earlier project (`nyt-projekt.js`, see SKILL.md) and says "yes, that is still right", then questions 1, 2, 4, 5 and 6 are answered: skip them. Questions 3 and 7-11 are always asked again, because they belong to the project.

Ask only these questions, 2-3 at a time. They are the least the setup needs. Use the follow-up rule from `claude/en/references/interview.md` if an answer is too thin to use.

1. What should I call you? (field: `person.name`. A nickname is fine.)
2. How much have you coded yourself: not at all, a little or quite a lot? (field: `person.level`)
3. What is the project called, and what should it be able to do? Two sentences are enough. If you do not have an idea yet, we call it "My first project". (fields: `projects[].name`, `projects[].description`, `chosen_project`)
4. What must the AI never do without asking you first? Suggest three yourself, and let the person add and remove: delete files, put something on the internet, install new programs or packages. (field: `rules.never_without_ok`)
5. Do you want explanations along the way, or just the result? (field: `rules.answer_style`)
6. What should the AI do when it is in doubt: ask, or choose itself and say so? (field: `rules.when_in_doubt`)

If there is already code in the folder, find one command together with the person that shows that it works (field: `check_commands`). Otherwise leave the list empty, and say that the done-check can only try something once there is a test.

### Safety minimum (questions 7-11)

These five catch the mistakes that cannot be undone. Ask them on the short path too, 2-3 at a time, and say why: "Now five quick ones about keys, copies and real users. They are the most expensive to find out too late."

7. What kinds of keys and accounts does the project use (e.g. AI, payment, email, database)? Only the types, never the keys themselves. (field: `security.key_types`. "None" and "don't know" are valid.)
8. Do you use git, and do you have a copy of the project somewhere other than on the computer? (fields: `security.git`, `security.copy`)
9. Is any of what you are building going out to real people? Roughly when? (field: `real_world.going_out`)
10. Will it take payments, or send emails or texts to real people? (fields: `real_world.payment`, `real_world.emails`)
11. Does it store information about real people (names, emails, phone numbers), or does anyone have to log in? (fields: `real_world.personal_data`, `real_world.login`)

Rules for them:
- If the answer to 9, 10 or 11 is yes or maybe: read `claude/en/references/real-world.md`, put the checklist in `.startkit/status.md` under "Before it goes live", and write in `STATUS.md` that round F of the full interview must be taken before anything goes live. Do not build payments, emails, login or storage of personal data into the project until the person has seen the checklist.
- If the answer to 7 is "don't know", or a key is in the code: say so, and put it in `open` in the profile. The key scan in phase 2b has only found what is already in files.
- If there is no copy (8): offer the private backup in phase 9, and put it in `open` if the person says no.
- Never repeat a key the person pastes (see `claude/en/references/interview.md`).

Save the answers in `.startkit/profile.json` using the schema at the bottom of `claude/en/references/interview.md`, and add `"path": "short"`.

## Honest wrap-up (must not be left out)

Say "done" about the short path, not about the interview. Never say "the interview is finished". In the wrap-up, tell the person in plain language:
- **What is set up:** the rules, the guard, the done-check, the key check, the overview and the safety minimum.
- **What is not covered yet:** the thorough interview, what is annoying for you, the mistakes the AI repeats, model and usage, and the research. The rules are therefore more general, and the kit does not yet know your own pain points.
- **Open points** from `open` and the "Before it goes live" checklist, if it exists.
- **What to do now:** type `/startkit` again once you have worked on the project a bit. Then we continue from the interview.

## The full path afterwards

Say at the end: "When you have worked on the project for a bit and know what is giving you trouble, type `/startkit` again. Then we do the interview and the research, and the rules are adapted to you." Write it under "Next step" in `STATUS.md`.

When the person comes back: continue from phase 3, and skip the questions that have already been answered. After phase 5 the setup is run again (it is made to be run several times), so the rules are updated.
