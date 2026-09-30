# AI Usage Notes

**Tool used:** Claude (Anthropic) for planning, code generation and review.

**Approach / prompts:** The assignment PDF was given to the AI with the instruction to plan first (requirements, architecture, schema, API list, pages), then break work into the 10 suggested tasks and generate the backend, then the Angular frontend, then docs.

**Where AI helped:** all planning docs; Express routes, Mongoose models, validation; Angular services, pages (dashboard, list, form, details), styling; README/API docs.

**Issues / incorrect output caught during generation**
- Scaffold script initially created literal folders named `{models,routes,...}` (shell brace expansion not supported in `sh`). Detected when files failed to write; fixed by creating each directory explicitly.
- No functional bugs were found in the Angular build (strict TypeScript + strict templates compiled cleanly).

**Review, correction and testing**
- Backend: module load check and direct unit checks of the validation function (empty input, bad email/phone, valid input).
- Frontend: production `ng build` with `strict` and `strictTemplates` passes.
- NOT yet verified by the AI: end-to-end behaviour against a live MongoDB. Run the checklist in TESTING.md and record results.
- Add your own review notes here (what you read, changed, and why).
