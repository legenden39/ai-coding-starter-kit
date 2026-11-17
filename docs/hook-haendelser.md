# Hook-hændelser i Claude Code og Codex (opslag 16. nov. 2026)

Formål: grundlag for trin 1 i `docs/oplaeg-en-kommando.md` (loop-stop som lås og modelanbefaling ved chatstart). Opslaget er læst på de officielle sider af en hjælper (web-hentning), ikke afprøvet i kørende værktøjer. Siderne ændrer sig; læs dem igen, før noget bygges.

Kilder:
- Claude Code: https://code.claude.com/docs/en/hooks (læst ordret på lister, fejl, blokering, Stop og modelnavn; SessionStart og UserPromptSubmit kun gennem et resumé af siden, markeret nedenfor).
- Codex: https://learn.chatgpt.com/docs/hooks (hele siden læst). Den gamle adresse `developers.openai.com/codex/hooks` sender videre (308) til den nye. Henvisninger i kittet til den gamle adresse bør tjekkes.

## Claude Code
- **Hændelser:** 33 i tabellen, bl.a. SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, **PostToolUseFailure**, Stop, StopFailure, SessionEnd, **PreModelSwitch**, **PostModelSwitch**.
- **PostToolUseFailure** får: `tool_name`, `tool_input`, `tool_use_id`, **`error`** (tekst), `is_interrupt`, `duration_ms`. Ingen `tool_response`. Exitkoden står kun som første linje i `error` ("Exit code N") for Bash/PowerShell; formatet varierer pr. værktøj. Kan **ikke blokere**; kan give tilbagemelding til AI'en via `hookSpecificOutput.additionalContext` eller exitkode 2 (stderr vises for AI'en).
- **PreToolUse kan blokere:** exitkode 2 (stderr er årsagen), eller JSON `permissionDecision` = deny/allow/ask/defer med `permissionDecisionReason`. Rangorden: deny > defer > ask > allow.
- **Stop kan blokere:** `decision: "block"` med `reason`. Feltet `stop_hook_active` og `last_assistant_message` findes. Der er et loft på 8 fortsættelser i træk (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`).
- **SessionStart (resumé, ikke ordret):** `source` = startup/resume/clear/compact/fork; `model` er valgfri og kan mangle. Tekst fra hooken (stdout eller `additionalContext`) lægges i AI'ens sammenhæng før første besked.
- **Modelnavn:** ingen `model` i de fælles felter. Kun SessionStart kan have det, og PreModelSwitch/PostModelSwitch får `from_model` og `to_model`. Værktøjshændelser har `effort.level`.

## Codex
- **Hændelser:** PreToolUse, PermissionRequest, PostToolUse, PreCompact, PostCompact, SessionStart, SessionEnd, SubagentStart, SubagentStop, UserPromptSubmit, Stop, Interrupt, PreModelRequest, PostModelRequest.
- **Ingen separat fejlhændelse.** PostToolUse kører også, når en Bash-kommando slutter med fejl. Den får `tool_response` ("værktøjsspecifikt output") og ingen egen exitkode- eller fejlfelt på siden. Hvordan fejl ser ud i `tool_response`, er **ikke dokumenteret** og skal afprøves.
- **PostToolUse** kan med `decision: "block"` ikke fortryde kommandoen, men erstatter værktøjets resultat med tilbagemelding til AI'en.
- **PreToolUse blokerer:** exitkode 2 eller `permissionDecision: "deny"`.
- **Stop blokerer:** `decision: "block"` med `reason` bliver en ny besked til AI'en. `stop_hook_active` findes.
- **SessionStart:** `source` = startup/resume/clear/compact/fork. Tekst herfra kommer til AI'en som udviklerkontekst.
- **Modelnavn:** `model` er et fælles felt ("aktiv model-slug").
- **Tillid:** nye eller ændrede hooks springes over, til personen har set dem igennem og godkendt dem med `/hooks` (godkendelsen hænger på hookens hash). Betyder, at hver ændring af en hook-fil i kittet kræver en ny godkendelse. Der findes et flag til at springe tjekket over for én kørsel, men kittet bør aldrig foreslå det.

## Hvad det betyder for trin 1
1. **Loop-stop i Claude Code kan laves som en rigtig lås.** PostToolUseFailure gemmer en renset udgave af fejlen (uden tal, stier og tidspunkter) i en fil pr. chat og tæller. PreToolUse tjekker tælleren: ved samme fejl to gange i træk afviser den næste handling med en almindelig besked ("Samme fejl to gange. Skriv, hvad du har prøvet, og find årsagen, før du prøver igen"). Stop-hooken kan bagefter kræve en notat i `docs/gentagne-fejl.md`.
2. **Loop-stop i Codex er sværere.** Der er ingen fejlhændelse. PostToolUse må selv genkende fejl i `tool_response`, og det format er ikke dokumenteret. Det skal afprøves i en rigtig Codex-kørsel, før noget bygges. Indtil da er Codex-udgaven en tekstregel, og det skal siges ærligt.
3. **Modelanbefaling ved chatstart:** begge værktøjer kan give tekst til AI'en ved SessionStart (kittets `start.js` gør det allerede). Hvilken model der kører, kan læses i Codex (`model`) og kun nogle gange i Claude Code (`model` er valgfri i SessionStart). Claude Code har også hændelser ved modelskift. Forsøget i november (`docs/modelvalg-som-laas.md`) fik ikke hooken kaldt i skrivebordsappen; den nye liste viser, at hændelserne findes i dokumentationen, men **om skrivebordsappen kalder dem, er ikke afprøvet**.
4. **Tillid i Codex:** hver gang en hook-fil ændres, skal personen godkende igen. Kittet bør derfor holde hook-filerne få og stabile og lægge ændringer i datafiler, ikke i hook-koden.

## Ikke afklaret
- Om skrivebordsappen kalder PostToolUseFailure og modelskift-hændelserne.
- Hvordan en fejl ser ud i Codex' `tool_response`.
- Om begge værktøjer deler samme JSON-format for blokering i alle tilfælde (der er småforskelle, fx `permissionDecision` kontra ældre `decision`).
