# The interview

The interview is a flowing conversation, not a form. There are 8 topics (rounds). The number of questions is not fixed: it can be fewer than here if the answers are thorough, and more if an answer opens up something worth understanding.

The questions below are **starting questions**. What counts is the **fields**: the information you need to take home from each round. A round is finished when the round's fields are filled in or noted as open, not when all the questions have been asked.

At the start of each round, say: "Topic X of 8", and give the round's "Why this round" in your own words. Ask 2-3 things at a time. Sum up after each round, and ask "is that right?".

## How to keep the conversation flowing

1. **Listen for what the answer already covers.** A good answer often answers several questions at once, in other rounds too. Fill in all the fields the answer covers, and do not ask those questions afterwards. If you are unsure whether you understood it correctly, say: "You have already told me this: ... Is that right?"
2. **Follow up when an answer opens something.** If the person mentions a problem, an incident, a tool or a worry that is not on the list, ask about it with your own questions. This is often where the most important things come out. Save what you learn in the profile under `extra` with a short heading.
3. **Only ask follow-up questions that serve one of the four goals** (quality, an efficient way of working, overview, fewer wasted tokens), or that you need in order to set something up correctly. Curiosity alone is not enough.
4. **At most two follow-ups on the same thread.** Then return to the round. If there is more to get, note the thread as open, and take it up in the plan.
5. **Skip what is not relevant.** If nothing is going out to real people, round F is one question. If there is only one project, round D is asked once.
6. **Use the person's own words** when you ask further and sum up. Change the order if the conversation naturally goes somewhere else; the fields are the same.
7. **Say where you are.** If a round gets longer than expected, say so: "Two more questions about this, then we move on." Ask whether the person wants a break when you have been going for a long time.

The interview ends when you have what you need to make a good plan. At the end, check the fields in the profile schema at the bottom: if one of them is missing, ask for it.

## The follow-up rule (applies to all questions)

If the answer is empty, under about 8 words without concrete content, or contradicts an earlier answer, ask once more using the "Follow up" field, and give an example of a good answer. Ask at most 2 times per question. After that the answer is accepted, and the question's id is put in `open` in the profile. Open points are shown in the wrap-up and taken up when the starter kit is resumed.

"Don't know" is a valid answer. Note it as open, and move on without pressing.

If the person pastes a key or a password, never repeat it. Ask the person to delete the message, if that is possible, and to change the key. Note only the type.

## Round A: You and your goal

Why this round: everything else is adapted to who you are and what you want to achieve.

### A1
Question: What should I call you, and what do you use AI for today? Tell it the way you would to a friend.
Good answer: A name and at least one concrete thing AI is used for.
Follow up: What was the last thing you got AI to make for you?
Field: person.name, person.uses_ai_for

### A2
Question: What would you like to be able to do in three months that you cannot do today?
Good answer: A concrete goal that can be seen or tried.
Follow up: If it went really well, what would you be sitting with?
Field: person.goal

### A3
Question: How much have you coded yourself: not at all, a little or quite a lot? Give an example.
Good answer: One of the three, and an example.
Follow up: Can you, for example, read an error message and guess what is wrong?
Field: person.level

### A4
Question: Is it a hobby, work or something you want to earn money from?
Good answer: One choice, and preferably why.
Follow up: Will anyone other than you ever use what you build?
Field: person.purpose

### A5
Question: How much time do you spend on it per week, and how long do you sit at a time?
Good answer: A rough number and a typical length.
Follow up: Is it evenings, weekends or scattered?
Field: person.time

## Round B: How you work today

Why this round: we can only improve a way of working that we know. Here we look for the places where time and tokens disappear.

### B1
Question: Walk me through the last time you worked on something with AI, from when you opened the program until you closed it. What did you do first, and how did you finish?
Good answer: A sequence with at least three steps.
Follow up: What was the very first thing you wrote to the AI that day?
Field: workflow.last_session

### B2
Question: When you come back to a project after a few days, how do you find out where you left off?
Good answer: A concrete method, or "I don't, and that is a problem".
Follow up: Do you have to explain everything to the AI from scratch every time?
Field: workflow.between_sessions

### B3
Question: Where are your projects on the computer, and how are the folders organised? Did you choose that yourself, or did the AI make them?
Good answer: A place, and who decided the structure.
Follow up: If I asked you to find the newest version of a particular file, could you do it straight away?
Field: workflow.folders

### B4
Question: Do you work in one long chat, or do you start a new one for each task?
Good answer: One of the two, and why.
Follow up: How long does a chat typically get before you start a new one?
Field: workflow.chats

### B5
Question: How do you know that something the AI has made actually works?
Good answer: A concrete way (tries it myself, tests, trust it).
Follow up: Has it happened that it said "done", and then it did not work?
Field: workflow.checking

### B6
Question: What happens when the AI has to fix something? What does it go through, and can you follow what it changes?
Good answer: A description of what the person sees and does not see.
Follow up: Do you know afterwards which files it has touched?
Field: workflow.fixes

## Round C: What is annoying

Why this round: this is where the biggest gain is. Every annoyance becomes a concrete point that we research a solution for.

### C1
Question: What annoys you most about working with AI right now? Feel free to write several things.
Good answer: At least two concrete things.
Follow up: Think of the last time you got angry with it. What happened just before?
Field: annoying.irritations

### C2
Question: Which mistakes does the AI make again and again, even though you have said it before?
Good answer: At least one example, or a reasoned "none".
Follow up: Is there something you have had to explain more than twice?
Field: annoying.recurring_mistakes

### C3
Question: When do you lose the overview? What exactly is it that you cannot see or do not know?
Good answer: A concrete situation.
Follow up: Is it an overview of the files, of what is finished, of what is happening right now, or something else?
Field: annoying.overview

### C4
Question: Has something gone really wrong: something was deleted, broken or overwritten?
Good answer: An incident, or "no".
Follow up: How did you discover it, and did you get it back?
Field: annoying.accidents

### C5
Question: What have you tried yourself to solve these things, and how did it go?
Good answer: At least one attempt, or "nothing yet".
Follow up: Have you, for example, written rules for it, made your own instructions or tried another tool?
Field: annoying.tried

### C6
Question: What makes you close the computer and give up for the day?
Good answer: A concrete situation.
Follow up: Can you remember the last time?
Field: annoying.gives_up

## Round D: Your projects

Why this round: the foundation has to fit what you actually build. Take one project at a time; repeat D1-D5 for each (three at most now, the rest can come later).

### D1
Question: What is the project called, and what does it do? Explain it in 2-3 sentences.
Good answer: A name and an action ("you can ...").
Follow up: Give an example of what a person does when they use it.
Field: projects[].name, projects[].description

### D2
Question: How far along is it? What works, and what is half finished?
Good answer: At least one thing that works, and one that is missing.
Follow up: If you had to show it to someone today, what would you show?
Field: projects[].status

### D3
Question: What is it built with, if you know (language, database, other)? "I don't know, the AI chose" is a fine answer.
Good answer: A list, or "don't know".
Follow up: How do you start it? A file you open, or a command?
Field: projects[].tech, projects[].start_command

### D4
Question: What does "finished" look like for this project?
Good answer: At least one thing that can be tried.
Follow up: Name three things a user must be able to do.
Field: projects[].finished_is

### D5
Question: What must the project never become or do?
Good answer: At least one thing, or a reasoned "nothing".
Follow up: What would make you say "no, we are not having that"?
Field: projects[].never

### D6
Question: Which project should we set up the foundation in first, and where is the folder?
Good answer: One project and a path.
Follow up: Open the folder in File Explorer, and copy the address.
Field: chosen_project, project_folder

## Round E: Tools, models and usage

Why this round: the wrong model and too much background are the two biggest causes of wasted tokens and uneven quality.

### E1
Question: Which subscription do you have, and do you use the app on the computer, the terminal, the chat in the browser or several of them?
Good answer: A plan name and at least one place.
Follow up: Where do you sit when you build: in the ChatGPT chat or in Codex?
Field: tools.plan, tools.surfaces

### E2
Question: How do you choose a model today? Do you choose yourself, or do you take the one that is there?
Good answer: A description of what actually happens.
Follow up: Do you know which model you used last?
Field: tools.model_choice

### E3
Question: You have seen that it sometimes thinks for a very long time and at other times answers straight away. When does which happen, as far as you can see?
Good answer: A pattern or "I can't see any pattern".
Follow up: Was the long thinking on a hard task or on something simple?
Field: tools.thinking_time

### E4
Question: Have you hit the limit of your usage? How often, and what were you doing?
Good answer: Yes or no, and for yes a situation.
Follow up: Do you know where you see how much you have used?
Field: tools.limit

### E5
Question: Do you use agents that work on their own, or an API key that your own programs use? What controls which tasks they get?
Good answer: Yes or no, and for yes a short description.
Follow up: Does the API usage cost something on top of your subscription, and do you keep an eye on it?
Field: tools.agents_api

### E6
Question: Which plugins, add-ons or other AI tools have you connected, and which do you actually use?
Good answer: A list, or "none".
Follow up: Is there something you installed and have never used?
Field: tools.addons

## Round F: The real world

Why this round: something working on your own computer is one thing. When it has to be on its own domain, send real emails and take real payments, other requirements apply. We want to know them in advance.

### F1
Question: Is any of what you build going out to real people? Roughly when?
Good answer: Yes, no or maybe, and a rough time.
Follow up: Who are the first people who will use it?
Field: real_world.going_out

### F2
Question: Should it be on its own domain, and do you know where it will run (hosting)?
Good answer: Yes or no, and a place or "don't know".
Follow up: Do you have a domain today?
Field: real_world.domain, real_world.hosting

### F3
Question: Should it send emails or text messages to real people?
Good answer: Yes or no, and which kinds of messages.
Follow up: For example receipts, login links or newsletters?
Field: real_world.emails

### F4
Question: Should it take money?
Good answer: Yes, no or later.
Follow up: How should people pay, and who is the payment to?
Field: real_world.payment

### F5
Question: Does it store information about real people (names, emails, phone numbers, payments)? Do the users have to log in?
Good answer: Yes or no to both, and for yes which information.
Follow up: If no now: will it become yes later?
Field: real_world.personal_data, real_world.login

### F6
Question: What are you most unsure about in going from test to real operation?
Good answer: At least one concrete worry.
Follow up: What would you hate to discover too late?
Field: real_world.worry

## Round G: Security and backup

Why this round: a key in the wrong file or a deleted project are the mistakes that cannot be undone. We put locks on those.

### G1
Question: Which kinds of keys and accounts do your projects use (for example OpenAI, payment, email, database)? Only the types, never the keys themselves.
Good answer: A list of types, or "none".
Follow up: Does any of it require a login to another service?
Field: security.key_types

### G2
Question: Do you know where the keys are today? Are any of them written directly in the code?
Good answer: A place, or "don't know".
Follow up: Has the AI ever written a key into a file for you?
Field: security.keys_are

### G3
Question: Do you use git, and do you have a copy of the projects somewhere other than on the computer (for example GitHub)?
Good answer: Yes or no to both.
Follow up: If the computer broke tomorrow, what would be gone?
Field: security.git, security.copy

### G4
Question: Do you work on several computers or with several accounts?
Good answer: Yes or no, and how many.
Follow up: How do you get the newest version from one to the other?
Field: security.several_machines

### G5
Question: What must the AI never do without asking you first?
Good answer: At least one thing (for example delete files, put something on the internet, spend money).
Follow up: What would frighten you if it did it on its own?
Field: rules.never_without_ok

## Round H: How you want it

Why this round: here you decide how the AI should talk to you, and what your overview should show.

### H1
Question: Do you want explanations along the way, or just the result? And how long should the answers be?
Good answer: One choice, and a wish for the length.
Follow up: Explanation always, or only when something is new or risky?
Field: rules.answer_style

### H2
Question: What do you want to decide yourself, and what may the AI choose for you?
Good answer: At least one area the person decides themselves.
Follow up: For example appearance, features, money, tools: what belongs with you?
Field: rules.decides_myself

### H3
Question: What should the AI do when it is in doubt: ask, stop or choose itself and say so?
Good answer: One choice.
Follow up: Rather one question too many than a mistake?
Field: rules.when_in_doubt

### H4
Question: Imagine a page you open before you start. What should you be able to see on it to know where you are?
Good answer: At least three things.
Follow up: For example what was done last, what the next step is, what has changed, usage, open problems?
Field: overview.wants_to_see

### H5
Question: What should be at the top of that page? The one thing you want to see first.
Good answer: One thing.
Follow up: If the page could only show one thing, what would it be?
Field: overview.most_important

### H6
Question: Is there anything I have not asked about that I need to know to help you well?
Good answer: Something concrete, or "no".
Follow up: (none; "no" is a complete answer)
Field: person.other

## Profile schema (`.startkit/profile.json`)

Save the answers using the fields' names. Never keys or passwords. The setup uses these fields directly, and they must be filled in before phase 6:

```json
{
  "person": { "name": "…" },
  "chosen_project": "…",
  "project_folder": "…",
  "projects": [{ "name": "…", "description": "…", "start_command": "" }],
  "rules": {
    "never_without_ok": ["delete files", "put something on the internet"],
    "answer_style": "Short answers. Explain only what is new or risky.",
    "when_in_doubt": "ask"
  },
  "check_commands": [],
  "tools": { "models": [] },
  "extra": [{ "heading": "…", "what_i_learned": "…" }],
  "open": []
}
```

Write the entries in `never_without_ok` so they fit after "Ask the owner before you: …" (for example "delete files"), and `when_in_doubt` so it fits after "If you are in doubt: …" (for example "ask the owner").

`check_commands` are the commands that prove that the project works (for example `npm test`). Find them together with the person based on D3. If there are none yet, leave the list empty, and include "a first test" in the plan in phase 5.
