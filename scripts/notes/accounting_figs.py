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
