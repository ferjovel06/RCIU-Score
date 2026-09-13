# ARAGON-FGR research calculator

Spanish-language React + TypeScript + Vite application based on the project's score documents. No patient records, accounts, analytics or database are included. Selections are kept in memory and reset on reload. Only the application shell is cached for offline use.

## Development

Use Node 22.12+ (Node 24 recommended). Run `npm ci`, then `npm run dev`. Run `npm test` to verify all 128 factor combinations and the pilot example. `npm run build` type-checks and produces the static application in `dist`. `npm run preview` serves that production output. Offline support is enabled in the production build, not the development server. HTTPS or localhost is required for service workers.

## Source mapping

Authoritative files remain in the parent project's `docs` directory; they are not included in the hosted application or source repository.

- ARAGON_FGR_Score.docx: table 2 defines seven weights totaling 13; table 3 defines low 0–2, moderate 3–5 and high ≥6; table 4 supplies approximate probabilities for scores 0–9 and >85% for ≥10.
- Score prueba piloto.pdf: confirms weights, the probability table and the example abortion + preeclampsia + chronic lung disease = 6 (high).
- Modelo Predectivo de Indice de RCIU.docx: describes planned development and internal validation. It does not establish completed validation.

## Explicit interpretation decisions

1. Probability is a direct table lookup. No logistic intercept is provided, so no intercept is invented and no individual calibrated probability is claimed.
2. Main classification uses table 3. At 10–13, a secondary note reports table 4's “Muy alto” label.
3. Source says “Preeclampsia”; the screenshot says “Preeclampsia previa”. The source label is retained, with an explanatory note. The timing definition requires clarification before clinical use.
4. Active maternal smoking adds 1 point to a user-requested experimental extended total (0–14). Original score (0–13), probability and risk category remain explicitly separate. No probability or risk category is inferred for the extended model.
5. Zero points is low risk under the table, never “no risk”. No treatment or surveillance advice is generated.
6. The graphic reproduces the three conceptual p90/p50/p10 curves from the reference. Its green marker moves continuously from the p90 area toward p10 as the extended 0–14 score increases. This is a score visualization, not a calculated fetal percentile.

Software verification does not constitute validation of the clinical model. The original research datasets are not read, copied or published by this app.
