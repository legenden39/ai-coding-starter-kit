# The small interview

The small interview is the least the setup needs to make short, fitting rules. It is not about the project itself, only about how the AI should behave for this person. It takes 5-10 minutes.

The foundation comes first. The thorough interview about the project and the way of working waits until afterwards (see `claude/en/references/project-steps.md`). The rules are therefore general until the person has adapted them after some experience. Say it honestly.

## The questions

Ask only these, 2-3 at a time. Use the follow-up rule from `claude/en/references/interview.md` if an answer is too thin to use.

1. What should I call you? (field: `person.name`. A nickname is fine.)
2. How much have you coded yourself: not at all, a little or quite a lot? (field: `person.level`)
3. What should the project be called as a working name? A few words are enough, and if you do not have an idea yet, we call it "My first project". You do not need to say more about it now. (fields: `projects[].name`, `projects[].description`, `chosen_project`)
4. What must the AI never do without asking you first? Suggest three yourself, and let the person add and remove: delete files, put something on the internet, install new programs or packages. (field: `rules.never_without_ok`)
5. Do you want explanations along the way, or just the result? (field: `rules.answer_style`)
6. What should the AI do when it is in doubt: ask, or choose itself and say so? (field: `rules.when_in_doubt`)

If there is already code in the folder, find one command together with the person that shows that it works (field: `check_commands`). Otherwise leave the list empty, and say that the done-check can only try something once there is a test. If the full test takes long (more than a couple of minutes), put a quick command in `check_commands` and the full one in `full_check_commands`: the proof then runs the full one itself when it was last green more than 7 days ago.

Save the answers in `.startkit/profile.json` using the schema at the bottom of `claude/en/references/interview.md`.

## When the foundation stands

Say at the end: "The foundation is in place. Now you can begin on the project itself in a new chat, with the safety net under you. If you want help taking the project from idea to plan, type `/startkit` again." Write it under "Next step" in `STATUS.md`.
