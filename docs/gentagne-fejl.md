# Gentagne fejl

Fejl, der er sket mere end én gang. AI'en læser listen i starten af hver chat.
Siger du "den fejl igen", skriver AI'en den ind her og foreslår en lås.

"Låst af" viser, hvor stærkt fejlen er forhindret: en hook eller en test er stærk; "tekstregel" eller "nej" er svag og bør blive til en lås.

| Dato | Hvad skete der | Årsag | Låst af |
|---|---|---|---|
| 2026-11-13 | Ejeren skiftede fra en stærk til en billigere model midt i en opgave, og AI'en sagde ikke fra. | Modelvalget stod kun i "hvad nu?" og i forslaget til næste chat, og projektet brugte ikke kittets regler selv. | tekstregel (`CLAUDE.md`). En hook ved modelskift er prøvet og blev ikke kaldt: `docs/modelvalg-som-laas.md` |
