# From test to the real world

Read only if round F shows that something is going out to real people. When a project gets its own domain, real emails and real payments, other requirements apply than on your own computer. The purpose here is that the person knows the requirements **before** they hit.

This is a checklist for overview, not legal or financial advice. Legal requirements and providers' rules change, and they differ from country to country: look up each point that applies to the person with the official source for the person's own country in phase 5, and say clearly where a professional (a lawyer, an accountant) should be asked before real users arrive.

Go through only the sections the person's answers point to. Each point that applies becomes a point in `.startkit/plan.md`.

## 1. Two worlds: test and production

- Keep test and production separate: each its own database, each its own set of keys, each its own address. A mistake in test must never be able to hit real users.
- The AI only works in test. It never logs in to production and never gets production's keys.
- Deployment (putting out a new version) happens with one fixed script that builds, tests and only deploys on green, and only after the owner's yes. Direct deployment can be blocked with a rule in the guard once the hosting has been chosen.
- After each deployment: check that the right version is actually running. Do not believe "it went well" without seeing it.
- Have a way back: know how the previous version is put out again.

## 2. Your own domain

- The domain must be owned by the person (or the company), not by a developer or an AI service.
- A secure connection (https) all the way.
- Who has access to the domain's settings (DNS)? Switch on two-step login there.
- Renewal: an expired domain shuts down both the site and the email.

## 3. Real emails

- Email from your own domain requires setup in the domain's settings (SPF, DKIM and DMARC), otherwise the email ends up in spam or is rejected. Look up the provider's current guide.
- Use an email service to send; do not send from a private mailbox in code.
- Keep test and production separate: test must never be able to send to real recipients.
- Marketing emails require consent and a way to unsubscribe. Receipts and login links are something different from newsletters. Look up the rules.
- What happens if an email does not arrive? It must be visible somewhere.

## 4. Real payments

- Use a payment provider. Never store card details yourself.
- Build and test in the provider's test mode with test keys and test cards. The AI must never complete a real payment or have production's payment keys.
- The payment is confirmed by the provider's message to the server (a webhook), not by the user landing on a "thank you" page. The message must be checked for authenticity, and it can arrive twice.
- Think through what goes wrong: interrupted payment, double click, refund, disputes.
- Taking money triggers requirements for the business (for example registration, sales tax or VAT, bookkeeping, terms and conditions, the right of withdrawal when selling to consumers). That is a question for an accountant or the authorities' own pages, not for the AI.
- Code that touches money is written with the strongest model and with tests before the code.

## 5. Information about real people (privacy law, for example the GDPR)

- Make a list of which information is stored, why, where, and for how long. Store only what is necessary.
- People must be able to find out what is stored about them, and have it deleted. Build that in from the start.
- A privacy policy on the site, and consent for cookies that are not necessary.
- Services that process the information for you (hosting, database, email) require a data processing agreement, and it matters where in the world the data is.
- Use only made-up data in test and in the chat with the AI. Never real people's information in a chat, in an error message or in git.
- Special information (health, children and so on) requires more. Ask a professional first.
- A breach (data out where it must not be) must in some cases be reported within a short deadline. Know in advance who does what.

## 6. Login and access

- Do not build password handling yourself; use a well-tried solution.
- Permissions are enforced on the server and in the database, not only by hiding a button.
- Test it as a stranger: can one user see another's data by changing a number in the address?
- Limit the number of attempts (login, forms), so they cannot be abused.

## 7. Operation: when it is running

- A backup of the database, and try at least once to restore it. A copy that has never been tried does not count.
- Errors must be visible: a log or a message when something goes wrong.
- Keep track of costs: set spending limits with the services that can run away (especially AI usage via API).
- Who do the users contact when something does not work? A contact address that is read.
- Write down which accounts and services the project depends on, and who has access (only types and names of services, never keys).

## How the checklist is used in the plan

For each point that applies: write what the status is today (in place, missing, don't know), what has to be looked up with an official source, and what has to be locked with a hook or a test. Put the points in order: what cannot be undone (money, personal data, keys) comes first.
