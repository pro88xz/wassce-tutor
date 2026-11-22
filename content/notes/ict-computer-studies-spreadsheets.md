:::callout{type=definition}
A **spreadsheet** is a program that arranges data in a grid of rows and columns of **cells** and can calculate with it using **formulas** and **functions**, recalculating automatically when the data changes. Microsoft Excel, Google Sheets and LibreOffice Calc are spreadsheet programs.
:::

Teachers use spreadsheets to total and average marks, traders to keep sales and stock, and families to plan a budget. This lesson explains the **parts of a spreadsheet** (workbook, worksheet, cell, cell reference, range), how to write **formulas** and use **functions** such as SUM, AVERAGE, MAX, MIN, COUNT and IF, the **difference between relative and absolute cell references**, and how to sort data, draw charts and correct common errors.

## Learning objectives

By the end of this lesson you should be able to:

- define a spreadsheet, name examples and state its uses
- explain workbook, worksheet, cell, cell reference, range, row and column
- enter labels, values and formulas, and write formulas using operators
- use the functions SUM, AVERAGE, MAX, MIN, COUNT and IF
- distinguish relative, absolute and mixed cell references
- sort data, draw a suitable chart and recognise common error messages

## Spreadsheet programs and uses

**Examples:** Microsoft **Excel**, Google **Sheets**, LibreOffice **Calc**, WPS Spreadsheets. The first spreadsheet program for personal computers was **VisiCalc** (1979), followed by **Lotus 1-2-3**.

**Uses:** students' marks and results; budgets and accounts; payroll; sales and stock records; loan and interest calculations; statistics and charts.

**Advantages over working on paper:** calculations are **fast and accurate**; results **update automatically** when a value changes; formulas can be **copied** down a column; data can be **sorted**, **filtered** and shown in **charts**; "what if" questions can be tested by changing a value.

## Parts of a spreadsheet

![A spreadsheet of test marks: columns are lettered A to D and rows numbered 1 to 6. The name box shows D2, the active cell, and the formula bar shows its formula =SUM(B2:C2). Column A holds the names Aminata, Ibrahim, Fatmata and Mohamed; columns B and C two test marks; column D the totals 33, 28, 36 and 25. The range B2:C5 is shaded. Cell C4, in column C and row 4, holds 19. Row 6 holds averages worked out with formulas such as =AVERAGE(B2:B5): 14.5, 16 and 30.5](https://wasscetutor.com/img/ict/spreadsheet-window.svg)

*Figure 1. The parts of a spreadsheet, shown on a sheet of test marks. WASSCE Tutor diagram.*

:::callout{type=definition}
**Workbook:** a spreadsheet file, which holds one or more worksheets.

**Worksheet:** one page (grid) of rows and columns in a workbook; its tab at the bottom shows its name, such as Sheet1.

**Cell:** the box where a row and a column meet; it holds one item of data or a formula.

**Cell reference (cell address):** the column letter followed by the row number that names a cell, such as C4.

**Active cell:** the selected cell, with a thick border, where typing goes.

**Range:** a block of neighbouring cells, named by its first and last cells joined by a colon, such as B2:C5.
:::

- **Columns** run down and are named by **letters** (A, B, … Z, AA, AB …); **rows** run across and are numbered **1, 2, 3 …**
- The **name box** shows the active cell's reference; the **formula bar** shows what the active cell really holds, such as a formula.
- The range **B2:C5** contains $4 \times 2 = 8$ cells: B2 to B5 and C2 to C5.

## Entering data

A cell can hold three kinds of entry:

- **Label (text):** words such as "Name" or "Total"; lined up to the **left** by default.
- **Value (number):** such as 15 or 2500; lined up to the **right** by default.
- **Formula:** a calculation that always starts with an **equals sign (=)**, such as =B2+C2.

## Formulas

:::callout{type=definition}
**Spreadsheet formula:** an instruction in a cell that calculates a value, starting with = and using cell references, numbers and operators, such as `=B2*C2`.

**Function:** a ready-made formula with a name, such as SUM or AVERAGE, that does a calculation on the values given to it in brackets.
:::

| Operator | Meaning | Example |
|---|---|---|
| `+` | add | `=B2+C2` |
| `-` | subtract | `=D2-B2` |
| `*` | multiply | `=B2*3` |
| `/` | divide | `=D2/2` |
| `^` | raise to a power | `=B2^2` |

Spreadsheets follow the order of operations (**BODMAS**): brackets first, then powers, then × and ÷, then + and −. So `=2+3*4` gives 14, but `=(2+3)*4` gives 20.

### Functions

| Function | What it does | Example (marks sheet above) | Result |
|---|---|---|---|
| **SUM** | adds the values | =SUM(B2:C2) | 33 |
| **AVERAGE** | finds the mean | =AVERAGE(B2:B5) | 14.5 |
| **MAX** | finds the largest | =MAX(D2:D5) | 36 |
| **MIN** | finds the smallest | =MIN(D2:D5) | 25 |
| **COUNT** | counts cells holding numbers | =COUNT(B2:B5) | 4 |
| **IF** | gives one result if a test is true, another if false | =IF(D2>=30,"Pass","Fail") | Pass |

:::callout{type=worked-example}
**Working out the marks sheet.** In D2 type **=SUM(B2:C2)** (or =B2+C2): $15 + 18 = 33$. Copy it down to D5 to get 28, 36 and 25. In B6 type **=AVERAGE(B2:B5)**: $(15 + 12 + 17 + 14) \div 4 = 58 \div 4 = 14.5$. In E2, **=IF(D2>=30,"Pass","Fail")** shows Pass for Aminata (33) and, copied down, Fail for Ibrahim (28), Pass for Fatmata (36) and Fail for Mohamed (25).
:::

## Copying formulas: relative and absolute references

:::callout{type=definition}
**Relative cell reference:** a reference such as B2 that changes when the formula is copied to another cell, keeping the same position relative to the new cell.

**Absolute cell reference:** a reference with dollar signs, such as `$B$1`, that stays the same when the formula is copied.

**Mixed cell reference:** a reference in which only the column or only the row is fixed, such as `$B1` or `B$1`.
:::

Dragging the **fill handle** (the small square at the bottom-right corner of the active cell) copies a formula into the cells next to it. When **=B2+C2** in D2 is copied to D3, it becomes **=B3+C3**: the references are **relative**.

:::callout{type=worked-example}
**When you need an absolute reference.** Cell B1 holds the exchange rate, 23 leones to the US dollar. Prices in dollars are in A3, A4 and A5. In B3 type `=A3*$B$1`. Copied down, it becomes `=A4*$B$1` and `=A5*$B$1`: the price changes row by row, but every row still uses the rate in **B1**. Without the dollar signs, the copy in B4 would become `=A4*B2`, which uses an empty cell and is wrong.
:::

Press **F4** while typing a reference to add the dollar signs.

## Sorting, filtering and charts

- **Sort** arranges rows in **ascending** (A to Z, smallest first) or **descending** (Z to A, largest first) order, such as ranking students by total.
- **Filter** shows only the rows that meet a condition, such as students in SSS3.

:::callout{type=definition}
**Chart (graph):** a picture of spreadsheet data, such as a column, bar, line or pie chart, that makes patterns and comparisons easy to see.
:::

| Chart | Best for |
|---|---|
| **Column / bar chart** | comparing amounts, such as each student's total |
| **Line graph** | showing change over time, such as monthly sales |
| **Pie chart** | showing parts of a whole, such as how a budget is shared |
| **Scatter (XY) chart** | showing the relationship between two sets of numbers |

## Formatting and error messages

Formatting changes how data looks: **number format** (decimal places, currency such as Le, percentage, date), **bold**, **borders**, **fill colour**, **column width**, **wrap text** and **merge and centre** for a title across several columns.

| Error | Meaning |
|---|---|
| **#####** | the column is too narrow to show the number; widen it |
| **#DIV/0!** | a formula divides by zero or by an empty cell |
| **#NAME?** | a function name is misspelt, such as =SUMM(B2:B5) |
| **#VALUE!** | the wrong type of data, such as text in a sum |
| **#REF!** | a formula refers to a cell that has been deleted |

:::callout{type=common-mistake}
**Forgetting the equals sign.** Typed without =, "B2+C2" is just a **label** and shows as text. Every formula must begin with `=`.
:::

## Practice

:::reveal{title="1. What is a cell reference? Give an example."}
The **column letter followed by the row number** that names a cell, such as **D2**.
:::

:::reveal{title="2. How many cells are in the range A1:C4?"}
3 columns (A, B, C) × 4 rows = **12 cells**.
:::

:::reveal{title="3. Cells A1 to A4 hold 10, 20, 30 and 40. What do =SUM(A1:A4), =AVERAGE(A1:A4) and =MAX(A1:A4) give?"}
**100**, **25** and **40**.
:::

:::reveal{title="4. The formula =B2*C2 in D2 is copied to D5. What does it become, and why?"}
`=B5*C5`, because the references are **relative**: they change by the same number of rows as the formula moves (three rows down).
:::

:::reveal{title="5. Distinguish between a relative and an absolute cell reference."}
A **relative** reference (B2) **changes** when the formula is copied; an **absolute** reference (`$B$2`) **stays the same** wherever the formula is copied.
:::

## Key points

- A **spreadsheet** calculates with data in **cells**: Excel, Google Sheets, LibreOffice Calc.
- **Workbook** (file) → **worksheets** → **cells**; a **cell reference** is column + row, such as C4; a **range** is written B2:C5.
- Entries: **labels, values, formulas**; every formula starts with **=**; operators + − * / ^ follow **BODMAS**.
- Functions: **SUM, AVERAGE, MAX, MIN, COUNT, IF**.
- **Relative** references (B2) change when copied; **absolute** (`$B$2`) do not; **mixed** (`$B2`, `B$2`) fix one part.
- **Sort** (ascending/descending), **filter**, and **charts**: column/bar to compare, line for time, pie for parts of a whole.

## WASSCE examination focus

:::callout{type=waec-tests}
Spreadsheet questions typically ask you to define spreadsheet terms (cell, cell reference, range, workbook, worksheet), to write formulas and functions for a given table, to work out the result of a formula, to state what a copied formula becomes, to explain relative and absolute references, and to choose a suitable chart. Write formulas exactly as you would type them, starting with =, with the right cell references and a colon in every range.
:::
