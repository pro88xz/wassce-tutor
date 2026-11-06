# Mathematics (Core): what Sierra Leone candidates are examined on

Research behind the question bank, from primary sources only (listed at the end).
The purpose is to write practice questions that match the real paper, not
questions that never come up.

## The exam

| Paper | What it is | Marks | Time |
|---|---|---|---|
| Paper 1 | 50 multiple-choice questions, options **A–D**, drawn from the common areas of the syllabus | 50 | 1½ h (about 1.8 min per question) |
| Paper 2, Section A | 5 compulsory essay questions, short and "elementary in nature" | 40 | 2½ h for the whole of Paper 2 |
| Paper 2, Section B | 8 longer questions, answer 5. Up to 2 may come from parts of the syllabus that are not in the Sierra Leone national curriculum. Candidates in Sierra Leone may skip those. | 60 | |

Calculators (non-programmable) and WAEC mathematical tables are allowed, but a
question can forbid them. Examiners penalise candidates who use a calculator
when told not to.

## What the Sierra Leone papers actually tested

From the WAEC Chief Examiner's reports for Sierra Leone school candidates:

| Year | Paper 2 questions (topic per part) |
|---|---|
| 2018 | Q1 trig equation, change of subject · Q2 A.P. · Q3 sector folded into a cone · Q4 simple interest · Q5 probability (independent events) · Q6 indices (simultaneous), percentage profit on a mixture · Q7 quadratic graph · Q8 parallel-line angles, **modulo 5 tables** · Q9 indices, perimeter/area word problem (quadratic) · Q10 cumulative frequency · Q11 angle of elevation · Q13 **matrices** |
| 2019 | Q1 standard form without a calculator, ratio · Q2 joint variation, factorisation · Q3 fractional equation, surds · Q4 percentage profit · Q5 probability (either/or), number bases · Q6 vectors, change of subject · Q7 trig table and graph · Q8 construction · Q9 transformations · Q10 three-set Venn diagram, G.P. · Q11 speed, volumes (cube melted into a cone) · Q12 circle theorems, quadratic from its roots · Q13 A.P., fractions word problem, functions |

The 2019 report notes that the paper covered every area of the syllabus except
modular arithmetic and introductory calculus. But modular arithmetic was set in
2018, and the government's own mock paper includes it, so it stays in scope.

**Introductory calculus** (differentiation and integration) is in the current
WAEC syllabus (section G), but no question on it appears in the 2018 or 2019
Sierra Leone papers, and the government's revision handbooks don't cover it.
Treat it as lowest priority. The same goes for the newer **financial
arithmetic** items (amortisation, annuities, capital market instruments).

## Where candidates lose marks

These come straight from the examiners and are what the wrong options in our
questions are built around.

- **Standard form** without a calculator (2019)
- **Percentage profit**, especially working it out on the selling price instead of the cost price (2018, 2019)
- **Simple interest**: finding the time (2018)
- **Variation**: writing the equation and finding the constant (2019)
- **Probability**: with/without replacement (2018); "either/or" when the events overlap (2019)
- **Venn diagrams**: drawing them and placing the numbers (2019)
- **Number bases**: keeping the negative root of the quadratic when finding a base (2019)
- **A.P.**: finding the first term and common difference from terms with variables (2018)
- **Drawing and reading graphs**, constructions, circle theorems, transformations (both years)
- **Matrix multiplication** (2018)

## House rules for writing questions

1. **Original only.** Never copy or reword a WAEC question. Testing the same
   skill is fine; the numbers, context and wording must be ours.
2. **Four options, A–D.** Numbers in ascending order, as on the real paper.
3. **Every wrong option is a real mistake.** Record the mistake in the
   question's `why`, and where possible a `derive` function that reproduces it.
   Prefer the mistakes the examiners report.
4. **Stay inside the syllabus limits.** For example: no sum of a G.P.;
   compound interest for at most 3 years; Venn diagrams with at most 3 sets;
   2×2 matrices for operations; simple surds only.
5. **Paper 1 pace.** A prepared candidate should finish in about 2 minutes.
6. **Sierra Leonean context.** Local names and places, Leones (Le), realistic
   prices and quantities.
7. **Worked solution for every question**, plus a check where one is natural.
8. **Checked by code, loaded in one tap.** Every set must pass the build's
   answer checks. An admin loads it in Admin → Load question sets and it is
   live for students straight away; any set can be hidden in Admin → Review.

## Pilot: 50 questions, 10 topics

`pilot_p1.py` has 5 questions on each of: Indices, Number Bases, Surds,
Sequences and Series, Percentages, Variation, Change of Subject, Quadratic
Equations, Sets, Probability. Every topic appears in the 2018 or 2019 Sierra
Leone paper. Each set works as a 10-minute practice drill.

How each question is checked before it can be built:

- `solve` works the answer out in code. The build fails unless exactly one
  option matches it.
- Every wrong option must differ from the right answer and from each other
  (checked algebraically, so $\sqrt{48}$ counts as equal to $4\sqrt{3}$).
- Where a wrong option has a `derive` function, the build fails unless that
  mistake really produces that option.
- The text students see is parsed and checked against the value, so a typo
  in an option fails the build.

## Set 2: 50 questions, 10 more topics, 15 diagrams

`set2_p1.py` has 5 questions on each of: Circles, Angles and Intersecting
Lines, Sine/Cosine/Tangent, Angles of Elevation and Depression, Bearings,
Volumes, Measures of Central Tendency, Logarithms, Modular Arithmetic, Vectors.

- Circle theorems, parallel-line angles, elevation, bearings, volumes,
  averages, modular arithmetic and vectors all appear in the 2018 or 2019
  Sierra Leone papers. Logarithms and three-figure/distance-bearing form
  follow the Ministry's revision handbooks.
- Diagrams are drawn to scale by `scripts/questions/diagram.py` from the
  same coordinates the question's `solve` measures. If a figure disagrees
  with its question (say the drawn angle is 120° but the question says 124°),
  the build fails.
- Diagrams are saved to `public/questions/` and served from the website.
  Their URL carries a version, so a redrawn diagram is never shown from an
  old cache.
- One option on the tree-height question is the answer a student gets by
  rounding too early, a mistake the examiners name.

## Set 3: 50 questions, 10 more topics, 8 diagrams and charts

`set3_p1.py` has 5 questions on each of: Areas, Lengths and Perimeters,
Polygons, Matrices and Determinants, Transformations, Cumulative Frequency,
Statistics, Measures of Dispersion, Ratio/Proportion/Rates, Linear
Inequalities.

- Cumulative frequency (2018 Q10), matrices (2018 Q13), transformations
  (2019 Q9; rotation is a 2018 weakness), sectors and arcs (2018 Q3),
  perimeter/area (2018 Q9), speed (2019 Q11), polygons, pie charts and
  inequalities (government mock papers), dispersion (government handbooks).
- Class boundaries get their own question: examiners reported candidates
  using class limits instead of boundaries in 2018.
- The pie chart, bar chart and cumulative frequency curve are drawn from the
  same data the answers are worked out from. The curve joins the plotted
  points with straight lines, so the median read from it is exact.

## Set 4: 50 questions on number and algebra

`set4_p1.py` covers Fractions/Decimals/Approximations, Integers and Rational
Numbers, Logical Reasoning, Algebraic Expressions, Operations on Algebraic
Expressions, Linear Equations, Graphs of Linear and Quadratic Functions,
Algebraic Fractions, Functions and Relations, and Coordinate Geometry. Fraction
work (2019 Q13), substitution and factorisation (2019 Q2, Q6), fractional and
simultaneous equations (2018 Q6, 2019 Q3), graphs (2018 Q7) and functions
(2019 Q13) come from the Sierra Leone papers; logical reasoning, algebraic
fractions and coordinate geometry from the government handbooks. One graph,
used by three questions, is drawn from the same function the answers use.

With sets 1-4, 40 of the 46 Mathematics topics have a practice Still to do: similar and congruent figures, loci, construction, financial
arithmetic, and (lowest priority for Sierra Leone) differentiation and
integration; then more questions per topic and Paper 2-style questions with
mark schemes.

## Sources

- WAEC, *General Mathematics/Mathematics (Core) syllabus* (copy hosted by RACHEL):
  https://rachel.core2learn.org/modules/en-wassce/WASSCESYLABUS/GENERAL_MATHEMATICS_OR_MATHEMATICS%20_CORE.pdf
- Ministry of Basic and Senior Secondary Education, *Pupils' Handbook for
  Senior Secondary Mathematics Revision*, Part I and Part II (SSS 4):
  https://mbsse.gov.sl/wp-content/uploads/2020/03/SLP028-SSS_PHM_4_01-Full.pdf,
  https://mbsse.gov.sl/wp-content/uploads/2020/03/SLP029-SSS_PHM_4_02-Full.pdf
- WAEC, *Chief Examiners' Reports, WASSCE for School Candidates 2018* and
  *2019* (Sierra Leone; hosted by the Ministry):
  https://mbsse.gov.sl/wp-content/uploads/2021/07/WASSCE-SC-2018-CES-REPORTS.pdf,
  https://mbsse.gov.sl/wp-content/uploads/2021/07/WASSCE-SC-2019-CES-REPORTS.pdf
