:::callout{type=definition}
A **database** is an organised collection of related data stored so that it can be easily searched, updated and reported on. A **database management system (DBMS)** is the software used to create, manage and use a database, such as Microsoft Access, MySQL or Oracle.
:::

A school's student records, a bank's accounts, a hospital's patient files and the contacts in your phone are all databases. This lesson explains the parts of a database (**tables, fields, records** and the **primary key**), **database management systems** and their examples, the database objects (**tables, queries, forms and reports**), data types, relationships between tables, the types of database, and the advantages of a computerised database over paper files.

## Learning objectives

By the end of this lesson you should be able to:

- define a database and a database management system, with examples
- explain table, field, record, field name and data type
- explain the primary key and the foreign key, and why they are needed
- describe the database objects: tables, queries, forms and reports
- describe flat-file, relational, hierarchical and network databases
- state the advantages and disadvantages of a computerised database

## Database management systems

| DBMS | Used for |
|---|---|
| **Microsoft Access** | small databases in schools and offices |
| **MySQL**, **PostgreSQL** | websites and online systems |
| **Oracle**, **Microsoft SQL Server** | large organisations such as banks |
| **SQLite** | apps on phones |
| **dBase**, **FoxPro** | older desktop databases |

A DBMS lets users **create** the structure, **enter and edit** data, **search and sort** it, **check** it with validation rules, **control who can see** it, and **produce reports**.

## Tables, fields and records

![Two tables in a school database. The Students table has the fields StudentID, Surname, First name and Class; each row is a record, such as S002, Kamara, Aminata, SSS3; a column such as Surname is a field; StudentID is the primary key, underlined, and no two students can share one. The Fees table has Receipt No, StudentID, Amount and Date. StudentID in Fees is a foreign key linking each payment to one student: one student can have many fee payments, a one-to-many relationship](https://wasscetutor.com/img/ict/database-tables.svg)

:::callout{type=definition}
**Table:** a set of related records arranged in rows and columns, such as a table of students.

**Field:** one item of data about every record, shown as a column, such as Surname or Date of birth.

**Field name:** the heading that names a field, such as StudentID.

**Record:** all the data about one person or thing, shown as a row of a table.

**Primary key:** a field whose value is different for every record, so it identifies each record uniquely, such as a student ID number.

**Foreign key:** a field in one table that is the primary key of another table, used to link the two tables.
:::

**Why a primary key?** Two students may have the same name, Mohamed Sesay, but they cannot have the same **StudentID**, so the computer can always tell their records apart. Good primary keys: student ID, index number, account number, staff number, passport number. A surname is a poor primary key because many people share one.

### Data types

Each field is given a **data type**, which controls what can be entered in it.

| Data type | Holds | Example field |
|---|---|---|
| **Text (short text)** | letters, digits and symbols | Surname, phone number |
| **Number** | numbers used in calculations | Age, Mark |
| **Date/Time** | dates and times | Date of birth |
| **Currency** | amounts of money | Fees paid |
| **Yes/No (Boolean)** | only two values: yes or no, true or false | Boarder? |
| **AutoNumber** | a number the computer gives each new record | Receipt No |
| **Memo (long text)** | long notes | Teacher's remarks |

:::callout{type=tip}
**Why is a phone number stored as text?** It is never added or multiplied, and it can begin with a 0 or a + sign, which a number field would drop. Store numbers as Number only when you calculate with them.
:::

## Database objects

:::callout{type=definition}
**Query:** a request to the database to find, sort or calculate with the records that meet given conditions (criteria), such as all students in SSS3.

**Form:** a screen layout used to enter, view and edit records one at a time.

**Report:** a formatted summary of data from tables or queries, laid out for printing, such as a class list.
:::

- **Tables** store the data.
- **Queries** ask questions: "Which students in SSS3 owe fees?" A query can use **criteria** such as `Class = "SSS3"` or `Mark >= 50`.
- **Forms** make data entry easy and help prevent errors.
- **Reports** present the results neatly for printing.
- **Macros** automate repeated tasks.

Queries are often written in **SQL** (Structured Query Language):

```sql
SELECT Surname, FirstName
FROM Students
WHERE Class = 'SSS3'
ORDER BY Surname;
```

This lists the surnames and first names of all SSS3 students in alphabetical order of surname.

## Relationships between tables

In a **relational database**, tables are linked by matching fields. In the diagram, **StudentID** in the Fees table matches StudentID in the Students table.

- **One-to-one:** each record in one table matches one record in the other (one student, one ID card).
- **One-to-many:** one record in the first table matches many in the second (one student, many fee payments). This is the most common.
- **Many-to-many:** many records match many (many students take many subjects), usually handled with a third, linking table.

Linking tables avoids **data redundancy**: the student's name is stored **once**, in the Students table, not again with every payment. This saves space and keeps the data **consistent**.

## Types (models) of databases

| Type | How data is organised | Example |
|---|---|---|
| **Flat-file** | one single table | a simple contact list or class register |
| **Relational** | many tables linked by keys | school records in Access, bank systems |
| **Hierarchical** | a tree: each record has one parent | an organisation chart, a folder tree |
| **Network** | records can have many parents, linked like a web | older airline and banking systems |

Most databases today are **relational**.

## Manual and computerised databases

| Manual (paper) files | Computerised database |
|---|---|
| slow to search and sort | records **found and sorted in seconds** |
| copies kept in many places, often inconsistent | data stored **once** (less redundancy) |
| easily damaged or lost | can be **backed up** |
| anyone can read them | **passwords** control access |
| totals worked by hand | **reports and calculations** done automatically |

**Disadvantages of a computerised database:** cost of computers and software; staff need **training**; data can be lost through power failure, virus or hacking if not **backed up** and protected; a fault can stop the whole system.

:::callout{type=local-example}
**Databases you meet every day.** The WAEC result checker searches a database for your index number; mobile money and bank systems look up your account by its number (a primary key); and the National Civil Registration Authority keeps a database of citizens' identity records.
:::

:::callout{type=common-mistake}
**Mixing up a field and a record.** A **field** is a **column**: one kind of item (such as Surname) for everybody. A **record** is a **row**: everything about **one** person.
:::

## Practice

:::reveal{title="1. Define a database and a DBMS, and give two examples of a DBMS."}
A **database** is an organised collection of related data. A **DBMS** is software used to create, manage and use a database. Examples: **Microsoft Access, MySQL, Oracle, SQL Server** (any two).
:::

:::reveal{title="2. Distinguish between a field and a record."}
A **field** is a single item of data about every record, shown as a **column** (such as Surname). A **record** is all the data about one person or thing, shown as a **row**.
:::

:::reveal{title="3. What is a primary key? Why is a student ID a better primary key than a surname?"}
A **field whose value is unique** for every record. Student IDs are **never repeated**, but many students can share a **surname**, so a surname cannot identify one record.
:::

:::reveal{title="4. State the use of a query, a form and a report."}
A **query** finds or calculates records that meet given conditions; a **form** is used to **enter and view** records; a **report** **presents** data neatly for printing.
:::

:::reveal{title="5. State three advantages of a computerised database over paper files."}
Any three: **faster** searching and sorting; **less redundancy**; data can be **backed up**; **passwords** protect it; **automatic** calculations and reports; takes **less space**.
:::

## Key points

- A **database** is an organised collection of related data; a **DBMS** (Access, MySQL, Oracle) manages it.
- **Table** → **records** (rows) and **fields** (columns); each field has a **field name** and a **data type**.
- The **primary key** identifies each record uniquely; a **foreign key** links to another table's primary key.
- Objects: **tables** (store), **queries** (ask), **forms** (enter), **reports** (print).
- Relationships: **one-to-one, one-to-many, many-to-many**; linking tables reduces **redundancy**.
- Types: **flat-file, relational, hierarchical, network**; most today are **relational**.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE often asks you to define database terms (database, DBMS, table, field, record, primary key), to name examples of DBMS software, to state the use of queries, forms and reports, to choose a suitable primary key or data type for a field, to describe the types of database, and to give advantages of a computerised database. When asked for a primary key, choose a field that can never repeat and say why.
:::
