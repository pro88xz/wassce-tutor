**Data security and controls in computerised accounting** protect financial records against **loss, error, fraud and unauthorised access**. The main controls are **passwords and user access levels**, regular **backups**, an **audit trail**, **input controls**, **anti-virus protection** and **segregation of duties**. Alongside full accounting packages, **spreadsheets** let small businesses build cash books, ledgers and trial balances with formulas that add up automatically. This lesson explains the controls and shows how to set up simple accounting records in a spreadsheet.

## Learning objectives

By the end of this lesson you should be able to:

- explain the risks to computerised accounting records
- describe the main controls used to protect accounting data
- explain the audit trail and its importance
- use spreadsheet formulas to total and balance accounting records
- describe electronic payments and their accounting records

## Risks to computerised records

1. **Hardware failure** or power cuts that corrupt data.
2. **Theft** of computers or data.
3. **Viruses and malware**, including ransomware that locks files.
4. **Unauthorised access** and fraudulent entries.
5. **Input errors** by staff.
6. **Fire, flood** or other disasters.

## Controls

| Control | How it protects the records |
|---|---|
| **Passwords** | only authorised users can log in |
| **User access levels** | each user can only see or change what their job needs (a clerk can enter invoices but not approve payments) |
| **Backups** | copies of the data kept regularly, **off site** or in the cloud, so data can be restored |
| **Audit trail** | the system records **who** entered or changed **what** and **when**, so every transaction can be traced |
| **Input controls** | checks such as required fields, valid account codes, date checks and batch totals |
| **Anti-virus and updates** | protect against malware |
| **Segregation of duties** | different people record, approve and pay, so no one person controls a whole transaction |
| **Physical security** | locked offices, secure servers, power backup (UPS, generator, solar) |

## The audit trail

An **audit trail** links every figure in the reports back to the individual entries and source documents, with the user, date and time of each entry or change. It allows:

- auditors to **check** transactions,
- managers to **detect fraud** and errors,
- the business to **reconstruct** what happened.

## Accounting with a spreadsheet

A spreadsheet arranges data in **rows and columns of cells**, and **formulas** do the arithmetic.

:::callout{type=worked-example}
**Set up a simple trial balance in a spreadsheet.**

| Cell | Contains |
|---|---|
| A1, B1, C1 | headings: Account, Debit, Credit |
| A2 to A23 | account names: Cash, Bank, Purchases, Sales… |
| B2 to B23 | debit balances (Cash 2,000; Bank 9,000; Purchases 96,000…) |
| C2 to C23 | credit balances (Sales 160,000…) |
| A24 | Totals |
| B24 | **=SUM(B2:B23)** |
| C24 | **=SUM(C2:C23)** |
| A25 | Difference |
| B25 | **=B24-C24** |

- **=SUM(B2:B23)** adds all the debit balances.
- **=B24-C24** shows **0** if the trial balance agrees; any other figure is a difference to investigate.
:::

Other useful formulas include running balances in a cash book (**=D2+B3-C3**), percentages for discounts, and **IF** to flag negative balances.

## Electronic payments

Many transactions now happen electronically: **bank transfers**, **debit and credit cards**, and **mobile money** (such as Orange Money and Africell Money in Sierra Leone). Each payment creates an **electronic record** (a transaction ID, an SMS or email confirmation, a bank statement line), which is the **source document**. These records should be saved and matched to the cash book in the same way as paper receipts.

:::callout{type=common-mistake}
A backup kept **on the same computer** is not a real backup. If the computer is stolen, damaged or infected, the backup is lost too. Keep copies **off site** or in secure cloud storage.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Audit trail**: a record of who entered or changed what and when, so that every transaction can be traced.
- **Backup**: a copy of the data kept regularly, off site or in the cloud, so that data can be restored.
- **User access levels**: controls that let each user see or change only what their job needs.
- **Segregation of duties**: different people record, approve and pay, so that no one person controls a whole transaction.
- **Input controls**: checks such as required fields, valid account codes, date checks and batch totals.
:::

## Key points

- Risks: **hardware failure, theft, viruses, unauthorised access, input errors, disasters**.
- Controls: **passwords, access levels, backups, audit trail, input controls, anti-virus, segregation of duties, physical security**.
- The **audit trail** traces every entry to its user and source.
- **Spreadsheets** use formulas such as **=SUM** to total and check records.
- Electronic payment records act as **source documents**.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **describe controls over computerised accounting records**, to **explain the audit trail**, and to **state the uses of spreadsheets in accounting**. Pair each risk with the control that reduces it.
:::

## Quick check

1. Give three risks to computerised accounting records.
2. What is an audit trail?
3. Why should backups be kept off site?
4. What does the formula =SUM(B2:B10) do?
5. What acts as the source document for a mobile money payment?

**Answers:**

1. Any three: hardware failure; theft; viruses; unauthorised access; input errors; fire or flood.
2. A record that links every figure to the individual entries and source documents, showing who made each entry or change and when.
3. So that the data can be restored if the computer or office is damaged, stolen or infected.
4. It adds the values in cells B2 to B10.
5. The electronic transaction record, such as the transaction ID and SMS confirmation.
