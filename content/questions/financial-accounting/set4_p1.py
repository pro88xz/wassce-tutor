"""Financial Accounting set 4: 15 original objective questions on companies, the public sector and ICT.

Written by WASSCE Tutor in the style of WASSCE Financial Accounting Paper 1 (objective).
Nothing here is copied from a WAEC paper. Answers were checked by an editor
against the WASSCE Tutor Financial Accounting notes; every calculation is worked in full.

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from accounting_common import make  # noqa: E402

TOPICS = {
    "Company Accounts": "Shares and debentures; share capital; reserves; dividends; company final accounts",
    "Public Sector Accounting": "Objectives; government revenue; budget; Consolidated Revenue Fund; controls; audit",
    "ICT in Accounting": "Computerised accounting; software and modules; advantages; data security; spreadsheets",
}

concept = make(TOPICS)

QUESTIONS = [
    # ── Company accounts ────────────────────────────────────────────────
    concept("fa-cp-01", "Company Accounts",
            "Debenture holders of a company are its",
            "creditors",
            [("owners", "Shareholders are the owners."),
             ("directors", "Directors manage the company."),
             ("auditors", "Auditors examine the accounts.")],
            "Debentures are loans to the company, so debenture holders are creditors."),
    concept("fa-cp-02", "Company Accounts",
            "100,000 ordinary shares of NLe 1 are issued at NLe 1.50 each. The share premium is",
            "NLe 50,000",
            [("NLe 150,000", "That is the total cash received."),
             ("NLe 100,000", "That is the nominal share capital."),
             ("NLe 1.50", "That is the issue price per share.")],
            "Premium = 100,000 × (1.50 − 1.00) = 50,000."),
    concept("fa-cp-03", "Company Accounts",
            "Which of the following is a capital reserve?",
            "share premium",
            [("general reserve", "The general reserve is a revenue reserve."),
             ("retained earnings", "Retained earnings are a revenue reserve."),
             ("debentures", "Debentures are a liability, not a reserve.")],
            "Capital reserves, such as share premium, cannot normally be paid out as dividends."),
    concept("fa-cp-04", "Company Accounts",
            "Retained earnings b/f NLe 30,000; profit after tax NLe 67,500; dividends NLe 24,000; transfer to general reserve NLe 15,000. Retained earnings c/f are",
            "NLe 58,500",
            [("NLe 97,500", "Dividends and the transfer must be deducted."),
             ("NLe 73,500", "The transfer to reserve must be deducted."),
             ("NLe 82,500", "Dividends must be deducted.")],
            "30,000 + 67,500 − 24,000 − 15,000 = 58,500."),
    concept("fa-cp-05", "Company Accounts",
            "Debenture interest is shown in a company's",
            "income statement as an expense",
            [("statement of changes in equity as a dividend", "It is interest on a loan, not a dividend."),
             ("statement of financial position as equity", "Debentures are a liability."),
             ("appropriation of retained earnings", "Interest is charged before profit.")],
            "Debenture interest must be paid whether or not there is a profit, so it is an expense."),

    # ── Public sector ───────────────────────────────────────────────────
    concept("fa-ps-01", "Public Sector Accounting",
            "The main aim of public sector accounting is to",
            "show that public funds were raised and spent according to law",
            [("maximise the government's profit", "Government does not aim to make a profit."),
             ("pay dividends to citizens", "Governments do not pay dividends."),
             ("value the shares of the government", "Government has no share capital.")],
            "Public sector accounting provides accountability and stewardship of public money."),
    concept("fa-ps-02", "Public Sector Accounting",
            "All revenues of the Government of Sierra Leone are paid into the",
            "Consolidated Revenue Fund",
            [("Bank of England", "Sierra Leone's government banker is the Bank of Sierra Leone."),
             ("National Revenue Authority's own account", "The NRA collects revenue but pays it into the Fund."),
             ("Public Accounts Committee", "The PAC is a committee of Parliament.")],
            "The 1991 Constitution establishes the Consolidated Revenue Fund for public revenue."),
    concept("fa-ps-03", "Public Sector Accounting",
            "Building a new hospital is an example of",
            "capital (development) expenditure",
            [("recurrent expenditure", "Recurrent expenditure covers running costs such as salaries."),
             ("revenue receipts", "Spending is not a receipt."),
             ("contingent liability", "A hospital project is actual spending.")],
            "Capital expenditure creates long-lasting assets."),
    concept("fa-ps-04", "Public Sector Accounting",
            "The law passed by Parliament approving the government's annual spending is the",
            "Appropriation Act",
            [("Companies Act", "The Companies Act governs companies."),
             ("Partnership Act", "The Partnership Act governs partnerships."),
             ("Finance Act", "A Finance Act deals mainly with taxes.")],
            "The Appropriation Act authorises withdrawals from the Consolidated Revenue Fund."),
    concept("fa-ps-05", "Public Sector Accounting",
            "The accounts of government ministries in Sierra Leone are audited by the",
            "Audit Service Sierra Leone, headed by the Auditor-General",
            [("Accountant-General's Department", "The Accountant-General keeps the accounts but does not audit them."),
             ("National Revenue Authority", "The NRA collects revenue."),
             ("Bank of Sierra Leone", "The central bank is the government's banker.")],
            "The Auditor-General audits public accounts and reports to Parliament."),

    # ── ICT ─────────────────────────────────────────────────────────────
    concept("fa-ic-01", "ICT in Accounting",
            "Which of the following is an accounting software package?",
            "QuickBooks",
            [("PowerPoint", "PowerPoint is presentation software."),
             ("Google Chrome", "Chrome is a web browser."),
             ("WhatsApp", "WhatsApp is a messaging app.")],
            "QuickBooks, Sage and Tally are accounting packages."),
    concept("fa-ic-02", "ICT in Accounting",
            "A major advantage of computerised accounting is",
            "speed and accuracy of processing",
            [("no need for electricity", "Computers need reliable power."),
             ("no need for staff training", "Staff must be trained."),
             ("no possibility of input errors", "Wrong data still gives wrong results.")],
            "Software posts entries and calculates totals quickly and accurately."),
    concept("fa-ic-03", "ICT in Accounting",
            "A record of who entered or changed each transaction, and when, is called",
            "an audit trail",
            [("a backup", "A backup is a copy of the data."),
             ("a password", "A password controls access."),
             ("a spreadsheet", "A spreadsheet is a tool for calculations.")],
            "The audit trail lets every figure be traced to its source and user."),
    concept("fa-ic-04", "ICT in Accounting",
            "In a spreadsheet, the formula =SUM(B2:B10)",
            "adds the values in cells B2 to B10",
            [("multiplies cells B2 and B10", "SUM adds a range."),
             ("finds the average of cells B2 to B10", "AVERAGE would find the mean."),
             ("subtracts B10 from B2", "Subtraction would use B2-B10.")],
            "SUM adds every value in the range."),
    concept("fa-ic-05", "ICT in Accounting",
            "The best protection against losing accounting data when a computer is stolen is",
            "keeping regular backups off site or in the cloud",
            [("using a longer password", "A password does not recover lost data."),
             ("printing the trial balance once a year", "This keeps very little of the data."),
             ("installing a faster processor", "Speed does not protect data.")],
            "Backups stored elsewhere let the data be restored after theft or damage."),
]
