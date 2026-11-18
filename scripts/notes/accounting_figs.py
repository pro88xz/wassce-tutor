#!/usr/bin/env python3
"""Original diagrams for the Financial Accounting notes.

    python3 scripts/notes/accounting_figs.py            # write every diagram
    python3 scripts/notes/accounting_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/accounting/<name>.svg and lessons show them from
https://wasscetutor.com/img/accounting/<name>.svg. All drawn by WASSCE Tutor.

Accounting records that are too wide for a phone table (cash books, petty
cash books, ledger accounts) are drawn here as figures with every amount
checked to balance. Amounts are in new leones (NLe).
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from government_figs import heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/accounting"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
RULE = "#94a3b8"
HEAD_FILL = "#ede9fe"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def money(n: int) -> str:
    return f"{n:,}"


def ledger_table(s: Svg, x0: float, y0: float, widths: list[float], header: list[str], rows: list[list[str]],
                 size: int = 13, row_h: float = 26, bold_rows: set[int] | None = None, rule_rows: set[int] | None = None,
                 split_after: int | None = None, align: list[str] | None = None):
    """An account-style table. `align` per column: 'l' or 'r'. `rule_rows` get a total line above them.
    `split_after` draws the heavy centre line of a two-sided account after that column index."""
    bold_rows = bold_rows or set()
    rule_rows = rule_rows or set()
    align = align or ["l"] * len(widths)
    xs = [x0]
    for w in widths:
        xs.append(xs[-1] + w)
    total_w = xs[-1] - x0
    s.rect(x0, y0, total_w, row_h + 4, fill=HEAD_FILL, stroke="none", width=0)
    for i, h in enumerate(header):
        cx = xs[i] + (6 if align[i] == "l" else widths[i] - 6)
        s.text(cx, y0 + (row_h + 4) / 2, h, size=size, weight="bold", color=PURPLE, anchor="start" if align[i] == "l" else "end")
    s.line(x0, y0 + row_h + 4, xs[-1], y0 + row_h + 4, color=INK, width=1.6)
    y = y0 + row_h + 4
    for r, row in enumerate(rows):
        if r in rule_rows:
            for i, cell in enumerate(row):
                if align[i] == "r" and cell:
                    s.line(xs[i] + 8, y + 2, xs[i + 1] - 4, y + 2, color=INK, width=1.2)
        for i, cell in enumerate(row):
            if not cell:
                continue
            cx = xs[i] + (6 if align[i] == "l" else widths[i] - 6)
            s.text(cx, y + row_h / 2 + 2, cell, size=size, weight="bold" if r in bold_rows else "normal",
                   color=INK, anchor="start" if align[i] == "l" else "end")
        y += row_h
        if r in rule_rows:
            for i, cell in enumerate(row):
                if align[i] == "r" and cell:
                    s.line(xs[i] + 8, y - 2, xs[i + 1] - 4, y - 2, color=INK, width=1.2)
                    s.line(xs[i] + 8, y + 1, xs[i + 1] - 4, y + 1, color=INK, width=1.2)
    if split_after is not None:
        sx = xs[split_after + 1]
        s.line(sx, y0, sx, y, color=INK, width=2.4)
    s.rect(x0, y0, total_w, y - y0, fill="none", stroke=RULE, width=1.2)
    return y


# ═══ FA1: foundations and books of account ═══════════════════════════════════

@fig
def accounting_cycle():
    s = Svg(800, 470, "The accounting cycle",
            "The accounting cycle: business transactions are evidenced by source documents, recorded first in the books of "
            "original entry, posted to ledger accounts by double entry, listed in a trial balance, adjusted for items such "
            "as accruals, prepayments and depreciation, and summarised in the final accounts: the income statement and the "
            "statement of financial position. The cycle then starts again for the next period.")
    heading(s, "From transaction to final accounts")
    steps = [("1. Transaction", "evidenced by a", "source document", BLUE, F_BLUE),
             ("2. Books of", "original entry", "day books, cash book, journal", TEAL, F_TEAL),
             ("3. Ledger", "double entry:", "a debit and a credit", PURPLE, F_PURPLE),
             ("4. Trial balance", "checks that total", "debits = total credits", ORANGE, F_AMBER),
             ("5. Adjustments", "accruals, prepayments,", "depreciation, bad debts", RED, F_RED),
             ("6. Final accounts", "income statement and", "financial position", GREEN, F_GREEN)]
    pos = [(140, 140), (400, 140), (660, 140), (660, 330), (400, 330), (140, 330)]
    boxes = [box(s, x, y, 220, 96, [a, b, c], col=col, fill=fill, size=16) for (x, y), (a, b, c, col, fill) in zip(pos, steps)]
    for i in range(5):
        link(s, boxes[i], boxes[i + 1], color=MUTED, width=2.6)
    s.path("M 140 378 Q 60 430 40 300 Q 30 180 60 140", color=MUTED, width=2, dash="6 5", arrow="end")
    s.text(70, 440, "next period", size=13, color=MUTED, anchor="start")
    note(s, "Steps 1–3 record; steps 4–6 check and summarise.", 455, size=14, color=INK)
    return s


@fig
def users_of_accounts():
    s = Svg(800, 470, "Users of accounting information and what they want to know",
            "Accounting information is used by owners (profit and the value of their investment), managers (planning and "
            "control), lenders and banks (ability to repay), suppliers (ability to pay for goods on credit), employees "
            "(job security and wages), customers (whether the business will keep supplying them), government and the "
            "National Revenue Authority (tax), and investors and the public.")
    heading(s, "Who uses accounts, and why")
    c = box(s, 400, 240, 220, 76, ["FINANCIAL", "STATEMENTS"], col=PURPLE, fill=F_PURPLE, size=18)
    users = [(130, 95, "Owners", "profit, value of capital"), (400, 80, "Managers", "planning and control"),
             (670, 95, "Lenders and banks", "can loans be repaid?"), (115, 240, "Suppliers", "can it pay on credit?"),
             (685, 240, "Government (NRA)", "tax due"), (130, 385, "Employees", "job security, wages"),
             (400, 400, "Investors", "return and risk"), (670, 385, "Customers", "will supply continue?")]
    for x, y, a, b in users:
        bb = box(s, x, y, 220, 62, [a, b], col=BLUE, fill=F_BLUE, size=15)
        link(s, c, bb, color=MUTED, width=1.8)
    return s


@fig
def accounting_equation():
    s = Svg(800, 460, "The accounting equation as a balance",
            "A balance with assets of NLe 50,000 on the left pan and capital of NLe 35,000 plus liabilities of NLe 15,000 on "
            "the right pan. The two sides are always equal: assets equal capital plus liabilities. Every transaction changes "
            "at least two items but keeps the balance level.")
    heading(s, "Assets = Capital + Liabilities")
    s.polygon([(400, 250), (370, 390), (430, 390)], fill="#cbd5e1", stroke=INK, width=2)
    s.rect(330, 390, 140, 14, fill="#94a3b8", stroke=INK, width=1.5)
    s.line(140, 250, 665, 250, color=INK, width=6)
    s.circle(400, 250, 9, fill=INK, stroke=INK, width=1)
    for x in (190, 615):
        s.line(x, 250, x - 70, 300, color=MUTED, width=1.5)
        s.line(x, 250, x + 70, 300, color=MUTED, width=1.5)
        s.path(f"M {x - 95} 300 Q {x} 330 {x + 95} 300 Z", color=INK, width=2, fill="#e2e8f0")
    box(s, 190, 205, 220, 80, ["ASSETS", "what the business owns", "NLe 50,000"], col=BLUE, fill=F_BLUE, size=17)
    box(s, 535, 205, 140, 80, ["CAPITAL", "owner's stake", "NLe 35,000"], col=GREEN, fill=F_GREEN, size=16)
    box(s, 700, 205, 150, 80, ["LIABILITIES", "owed to others", "NLe 15,000"], col=RED, fill=F_RED, size=16)
    s.text(616, 205, "+", size=26, weight="bold", color=INK)
    note(s, "50,000 = 35,000 + 15,000     so also: Capital = Assets − Liabilities", 440, size=15, color=INK)
    return s


@fig
def debit_credit_rules():
    s = Svg(800, 500, "The rules of debit and credit",
            "A large T-account. The debit (left) side records increases in assets, expenses and drawings, and decreases in "
            "liabilities, capital and income. The credit (right) side records increases in liabilities, capital and income, "
            "and decreases in assets. Every transaction has a debit entry and a credit entry of equal amount. The memory aid "
            "DEAD CLIC stands for Debit: Expenses, Assets, Drawings; Credit: Liabilities, Income, Capital.")
    heading(s, "One debit, one credit, equal amounts")
    s.line(80, 110, 720, 110, color=INK, width=3)
    s.line(400, 110, 400, 400, color=INK, width=3)
    s.text(240, 88, "DEBIT (Dr) — left side", size=18, weight="bold", color=BLUE)
    s.text(560, 88, "CREDIT (Cr) — right side", size=18, weight="bold", color=ORANGE)
    left = [("Increase in:", True), ("assets", False), ("expenses and losses", False), ("drawings", False), ("", False),
            ("Decrease in:", True), ("liabilities", False), ("capital", False), ("income", False)]
    right = [("Increase in:", True), ("liabilities", False), ("capital", False), ("income and gains", False), ("", False),
             ("Decrease in:", True), ("assets", False)]
    for k, (t, b) in enumerate(left):
        s.text(110, 140 + k * 28, t, size=16, weight="bold" if b else "normal", color=BLUE if b else INK, anchor="start")
    for k, (t, b) in enumerate(right):
        s.text(430, 140 + k * 28, t, size=16, weight="bold" if b else "normal", color=ORANGE if b else INK, anchor="start")
    s.rect(110, 420, 580, 58, fill="#ffffff", stroke=RULE, width=1.2, rx=10)
    s.text(400, 440, "Memory aid: DEAD CLIC", size=16, weight="bold", color=PURPLE)
    s.text(400, 463, "Debit: Expenses, Assets, Drawings   •   Credit: Liabilities, Income, Capital", size=14, color=INK)
    return s


@fig
def books_of_original_entry():
    s = Svg(800, 520, "Source documents and the books of original entry they are recorded in",
            "Each source document is first recorded in a book of original entry: purchase invoices received go to the "
            "purchases day book; sales invoices sent go to the sales day book; credit notes received go to the returns "
            "outwards book; credit notes sent go to the returns inwards book; receipts, cheque counterfoils and bank "
            "paying-in slips go to the cash book; petty cash vouchers go to the petty cash book; and other items such as "
            "credit purchases of assets and corrections go to the general journal.")
    heading(s, "Source document → book of original entry")
    rows = [("Purchase invoice (received)", "Purchases day book"), ("Sales invoice (sent)", "Sales day book"),
            ("Credit note received", "Returns outwards book"), ("Credit note sent", "Returns inwards book"),
            ("Receipts, cheques, paying-in slips", "Cash book"), ("Petty cash voucher", "Petty cash book"),
            ("Memo: asset bought on credit, errors", "General journal")]
    s.text(190, 70, "SOURCE DOCUMENTS", size=15, weight="bold", color=BLUE)
    s.text(610, 70, "BOOKS OF ORIGINAL ENTRY", size=15, weight="bold", color=TEAL)
    for k, (a, b) in enumerate(rows):
        y = 112 + k * 56
        l = box(s, 190, y, 300, 44, [a], col=BLUE, fill=F_BLUE, size=15)
        r = box(s, 610, y, 260, 44, [b], col=TEAL, fill=F_TEAL, size=15)
        link(s, l, r, color=MUTED, width=2)
    note(s, "Totals from the books are then posted to the ledger by double entry.", 505, size=14, color=INK)
    return s


@fig
def three_column_cash_book():
    s = Svg(800, 470, "A three-column cash book with discounts and contra entries",
            "Worked example of a three-column cash book for February 2026 in new leones. Debit side: balances brought down "
            "(cash 2,000, bank 15,000), a cheque of 4,750 from Kamara with 250 discount allowed, cash sales of 6,000, a "
            "contra of 4,000 cash paid into the bank, and a contra of 2,000 withdrawn from the bank for office use. Credit "
            "side: a cheque of 9,700 to Sesay with 300 discount received, cash wages 1,500, cash paid into bank 4,000, "
            "cash withdrawn from bank 2,000, rent by cheque 3,500, and balances carried down of cash 4,500 and bank 8,550. "
            "Both sides total discount, cash 10,000 and bank 23,750.")
    heading(s, "Three-column cash book, February 2026 (NLe)")
    w = [36, 96, 54, 68, 72]
    hdr = ["Feb", "Details", "Disc", "Cash", "Bank"]
    al = ["l", "l", "r", "r", "r"]
    dr = [["1", "Balance b/d", "", "2,000", "15,000"], ["3", "Kamara", "250", "", "4,750"], ["8", "Sales", "", "6,000", ""],
          ["15", "Cash  c", "", "", "4,000"], ["20", "Bank  c", "", "2,000", ""], ["", "", "", "", ""], ["", "", "", "", ""],
          ["", "", "250", "10,000", "23,750"], ["Mar 1", "Balance b/d", "", "4,500", "8,550"]]
    cr = [["5", "Sesay", "300", "", "9,700"], ["12", "Wages", "", "1,500", ""], ["15", "Bank  c", "", "4,000", ""],
          ["20", "Cash  c", "", "", "2,000"], ["26", "Rent", "", "", "3,500"], ["28", "Balance c/d", "", "4,500", "8,550"],
          ["", "", "", "", ""], ["", "", "300", "10,000", "23,750"], ["", "", "", "", ""]]
    s.text(42, 66, "Dr", size=16, weight="bold", color=BLUE, anchor="start")
    s.text(758, 66, "Cr", size=16, weight="bold", color=ORANGE, anchor="end")
    rows = [a + b for a, b in zip(dr, cr)]
    ledger_table(s, 34, 78, w + w, hdr + hdr, rows, size=13, row_h=30, bold_rows={7, 8}, rule_rows={7},
                 split_after=4, align=al + al)
    note(s, "c = contra entry: both sides of the transaction are in the cash book.", 438, size=13, color=MUTED)
    note(s, "Discount columns are totalled, not balanced, and posted to the ledger.", 458, size=13, color=MUTED)
    return s


@fig
def petty_cash_book():
    s = Svg(800, 470, "An analytical petty cash book under the imprest system",
            "Worked example of a petty cash book for March 2026 with an imprest of NLe 5,000. Payments: postage 300, bus "
            "fares 450, cleaning 600, envelopes and pens 700, payment to J. Conteh 1,200, taxi fare 550 and cleaning "
            "materials 500, totalling 4,300. Analysis column totals: postage 300, travelling 1,000, cleaning 1,100, "
            "stationery 700, ledger 1,200. The balance carried down is 700, and the main cashier reimburses 4,300 to "
            "restore the imprest of 5,000.")
    heading(s, "Analytical petty cash book, March 2026 (imprest NLe 5,000)")
    w = [62, 40, 150, 34, 62, 62, 66, 64, 70, 64]
    hdr = ["Rec'd", "Mar", "Details", "V", "Total", "Post", "Travel", "Clean", "Station.", "Ledger"]
    al = ["r", "l", "l", "l", "r", "r", "r", "r", "r", "r"]
    rows = [["5,000", "1", "Cash from cashier", "", "", "", "", "", "", ""],
            ["", "2", "Postage stamps", "1", "300", "300", "", "", "", ""],
            ["", "4", "Bus fares", "2", "450", "", "450", "", "", ""],
            ["", "7", "Office cleaning", "3", "600", "", "", "600", "", ""],
            ["", "10", "Envelopes, pens", "4", "700", "", "", "", "700", ""],
            ["", "15", "J. Conteh", "5", "1,200", "", "", "", "", "1,200"],
            ["", "22", "Taxi fare", "6", "550", "", "550", "", "", ""],
            ["", "28", "Cleaning materials", "7", "500", "", "", "500", "", ""],
            ["", "", "", "", "4,300", "300", "1,000", "1,100", "700", "1,200"],
            ["", "31", "Balance c/d", "", "700", "", "", "", "", ""],
            ["5,000", "", "", "", "5,000", "", "", "", "", ""],
            ["700", "Apr 1", "Balance b/d", "", "", "", "", "", "", ""],
            ["4,300", "1", "Cash (reimbursed)", "", "", "", "", "", "", ""]]
    ledger_table(s, 10, 52, w, hdr, rows, size=12, row_h=26, bold_rows={8, 10}, rule_rows={8, 10}, align=al)
    return s


@fig
def imprest_system():
    s = Svg(800, 360, "How the imprest system works",
            "The imprest system: at the start of the period the main cashier gives the petty cashier a fixed float, the "
            "imprest, for example NLe 5,000. The petty cashier pays small expenses against signed vouchers. At the end of "
            "the period the petty cashier shows the vouchers and is reimbursed exactly the amount spent, so the float is "
            "restored to the imprest.")
    heading(s, "Imprest system: spend, show vouchers, get exactly the amount spent back")
    a = box(s, 150, 170, 230, 110, ["1. Float given", "imprest", "NLe 5,000"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 400, 170, 230, 110, ["2. Petty expenses", "paid on vouchers", "spent NLe 4,300"], col=ORANGE, fill=F_AMBER, size=17)
    c = box(s, 650, 170, 230, 110, ["3. Reimbursed", "the amount spent", "NLe 4,300"], col=GREEN, fill=F_GREEN, size=17)
    link(s, a, b, color=MUTED, width=2.6)
    link(s, b, c, color=MUTED, width=2.6)
    s.path("M 650 230 Q 650 300 400 300 Q 150 300 150 230", color=MUTED, width=2.2, dash="6 5", arrow="end")
    s.label(400, 300, "cash in hand back to NLe 700 + 4,300 = NLe 5,000", size=14, color=INK, weight="bold", pad=4)
    note(s, "Advantages: control of small spending, cashier's time saved, theft or errors noticed quickly.", 345, size=14, color=MUTED)
    return s


@fig
def ledger_divisions():
    s = Svg(800, 420, "Divisions of the ledger",
            "The ledger is divided into the sales ledger, holding the personal accounts of credit customers (trade "
            "receivables); the purchases ledger, holding the personal accounts of credit suppliers (trade payables); the "
            "general or nominal ledger, holding accounts for income, expenses, assets and liabilities; and the private "
            "ledger, holding confidential accounts such as capital and drawings.")
    heading(s, "The ledger and its divisions")
    top = box(s, 400, 95, 260, 60, ["THE LEDGER", "all the accounts of the business"], col=PURPLE, fill=F_PURPLE, size=17)
    kids = [(110, "Sales ledger", ["debtors (trade", "receivables)", "e.g. Kamara a/c"], BLUE, F_BLUE),
            (303, "Purchases ledger", ["creditors (trade", "payables)", "e.g. Sesay a/c"], ORANGE, F_AMBER),
            (497, "General ledger", ["nominal and real:", "sales, wages,", "rent, motor van"], TEAL, F_TEAL),
            (690, "Private ledger", ["confidential:", "capital, drawings,", "loans from owner"], GREEN, F_GREEN)]
    for x, t, lines, col, fill in kids:
        k = box(s, x, 280, 180, 150, [t] + lines, col=col, fill=fill, size=16)
        link(s, top, k, color=MUTED, width=2)
    note(s, "Personal accounts (people) • Real accounts (things owned) • Nominal accounts (income and expenses)", 395, size=13, color=MUTED)
    return s


@fig
def balancing_account():
    s = Svg(800, 400, "Balancing off a ledger account",
            "Worked example of balancing a cash account. Debit side: capital 20,000 and sales 8,000, total 28,000. Credit "
            "side: purchases 6,500, rent 2,000, wages 1,500 and balance carried down 18,000, total 28,000. The balance of "
            "18,000 is brought down on the debit side on 1 May, showing cash in hand.")
    heading(s, "Cash account, April 2026 (NLe): balancing off")
    w = [52, 150, 82, 52, 150, 82]
    hdr = ["Apr", "Details", "NLe", "Apr", "Details", "NLe"]
    al = ["l", "l", "r", "l", "l", "r"]
    rows = [["1", "Capital", "20,000", "3", "Purchases", "6,500"],
            ["9", "Sales", "8,000", "12", "Rent", "2,000"],
            ["", "", "", "28", "Wages", "1,500"],
            ["", "", "", "30", "Balance c/d", "18,000"],
            ["", "", "28,000", "", "", "28,000"],
            ["May 1", "Balance b/d", "18,000", "", "", ""]]
    s.text(52, 70, "Dr", size=16, weight="bold", color=BLUE, anchor="start")
    s.text(748, 70, "Cr", size=16, weight="bold", color=ORANGE, anchor="end")
    ledger_table(s, 52, 82, w, hdr, rows, size=15, row_h=34, bold_rows={4, 5}, rule_rows={4}, split_after=2, align=al)
    note(s, "1. Add the larger side   2. Enter the difference as balance c/d   3. Total both sides   4. Bring the balance down", 372, size=13, color=INK)
    return s



# ═══ FA2: trial balance to final accounts ════════════════════════════════════

@fig
def trial_balance_sides():
    s = Svg(800, 470, "Which balances go on each side of the trial balance",
            "Debit balances in a trial balance: assets (premises, vehicles, equipment, trade receivables, cash, bank), "
            "expenses (wages, rent, carriage), purchases, returns inwards, discount allowed, opening inventory and drawings. "
            "Credit balances: capital, liabilities (loans, trade payables, bank overdraft), sales, returns outwards, "
            "discount received, other income such as rent or commission received, and provisions for depreciation and "
            "doubtful debts. The two columns must have equal totals.")
    heading(s, "Trial balance: debit balances and credit balances")
    left = box(s, 205, 245, 350, 320, ["DEBIT (Dr) balances", "", "assets: premises, vehicles,", "equipment, receivables, cash, bank",
                                       "expenses: wages, rent, carriage", "purchases", "returns inwards (sales returns)",
                                       "discount allowed", "opening inventory (stock)", "drawings"], col=BLUE, fill=F_BLUE, size=17)
    right = box(s, 595, 245, 350, 320, ["CREDIT (Cr) balances", "", "capital", "liabilities: loans, trade", "payables, bank overdraft",
                                        "sales", "returns outwards (purchases ret.)", "discount received",
                                        "other income: rent, commission", "provisions: depreciation, doubtful debts"],
                col=ORANGE, fill=F_AMBER, size=17)
    note(s, "Total of debit column  =  total of credit column", 448, size=16, color=INK)
    return s


@fig
def errors_classification():
    s = Svg(800, 500, "Classification of accounting errors",
            "Errors that do not affect the agreement of the trial balance: omission, commission, principle, original entry, "
            "complete reversal and compensating errors. Errors that do affect the agreement of the trial balance: an entry "
            "on one side only, unequal amounts on the two sides, two debits or two credits, casting (addition) errors in "
            "one account, and wrong extraction of a balance. Errors that affect the agreement cause a difference that is "
            "placed in a suspense account until found.")
    heading(s, "Two families of errors")
    top = box(s, 400, 85, 220, 54, ["ERRORS"], col=PURPLE, fill=F_PURPLE, size=19)
    a = box(s, 205, 290, 360, 300, ["Do NOT affect the", "trial balance totals", "", "omission (not recorded at all)",
                                    "commission (wrong person's a/c)", "principle (wrong class of a/c)",
                                    "original entry (wrong amount both sides)", "complete reversal (Dr and Cr swapped)",
                                    "compensating (two errors cancel out)"], col=GREEN, fill=F_GREEN, size=17)
    b = box(s, 595, 290, 360, 300, ["DO affect the", "trial balance totals", "", "single entry (one side only)",
                                    "unequal amounts on the two sides", "two debits or two credits",
                                    "casting error in one account", "balance extracted wrongly",
                                    "→ difference to SUSPENSE a/c"], col=RED, fill=F_RED, size=17)
    link(s, top, a, color=MUTED, width=2.2)
    link(s, top, b, color=MUTED, width=2.2)
    return s


@fig
def bank_reconciliation_reasons():
    s = Svg(800, 520, "Why the cash book and the bank statement disagree",
            "Items in the cash book but not yet on the bank statement (timing differences): unpresented cheques, which are "
            "cheques paid out but not yet cleared, and uncredited lodgements, which are amounts paid in but not yet credited "
            "by the bank. These go in the bank reconciliation statement. Items on the bank statement but not yet in the "
            "cash book: bank charges, standing orders and direct debits, direct credits and credit transfers, interest, and "
            "dishonoured cheques. These are entered in the cash book to update it. Errors in either record are corrected.")
    heading(s, "Cash book vs bank statement: two kinds of difference")
    a = box(s, 205, 245, 360, 290, ["In the CASH BOOK but not", "yet on the BANK STATEMENT", "",
                                    "unpresented cheques", "(paid out, not yet cleared)", "",
                                    "uncredited lodgements", "(paid in, not yet credited)", "",
                                    "→ show in the BANK", "RECONCILIATION STATEMENT"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 595, 245, 360, 290, ["On the BANK STATEMENT but", "not yet in the CASH BOOK", "",
                                    "bank charges, interest charged", "standing orders, direct debits",
                                    "direct credits, transfers in", "interest received",
                                    "dishonoured cheques", "",
                                    "→ enter in the CASH BOOK", "(adjusted cash book)"], col=ORANGE, fill=F_AMBER, size=17)
    note(s, "Step 1: update the cash book.   Step 2: reconcile its new balance with the bank statement.", 420 + 85, size=15, color=INK)
    return s


@fig
def income_statement_flow():
    s = Svg(800, 500, "How the income statement is built up",
            "The income statement has two parts. In the trading section, net sales (sales less returns inwards) minus the "
            "cost of sales gives gross profit; cost of sales is opening inventory plus net purchases plus carriage inwards "
            "minus closing inventory. In the profit and loss section, gross profit plus other income (such as discount "
            "received, rent or commission received) minus expenses (such as wages, rent, carriage outwards, depreciation "
            "and discount allowed) gives net profit, which is added to the owner's capital.")
    heading(s, "Income statement: trading section, then profit and loss section")
    rows = [(110, "Net sales", "sales − returns inwards", BLUE, F_BLUE),
            (190, "− Cost of sales", "opening inventory + net purchases + carriage in − closing inventory", ORANGE, F_AMBER),
            (270, "= GROSS PROFIT", "trading section ends here", GREEN, F_GREEN),
            (350, "+ Other income − Expenses", "discount received, rent received; wages, rent, depreciation, carriage out", PURPLE, F_PURPLE),
            (430, "= NET PROFIT", "added to capital in the statement of financial position", GREEN, F_GREEN)]
    prev = None
    for y, a, b, col, fill in rows:
        bb = box(s, 400, y, 680, 60, [a, b], col=col, fill=fill, size=17)
        if prev:
            link(s, prev, bb, color=MUTED, width=2)
        prev = bb
    return s


@fig
def depreciation_methods():
    s = Svg(800, 470, "Straight-line and reducing-balance depreciation compared",
            "Graph of the carrying amount of a machine costing NLe 100,000 over five years. Under the straight-line method "
            "at 20% of cost a year, the carrying amount falls by the same NLe 20,000 each year: 100,000, 80,000, 60,000, "
            "40,000, 20,000 and 0. Under the reducing-balance method at 30% a year, the charge is largest in the first year "
            "and gets smaller: 100,000, 70,000, 49,000, 34,300, 24,010 and 16,807.")
    heading(s, "Carrying amount of a NLe 100,000 machine")
    ox, oy, w, h = 110, 400, 600, 300
    s.line(ox, oy, ox + w + 10, oy, color=INK, width=2)
    s.line(ox, oy, ox, oy - h - 10, color=INK, width=2)
    for k in range(0, 6):
        x = ox + k * w / 5
        s.text(x, oy + 20, f"Year {k}" if k else "Start", size=13, color=MUTED)
        s.line(x, oy, x, oy - h, color="#e2e8f0", width=1)
    for v in range(0, 101, 20):
        y = oy - v * h / 100
        s.text(ox - 10, y, f"{v},000" if v else "0", size=12, color=MUTED, anchor="end")
        s.line(ox, y, ox + w, y, color="#e2e8f0", width=1)
    sl = [100, 80, 60, 40, 20, 0]
    rb = [100, 70, 49, 34.3, 24.01, 16.807]
    for data, col, lab, ly in ((sl, BLUE, "straight line, 20% of cost", 0), (rb, ORANGE, "reducing balance, 30%", 1)):
        pts = [(ox + k * w / 5, oy - v * h / 100) for k, v in enumerate(data)]
        s.polyline(pts, color=col, width=3.5)
        for x, y in pts:
            s.dot(x, y, r=5, color=col)
    s.rect(470, 90, 250, 64, fill="#ffffff", stroke=RULE, width=1.2, rx=8)
    s.line(484, 110, 514, 110, color=BLUE, width=3.5)
    s.text(522, 110, "straight line, 20% of cost", size=13, anchor="start")
    s.line(484, 136, 514, 136, color=ORANGE, width=3.5)
    s.text(522, 136, "reducing balance, 30%", size=13, anchor="start")
    note(s, "Straight line: equal charge each year.  Reducing balance: highest charge in year 1, never reaches zero.", 450, size=13, color=INK)
    return s


@fig
def accruals_prepayments():
    s = Svg(800, 430, "Accruals and prepayments on a timeline",
            "A financial year from 1 January to 31 December 2026. Rent of NLe 1,000 a month: payments of NLe 11,000 cover "
            "January to November, so December's NLe 1,000 is owing at the year end, an accrual; the charge for the year is "
            "NLe 12,000. Insurance of NLe 6,000 paid on 1 October covers twelve months to 30 September 2027, so nine months, "
            "NLe 4,500, is paid in advance, a prepayment; the charge for 2026 is NLe 1,500.")
    heading(s, "Charge the expense for the year, not the cash paid")
    x0, x1 = 80, 720
    def X(m):
        return x0 + (x1 - x0) * m / 12
    for y, title in ((150, "Rent: NLe 1,000 a month"), (310, "Insurance: NLe 6,000 paid 1 Oct for 12 months")):
        s.text(x0, y - 60, title, size=16, weight="bold", color=INK, anchor="start")
        s.line(x0, y, x1 + 60, y, color=INK, width=2)
        for m in range(13):
            s.line(X(m), y - 6, X(m), y + 6, color=MUTED, width=1.2)
        s.text(X(0), y + 22, "1 Jan", size=12, color=MUTED)
        s.text(X(12), y + 22, "31 Dec", size=12, color=MUTED)
        s.line(X(12), y - 40, X(12), y + 40, color=RED, width=2, dash="6 4")
    s.rect(X(0), 122, X(11) - X(0), 22, fill=F_GREEN, stroke=GREEN, width=1.5)
    s.text((X(0) + X(11)) / 2, 133, "paid Jan–Nov: 11,000", size=13, weight="bold", color=GREEN)
    s.rect(X(11), 122, X(12) - X(11), 22, fill=F_RED, stroke=RED, width=1.5)
    s.label(X(11.5), 182, "Dec owing: ACCRUAL 1,000", size=13, color=RED, weight="bold", pad=3)
    s.rect(X(9), 282, X(12) - X(9), 22, fill=F_GREEN, stroke=GREEN, width=1.5)
    s.text((X(9) + X(12)) / 2, 293, "Oct–Dec: 1,500", size=12, weight="bold", color=GREEN)
    s.rect(X(12), 282, 60, 22, fill=F_BLUE, stroke=BLUE, width=1.5)
    s.label(X(10.2), 342, "Jan–Sep 2027 paid early: PREPAYMENT 4,500", size=13, color=BLUE, weight="bold", pad=3)
    note(s, "Rent charge 2026 = 11,000 + 1,000 = 12,000      Insurance charge 2026 = 6,000 − 4,500 = 1,500", 405, size=14, color=INK)
    return s


@fig
def manufacturing_cost_flow():
    s = Svg(800, 500, "Cost structure in a manufacturing account",
            "Prime cost is direct materials consumed (opening raw materials plus purchases plus carriage inwards minus "
            "closing raw materials) plus direct labour plus direct expenses. Adding factory overheads such as indirect "
            "wages, factory rent, power and depreciation of machinery, and adjusting for opening and closing work in "
            "progress, gives the production cost of goods completed, which is transferred to the trading account in place "
            "of purchases.")
    heading(s, "Manufacturing account: from raw materials to production cost")
    rows = [(100, "Direct materials consumed", "opening raw materials + purchases + carriage in − closing raw materials", BLUE, F_BLUE),
            (180, "+ Direct labour + Direct expenses", "wages of machine operators; royalties", BLUE, F_BLUE),
            (260, "= PRIME COST", "", ORANGE, F_AMBER),
            (340, "+ Factory overheads ± Work in progress", "indirect wages, factory rent, power, machine depreciation", PURPLE, F_PURPLE),
            (420, "= PRODUCTION COST of goods completed", "→ transferred to the trading account", GREEN, F_GREEN)]
    prev = None
    for y, a, b, col, fill in rows:
        bb = box(s, 400, y, 680, 58 if b else 46, [a, b] if b else [a], col=col, fill=fill, size=17)
        if prev:
            link(s, prev, bb, color=MUTED, width=2)
        prev = bb
    note(s, "Add opening WIP and deduct closing WIP to find the cost of goods completed.", 482, size=14, color=MUTED)
    return s


@fig
def rent_insurance_accounts():
    s = Svg(800, 470, "Rent and insurance accounts with an accrual and a prepayment",
            "Rent account for 2026: debit bank 11,000 and accrued c/d 1,000, total 12,000; credit income statement 12,000; "
            "accrued b/d 1,000 on the credit side on 1 January 2027, a liability. Insurance account: debit bank 6,000; "
            "credit income statement 1,500 and prepaid c/d 4,500, total 6,000; prepaid b/d 4,500 on the debit side, an "
            "asset.")
    heading(s, "Year-end adjustments in the ledger (NLe)")
    w = [92, 196, 102, 92, 196, 102]
    hdr = ["2026", "Details", "NLe", "2026", "Details", "NLe"]
    al = ["l", "l", "r", "l", "l", "r"]
    s.text(400, 66, "Rent account", size=16, weight="bold", color=INK)
    rows = [["", "Bank", "11,000", "Dec 31", "Income statement", "12,000"],
            ["Dec 31", "Accrued c/d", "1,000", "", "", ""],
            ["", "", "12,000", "", "", "12,000"],
            ["", "", "", "2027 Jan 1", "Accrued b/d", "1,000"]]
    ledger_table(s, 10, 78, w, hdr, rows, size=15, row_h=28, bold_rows={2}, rule_rows={2}, split_after=2, align=al)
    s.text(400, 270, "Insurance account", size=16, weight="bold", color=INK)
    rows2 = [["Oct 1", "Bank", "6,000", "Dec 31", "Income statement", "1,500"],
             ["", "", "", "Dec 31", "Prepaid c/d", "4,500"],
             ["", "", "6,000", "", "", "6,000"],
             ["2027 Jan 1", "Prepaid b/d", "4,500", "", "", ""]]
    ledger_table(s, 10, 282, w, hdr, rows2, size=15, row_h=28, bold_rows={2}, rule_rows={2}, split_after=2, align=al)
    note(s, "Accrued b/d on the credit side = liability.   Prepaid b/d on the debit side = asset.", 455, size=14, color=INK)
    return s


# ═══ FA3: specialised accounts ═══════════════════════════════════════════════

@fig
def sales_ledger_control():
    s = Svg(800, 420, "A sales ledger control account",
            "Worked sales ledger control account for January 2026 in new leones. Debit side: balance brought down 45,000; "
            "credit sales 120,000; dishonoured cheques 1,500; interest charged 300; total 166,800. Credit side: cash and "
            "cheques received 98,000; discount allowed 2,400; returns inwards 3,600; bad debts 1,800; set-off against the "
            "purchases ledger 2,000; balance carried down 59,000; total 166,800. The closing balance should equal the total "
            "of the individual customer balances in the sales ledger.")
    heading(s, "Sales ledger control account, January 2026 (NLe)")
    w = [66, 210, 104, 66, 230, 104]
    hdr = ["Jan", "Details", "NLe", "Jan", "Details", "NLe"]
    al = ["l", "l", "r", "l", "l", "r"]
    rows = [["1", "Balance b/d", "45,000", "31", "Cash and cheques", "98,000"],
            ["31", "Credit sales", "120,000", "31", "Discount allowed", "2,400"],
            ["31", "Dishonoured cheques", "1,500", "31", "Returns inwards", "3,600"],
            ["31", "Interest charged", "300", "31", "Bad debts", "1,800"],
            ["", "", "", "31", "Set-off (purchases ledger)", "2,000"],
            ["", "", "", "31", "Balance c/d", "59,000"],
            ["", "", "166,800", "", "", "166,800"],
            ["Feb 1", "Balance b/d", "59,000", "", "", ""]]
    s.text(14, 70, "Dr", size=16, weight="bold", color=BLUE, anchor="start")
    s.text(786, 70, "Cr", size=16, weight="bold", color=ORANGE, anchor="end")
    ledger_table(s, 10, 82, w, hdr, rows, size=15, row_h=32, bold_rows={6, 7}, rule_rows={6}, split_after=2, align=al)
    note(s, "Source of each figure: day books, cash book and journal totals, never individual customer accounts.", 405, size=13, color=MUTED)
    return s


@fig
def control_account_sources():
    s = Svg(800, 470, "Where the figures in a sales ledger control account come from",
            "The sales ledger control account is written up from totals in the books of original entry: credit sales from "
            "the sales day book; returns inwards from the returns inwards book; cash and cheques received and discount "
            "allowed from the cash book; bad debts, set-offs and interest from the general journal. Its balance is compared "
            "with the total of the list of customers' balances in the sales ledger.")
    heading(s, "Totals from the books → control account → check against the ledger")
    books = [(110, "Sales day book", "credit sales (Dr)"), (195, "Returns inwards book", "returns inwards (Cr)"),
             (280, "Cash book", "receipts, discount allowed (Cr)"), (365, "General journal", "bad debts, set-offs (Cr)")]
    c = box(s, 540, 238, 210, 120, ["SALES LEDGER", "CONTROL", "ACCOUNT"], col=PURPLE, fill=F_PURPLE, size=18)
    for y, a, b in books:
        bb = box(s, 160, y, 270, 64, [a, b], col=BLUE, fill=F_BLUE, size=16)
        link(s, bb, c, color=MUTED, width=2)
    l = box(s, 540, 410, 280, 64, ["Sales ledger", "total of customers' balances"], col=GREEN, fill=F_GREEN, size=16)
    s.line(540, 298, 540, 378, color=GREEN, width=2.5, dash="6 4")
    s.label(650, 340, "should agree", size=14, color=GREEN, weight="bold", pad=3)
    return s


@fig
def departmental_apportionment():
    s = Svg(800, 400, "Apportioning a shared expense between departments",
            "Rent of NLe 36,000 shared between three departments in proportion to floor area: Department A has 300 square "
            "metres, B 200 and C 100, a total of 600. A is charged half, NLe 18,000; B a third, NLe 12,000; C a sixth, NLe "
            "6,000.")
    heading(s, "Rent NLe 36,000 shared by floor area (300 : 200 : 100 m²)")
    x0, y0, w, h = 80, 120, 640, 90
    parts = [("Dept A", 300, 18000, BLUE, F_BLUE), ("Dept B", 200, 12000, GREEN, F_GREEN), ("Dept C", 100, 6000, ORANGE, F_AMBER)]
    x = x0
    for name, area, amt, col, fill in parts:
        ww = w * area / 600
        s.rect(x, y0, ww, h, fill=fill, stroke=col, width=2.5)
        s.text(x + ww / 2, y0 + 30, name, size=17, weight="bold", color=col)
        s.text(x + ww / 2, y0 + 58, f"{area} m²", size=15, color=INK)
        s.text(x + ww / 2, y0 + 130, f"{area}/600 × 36,000", size=14, color=MUTED)
        s.text(x + ww / 2, y0 + 158, f"NLe {amt:,}", size=17, weight="bold", color=col)
        x += ww
    note(s, "Common bases: floor area (rent, rates), sales (advertising), staff numbers (canteen), value (insurance).", 370, size=14, color=INK)
    return s


@fig
def branch_flows():
    s = Svg(800, 380, "Transactions between head office and a dependent branch",
            "Head office sends goods to the branch, sometimes at cost and sometimes at selling (invoice) price, and may pay "
            "the branch's expenses. The branch sells the goods for cash and on credit, and remits (sends) the cash it "
            "collects to head office. Head office keeps the branch accounts and finds the branch profit.")
    heading(s, "Head office and a dependent branch")
    ho = box(s, 170, 200, 240, 130, ["HEAD OFFICE", "keeps the branch", "accounts"], col=PURPLE, fill=F_PURPLE, size=18)
    br = box(s, 630, 200, 240, 130, ["BRANCH", "sells goods,", "collects cash"], col=TEAL, fill=F_TEAL, size=18)
    s.arrow(292, 160, 508, 160, color=BLUE, width=3.5)
    s.label(400, 140, "goods sent (at cost or invoice price)", size=14, color=BLUE, weight="bold", pad=3)
    s.arrow(508, 240, 292, 240, color=GREEN, width=3.5)
    s.label(400, 262, "cash remitted to head office", size=14, color=GREEN, weight="bold", pad=3)
    note(s, "Branch profit = branch sales − cost of goods sold at the branch − branch expenses.", 355, size=14, color=INK)
    return s


@fig
def incomplete_records_methods():
    s = Svg(800, 460, "Two ways of finding profit from incomplete records",
            "Method 1, the statement of affairs or net worth method: find the capital at the start and end of the year from "
            "statements of affairs (assets minus liabilities); profit equals closing capital minus opening capital plus "
            "drawings minus any capital introduced. Method 2, conversion into double entry: rebuild sales and purchases "
            "using total receivables and total payables accounts from the cash records, then prepare a full income "
            "statement and statement of financial position.")
    heading(s, "Profit from incomplete records: two methods")
    a = box(s, 205, 240, 360, 300, ["1. Statement of affairs", "(net worth) method", "",
                                    "capital = assets − liabilities", "at the start and at the end", "",
                                    "profit = closing capital", "− opening capital", "+ drawings − new capital", "",
                                    "quick, but no detail"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 595, 240, 360, 300, ["2. Conversion into", "double entry", "",
                                    "rebuild sales and purchases with", "total receivables / payables accounts",
                                    "summarise cash and bank", "", "prepare a full income statement",
                                    "and statement of financial position", "", "more work, full detail"],
            col=GREEN, fill=F_GREEN, size=17)
    return s


@fig
def consignment_flow():
    s = Svg(800, 420, "How a consignment works",
            "The consignor sends goods to the consignee, who sells them on the consignor's behalf. The consignee pays any "
            "expenses at the selling end, deducts commission, and sends the consignor an account sales showing sales, "
            "expenses and commission, together with the balance due. Ownership stays with the consignor until the goods "
            "are sold.")
    heading(s, "Consignor → consignee → account sales")
    c1 = box(s, 160, 200, 230, 120, ["CONSIGNOR", "owner of the goods", "(principal)"], col=PURPLE, fill=F_PURPLE, size=18)
    c2 = box(s, 640, 200, 230, 120, ["CONSIGNEE", "selling agent", "earns commission"], col=TEAL, fill=F_TEAL, size=18)
    s.arrow(280, 160, 520, 160, color=BLUE, width=3.5)
    s.label(400, 140, "1. goods sent (pro-forma invoice)", size=14, color=BLUE, weight="bold", pad=3)
    s.arrow(520, 245, 280, 245, color=GREEN, width=3.5)
    s.label(400, 268, "3. account sales + balance due", size=14, color=GREEN, weight="bold", pad=3)
    s.label(560, 315, "2. consignee sells the goods, pays expenses, deducts commission", size=13, color=INK, pad=3)
    note(s, "The goods remain the consignor's property until sold: unsold goods are the consignor's inventory.", 395, size=14, color=MUTED)
    return s


@fig
def bill_of_exchange_cycle():
    s = Svg(800, 470, "The life of a bill of exchange",
            "The drawer (creditor) draws a bill on the drawee (debtor), who accepts it by signing, becoming the acceptor. The "
            "drawer then has three choices: hold the bill until it matures and present it for payment; discount it with a "
            "bank for cash now, less a discount charge; or endorse it to a third party to settle a debt. On the due date "
            "the acceptor pays (the bill is honoured) or fails to pay (the bill is dishonoured).")
    heading(s, "Drawn → accepted → held, discounted or endorsed → honoured or dishonoured")
    d = box(s, 150, 120, 230, 76, ["DRAWER", "the creditor who writes it"], col=PURPLE, fill=F_PURPLE, size=17)
    a = box(s, 650, 120, 230, 76, ["DRAWEE → ACCEPTOR", "the debtor who signs it"], col=TEAL, fill=F_TEAL, size=17)
    s.arrow(266, 108, 534, 108, color=BLUE, width=3)
    s.label(400, 92, "1. drawn and sent", size=13, color=BLUE, weight="bold", pad=3)
    s.arrow(534, 140, 266, 140, color=GREEN, width=3)
    s.label(400, 158, "2. accepted and returned", size=13, color=GREEN, weight="bold", pad=3)
    opts = [(150, "Hold to maturity", "present for payment"), (400, "Discount with a bank", "cash now, less discount"),
            (650, "Endorse to a creditor", "to settle a debt")]
    s.text(400, 222, "3. The drawer may then:", size=16, weight="bold", color=INK)
    for x, t, u in opts:
        box(s, x, 280, 220, 70, [t, u], col=BLUE, fill=F_BLUE, size=16)
    s.text(400, 352, "4. On the due date the bill is either:", size=16, weight="bold", color=INK)
    box(s, 260, 410, 260, 60, ["Honoured", "acceptor pays on due date"], col=GREEN, fill=F_GREEN, size=16)
    box(s, 560, 410, 260, 60, ["Dishonoured", "acceptor fails to pay"], col=RED, fill=F_RED, size=16)
    return s


@fig
def receipts_vs_income():
    s = Svg(800, 470, "Receipts and payments account compared with income and expenditure account",
            "A receipts and payments account is a summary of the cash book: it records all cash received and paid, of "
            "capital and revenue nature, for any period, and its balance is cash in hand. An income and expenditure "
            "account is like an income statement: it records only revenue income and expenditure belonging to the period, "
            "adjusted for accruals and prepayments, and its balance is a surplus or deficit.")
    heading(s, "Clubs and societies: two different accounts")
    a = box(s, 205, 250, 360, 320, ["RECEIPTS AND PAYMENTS", "account", "", "summary of the cash book",
                                    "all cash in and out", "capital and revenue items", "includes previous and next",
                                    "year's subscriptions", "no depreciation, no accruals", "",
                                    "balance = cash in hand / at bank"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 595, 250, 360, 320, ["INCOME AND EXPENDITURE", "account", "", "like an income statement",
                                    "revenue items only", "only items of this period",
                                    "adjusted for accruals,", "prepayments, depreciation", "", "",
                                    "balance = surplus or deficit"], col=GREEN, fill=F_GREEN, size=17)
    return s


@fig
def partnership_appropriation():
    s = Svg(800, 500, "How partnership profit is appropriated",
            "The partnership appropriation account starts with net profit, adds interest charged on partners' drawings, then "
            "deducts partners' salaries and interest on capital. The remaining residual profit is shared between the "
            "partners in their profit-sharing ratio. Each partner's share, salary and interest are credited to their "
            "current accounts.")
    heading(s, "Partnership appropriation account")
    rows = [(100, "Net profit (from the income statement)", BLUE, F_BLUE),
            (175, "+ Interest on drawings (charged to partners)", GREEN, F_GREEN),
            (250, "− Partners' salaries", ORANGE, F_AMBER),
            (325, "− Interest on capital", ORANGE, F_AMBER),
            (400, "= Residual profit, shared in the profit-sharing ratio", PURPLE, F_PURPLE)]
    prev = None
    for y, t, col, fill in rows:
        b = box(s, 400, y, 600, 54, [t], col=col, fill=fill, size=18)
        if prev:
            link(s, prev, b, color=MUTED, width=2)
        prev = b
    note(s, "Salaries, interest and shares are credited to each partner's current account.", 470, size=15, color=INK)
    return s


# ═══ FA4: companies, public sector and ICT ═══════════════════════════════════

@fig
def share_capital_levels():
    s = Svg(800, 470, "Levels of share capital",
            "Authorised share capital is the maximum the company may issue under its constitution. Issued share capital is "
            "the part actually issued to shareholders. Called-up capital is the part of the issued capital the company has "
            "asked shareholders to pay so far, and paid-up capital is the part actually received. Each level is equal to "
            "or smaller than the one above it.")
    heading(s, "Authorised ≥ issued ≥ called-up ≥ paid-up")
    levels = [("Authorised capital", "the most the company may issue", 680, PURPLE, F_PURPLE),
              ("Issued capital", "shares actually issued to shareholders", 560, BLUE, F_BLUE),
              ("Called-up capital", "amount shareholders have been asked to pay", 440, TEAL, F_TEAL),
              ("Paid-up capital", "amount actually received", 320, GREEN, F_GREEN)]
    for k, (a, b, w, col, fill) in enumerate(levels):
        y = 110 + k * 88
        s.rect(400 - w / 2, y - 34, w, 68, fill=fill, stroke=col, width=2.5, rx=12)
        s.text(400, y - 9, a, size=18, weight="bold", color=col)
        s.text(400, y + 15, b, size=15, color=INK)
    note(s, "Only issued (called-up) capital appears in the statement of financial position.", 455, size=14, color=INK)
    return s


@fig
def company_equity():
    s = Svg(800, 470, "Equity and liabilities of a limited company",
            "The capital side of a company's statement of financial position. Equity is made up of share capital (ordinary "
            "and preference shares) and reserves: capital reserves such as share premium and revaluation reserve, which "
            "cannot normally be paid out as dividends, and revenue reserves such as the general reserve and retained "
            "earnings, which can. Below equity come non-current liabilities, such as debentures and long-term loans, and "
            "current liabilities, such as trade payables, tax payable and accrued expenses.")
    heading(s, "Equity and liabilities of a limited company")
    eq = box(s, 400, 85, 300, 52, ["EQUITY (owners' interest)"], col=PURPLE, fill=F_PURPLE, size=18)
    sc = box(s, 150, 200, 240, 110, ["Share capital", "ordinary shares", "preference shares"], col=BLUE, fill=F_BLUE, size=17)
    cr = box(s, 400, 200, 220, 110, ["Capital reserves", "share premium", "revaluation reserve"], col=TEAL, fill=F_TEAL, size=17)
    rr = box(s, 640, 200, 240, 110, ["Revenue reserves", "general reserve", "retained earnings"], col=GREEN, fill=F_GREEN, size=17)
    for b in (sc, cr, rr):
        link(s, eq, b, color=MUTED, width=2)
    box(s, 245, 370, 330, 90, ["Non-current liabilities", "debentures, long-term loans"], col=ORANGE, fill=F_AMBER, size=17)
    box(s, 590, 370, 330, 90, ["Current liabilities", "payables, tax payable, accruals"], col=RED, fill=F_RED, size=17)
    note(s, "Capital reserves cannot normally be paid out as dividends; revenue reserves can.", 450, size=14, color=INK)
    return s


@fig
def public_funds_flow():
    s = Svg(800, 470, "How public money flows in Sierra Leone",
            "Government revenue from taxes collected by the National Revenue Authority, non-tax revenue, grants and loans is "
            "paid into the Consolidated Revenue Fund. Parliament approves spending through the budget and the Appropriation "
            "Act. The Ministry of Finance releases funds to ministries, departments and agencies, which spend them and "
            "account for them through the Accountant-General. The Auditor-General audits the accounts and reports to "
            "Parliament, whose Public Accounts Committee examines the report.")
    heading(s, "From revenue to audit: the public funds cycle")
    steps = [(140, 130, "Revenue", "taxes (NRA), fees,", "royalties, grants, loans", BLUE, F_BLUE),
             (400, 130, "Consolidated", "Revenue Fund", "all public money", PURPLE, F_PURPLE),
             (660, 130, "Budget approved", "by Parliament", "(Appropriation Act)", ORANGE, F_AMBER),
             (660, 330, "Funds released", "by the Ministry", "of Finance to MDAs", TEAL, F_TEAL),
             (400, 330, "Spending and", "accounts", "(Accountant-General)", GREEN, F_GREEN),
             (140, 330, "Audit", "Auditor-General reports", "to Parliament (PAC)", RED, F_RED)]
    bs = [box(s, x, y, 230, 100, [a, b, c], col=col, fill=fill, size=17) for x, y, a, b, c, col, fill in steps]
    for i in range(5):
        link(s, bs[i], bs[i + 1], color=MUTED, width=2.4)
    note(s, "MDAs = ministries, departments and agencies; PAC = Public Accounts Committee.", 450, size=14, color=MUTED)
    return s


@fig
def computerised_accounting():
    s = Svg(800, 470, "A computerised accounting system",
            "Input: source documents such as invoices, receipts and payroll data are keyed in or imported. Processing: the "
            "accounting software posts each entry to the sales ledger, purchases ledger, general ledger, inventory and payroll "
            "modules automatically by double entry. Output: reports such as the trial balance, income statement, statement "
            "of financial position, aged receivables and VAT or GST returns, produced instantly. Controls include passwords, "
            "user access levels, backups and an audit trail.")
    heading(s, "Input → processing → output")
    a = box(s, 140, 230, 220, 230, ["INPUT", "", "invoices", "receipts", "credit notes", "payroll data", "bank feeds"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 400, 230, 240, 230, ["PROCESSING", "(accounting software)", "", "sales ledger", "purchases ledger", "general ledger",
                                    "inventory, payroll"], col=PURPLE, fill=F_PURPLE, size=17)
    c = box(s, 660, 230, 220, 230, ["OUTPUT", "", "trial balance", "income statement", "financial position", "aged receivables",
                                    "tax returns"], col=GREEN, fill=F_GREEN, size=17)
    link(s, a, b, color=MUTED, width=2.6)
    link(s, b, c, color=MUTED, width=2.6)
    s.rect(110, 382, 580, 50, fill="#ffffff", stroke=RULE, width=1.2, rx=10)
    s.text(400, 407, "Controls: passwords • access levels • backups • audit trail", size=15, weight="bold", color=RED)
    return s

# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    chosen = names or list(FIGS)
    for n in chosen:
        if n not in FIGS:
            raise SystemExit(f"unknown figure: {n}")
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1:])
