# The short path

The short path is for someone who wants the safety nets and the overview in place now and will take the thorough interview later. It typically takes 20-40 minutes and uses far less usage than the full path.

The person chooses the path in phase 1b. You may tell them what the difference is, and what you would choose in their situation, but you do not choose for the person.

## What the short path gives, and what it does not give

Gives: a check of the computer, the fixed rules, the guard, the done-check, the key check, the status file, the overview page and (if the person wants it) a private backup.

Does not give yet: the thorough interview, the research into the person's own problems, the plan with suggestions, the model guide and the tailored layer. The rules are therefore more general until the full path has been taken.

Say it honestly before the person chooses.

## The order

1. Phases 2 and 2b as usual (the computer, name and email in git, key scan).
2. The small interview below instead of phase 3.
3. Skip phases 4 and 5. Write ⏳ next to them and next to phase 3 in `.startkit/status.md`.
4. Phases 6 and 7 as usual (the foundation is set up and tried).
5. Phase 8: show the overview, but do not build a tailored layer.
6. Phase 9 as usual (wrap-up, backup, feedback).

## The small interview

Ask only these questions, 2-3 at a time. They are the least the setup needs. Use the follow-up rule from `en/references/interview.md` if an answer is too thin to use.

1. What should I call you? (field: `person.name`. A nickname is fine.)
2. How much have you coded yourself: not at all, a little or quite a lot? (field: `person.level`)
3. What is the project called, and what should it be able to do? Two sentences are enough. If you do not have an idea yet, we call it "My first project". (fields: `projects[].name`, `projects[].description`, `chosen_project`)
4. What must the AI never do without asking you first? Suggest three yourself, and let the person add and remove: delete files, put something on the internet, install new programs or packages. (field: `rules.never_without_ok`)
5. Do you want explanations along the way, or just the result? (field: `rules.answer_style`)
6. What should the AI do when it is in doubt: ask, or choose itself and say so? (field: `rules.when_in_doubt`)

If there is already code in the folder, find one command together with the person that shows that it works (field: `check_commands`). Otherwise leave the list empty, and say that the done-check can only try something once there is a test.

Save the answers in `.startkit/profile.json` using the schema at the bottom of `en/references/interview.md`, and add `"path": "short"`.

## The full path afterwards

Say at the end: "When you have worked on the project for a bit and know what is giving you trouble, type `$startkit` again. Then we do the interview and the research, and the rules are adapted to you." Write it under "Next step" in `STATUS.md`.

When the person comes back: continue from phase 3, and skip the questions that have already been answered. After phase 5 the setup is run again (it is made to be run several times), so the rules are updated.
