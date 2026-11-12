A **matrix** is a rectangular array of numbers arranged in rows and columns. The matrix

$$A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}$$

has $2$ rows and $3$ columns. We call it a $2 \times 3$ matrix (read "2 by 3"). Each number in the matrix is called an **entry** or **element**.

Matrices appear everywhere in advanced mathematics — solving systems of equations, transforming geometric shapes, organising data, computer graphics, statistics. For WAEC, the focus is on basic operations: addition, subtraction, scalar multiplication, multiplication, and finding determinants and inverses of $2 \times 2$ matrices.

This lesson introduces matrices and their notation. The next lesson covers matrix operations, determinants, inverses and solving simultaneous equations with matrices.

:::callout{type=definition}
**Matrix:** A rectangular array of numbers arranged in rows and columns, enclosed in brackets or parentheses.

**Order (or dimension):** The number of rows and columns. An $m \times n$ matrix has $m$ rows and $n$ columns.

**Notation:** Capital letters $A, B, C, \ldots$ for matrices. Elements are denoted $a_{ij}$ where $i$ is the row and $j$ is the column.

**Equal matrices:** Two matrices are equal if they have the same order AND the same corresponding elements.
:::


## Learning objectives

By the end of this lesson you should be able to:

- describe a matrix by its rows, columns and order
- identify the element in a given row and column
- recognise row, column, square, zero, identity, diagonal and symmetric matrices
- state when two matrices are equal

## Anatomy of a matrix

In the matrix

$$A = \begin{pmatrix} 2 & -3 & 5 \\ 1 & 0 & 7 \\ 4 & 8 & -2 \end{pmatrix}$$

- The order is $3 \times 3$ (3 rows, 3 columns).
- $a_{11} = 2$ (row 1, column 1).
- $a_{12} = -3$ (row 1, column 2).
- $a_{23} = 7$ (row 2, column 3).
- $a_{31} = 4$ (row 3, column 1).
- The element $a_{ij}$ is in the $i$-th row, $j$-th column.

![A 2 by 3 matrix with row 2 and column 3 outlined and the element a23 = 7 circled](https://wasscetutor.com/img/mathematics/matrix-anatomy.svg)

*Figure 1. Rows run across, columns run down, and $a_{ij}$ is the element in row $i$, column $j$. WASSCE Tutor diagram.*

## Reading matrix order

The order is always given as **rows × columns** (row count first).

- $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ is $2 \times 2$.
- $\begin{pmatrix} 1 & 2 & 3 \end{pmatrix}$ is $1 \times 3$ (a **row matrix** or **row vector**).
- $\begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix}$ is $3 \times 1$ (a **column matrix** or **column vector**).
- $\begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{pmatrix}$ is $3 \times 3$.

## Special types of matrices

### Row matrix

A matrix with one row: $1 \times n$.

Example: $\begin{pmatrix} 5 & 7 & -2 & 4 \end{pmatrix}$.

### Column matrix

A matrix with one column: $m \times 1$.

Example: $\begin{pmatrix} 3 \\ 1 \\ -5 \end{pmatrix}$.

### Square matrix

A matrix with equal rows and columns: $n \times n$.

Example: $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ ($2 \times 2$).

### Zero matrix (null matrix)

All entries are zero. Denoted $O$ or $\mathbf{0}$.

Example: $O = \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}$.

### Identity matrix

A square matrix with $1$s on the **main diagonal** and $0$s elsewhere. Denoted $I$.

- $2 \times 2$: $I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$.
- $3 \times 3$: $I = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$.

The identity matrix plays the role of $1$ for matrix multiplication.

### Diagonal matrix

A square matrix where all off-diagonal entries are zero.

Example: $\begin{pmatrix} 5 & 0 & 0 \\ 0 & -3 & 0 \\ 0 & 0 & 2 \end{pmatrix}$.

The identity matrix is a special diagonal matrix.

### Triangular matrices

- **Upper triangular:** all entries below the main diagonal are zero. 
  Example: $\begin{pmatrix} 2 & 3 & 1 \\ 0 & 5 & 4 \\ 0 & 0 & 7 \end{pmatrix}$.
- **Lower triangular:** all entries above the main diagonal are zero.

## Matrix equality

Two matrices are equal if and only if:
1. They have the same order.
2. Every corresponding element is equal.

### Example 1

**Are these matrices equal?**

$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$.

Same order ($2 \times 2$), same corresponding entries. Yes, equal.

### Example 2

**Are these equal?**

$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 2 \\ 3 & 5 \end{pmatrix}$.

Different at position $(2, 2)$. Not equal.

### Example 3

**Are these equal?**

$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 4 & 0 \end{pmatrix}$.

Different orders ($2 \times 2$ vs $2 \times 3$). Not equal.

## Using matrix equality to solve for unknowns

If two matrices are stated to be equal, set corresponding entries equal.

### Example 4

**Find $x$ and $y$ if $\begin{pmatrix} x + 1 & 5 \\ 3 & y - 2 \end{pmatrix} = \begin{pmatrix} 4 & 5 \\ 3 & 7 \end{pmatrix}$.**

From position $(1, 1)$: $x + 1 = 4$, so $x = 3$.
From position $(2, 2)$: $y - 2 = 7$, so $y = 9$.

### Example 5

**Find $a, b, c$ if $\begin{pmatrix} 2a & 3 \\ 4 & b + 1 \\ c & 0 \end{pmatrix} = \begin{pmatrix} 6 & 3 \\ 4 & 5 \\ -2 & 0 \end{pmatrix}$.**

$2a = 6 \to a = 3$. 
$b + 1 = 5 \to b = 4$. 
$c = -2$.

:::callout{type=worked-example}
**Identify the order of each matrix.**

**(a)** $A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}$. Order: $2 \times 3$.

**(b)** $B = \begin{pmatrix} 7 \\ 8 \\ 9 \\ 10 \end{pmatrix}$. Order: $4 \times 1$.

**(c)** $C = \begin{pmatrix} -2 & 0 & 1 & 5 \end{pmatrix}$. Order: $1 \times 4$.

**(d)** $D = \begin{pmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{pmatrix}$. Order: $3 \times 2$.

**(e)** $E = \begin{pmatrix} 1 \end{pmatrix}$. Order: $1 \times 1$ (a single scalar treated as a matrix).
:::

:::callout{type=worked-example}
**For $A = \begin{pmatrix} 4 & -2 & 3 \\ 1 & 5 & -7 \\ 0 & 6 & 8 \end{pmatrix}$, identify each element.**

**(a)** $a_{11} = 4$.
**(b)** $a_{12} = -2$.
**(c)** $a_{21} = 1$.
**(d)** $a_{23} = -7$.
**(e)** $a_{32} = 6$.
**(f)** $a_{33} = 8$.
:::

## Why matrices matter

Matrices appear in many contexts.

### Systems of equations

The system
$\begin{cases} 2x + 3y = 7 \\ x - y = 1 \end{cases}$
can be written as the matrix equation
$\begin{pmatrix} 2 & 3 \\ 1 & -1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 7 \\ 1 \end{pmatrix}$.

### Data organisation

A shop's sales for $3$ products across $4$ months: organize as a $3 \times 4$ matrix.

### Geometric transformations

Multiplication by a $2 \times 2$ matrix can rotate, scale, or reflect points in the plane. Computer graphics uses this constantly.

### Networks

A matrix can represent connections in a network (graph). Entry $a_{ij}$ might be $1$ if vertex $i$ connects to vertex $j$, $0$ otherwise.

## Transpose of a matrix

The **transpose** of $A$, written $A^T$ or $A'$, swaps rows and columns. If $A$ is $m \times n$, then $A^T$ is $n \times m$.

$A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}, \quad A^T = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}$.

In the transpose, $a_{ij}^T = a_{ji}$. WAEC may ask basic questions about transpose, but rarely tests it deeply.

## A WAEC example

:::callout{type=worked-example}
**Given $A = \begin{pmatrix} 1 & 2 \\ -3 & 5 \end{pmatrix}$ and $B = \begin{pmatrix} 4 & 0 \\ 6 & -1 \end{pmatrix}$:**

**(a)** What is the order of each matrix? 
$A$: $2 \times 2$. $B$: $2 \times 2$.

**(b)** Find $a_{12}, a_{21}, b_{11}, b_{22}$. 
$a_{12} = 2, a_{21} = -3, b_{11} = 4, b_{22} = -1$.

**(c)** Find the transpose of $A$. 
$A^T = \begin{pmatrix} 1 & -3 \\ 2 & 5 \end{pmatrix}$.

**(d)** Are $A$ and $B$ equal? 
No — corresponding entries differ.
:::

:::callout{type=local-example}
A Sierra Leonean school records exam scores for $3$ students in $4$ subjects. The data is naturally a matrix:

$$\begin{pmatrix} 75 & 82 & 68 & 90 \\ 88 & 79 & 91 & 72 \\ 60 & 95 & 77 & 85 \end{pmatrix}$$

This $3 \times 4$ matrix organises information cleanly. Row $1$ is Student $1$'s scores; column $3$ is everyone's score in Subject $3$ (Chemistry, say).

Matrices are the natural language for tabular data, exactly as WAEC introduces them.
:::

:::callout{type=common-mistake}
**Common errors with matrix basics:**

**1. Confusing rows and columns.**
- Rows go across (horizontal). Columns go down (vertical).
- Order is rows × columns.

**2. Reading entries incorrectly.**
- $a_{ij}$ has row first, column second. $a_{32}$ is row $3$, column $2$.

**3. Forgetting matrices with different orders aren't equal.**
- A $2 \times 2$ matrix and a $2 \times 3$ matrix are different.

**4. Treating zero matrix and identity matrix as the same.**
- Zero matrix has all zeros. Identity has ones on the diagonal.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
Foundational matrix questions in WAEC:

- **Identify order.** *What is the order of the matrix $\begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}$?* ($2 \times 3$.)
- **Identify an element.** *In matrix $A$, what is $a_{23}$?*
- **Equality.** *If $A = B$, find $x, y$.*
- **Identify type.** *Is the matrix $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ a zero matrix? identity? diagonal?*

Vocabulary and notation are the key foundation.
:::

## Practice problems

**1.** State the order of each matrix.
(a) $\begin{pmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{pmatrix}$
(b) $\begin{pmatrix} 7 & -2 & 0 & 3 \end{pmatrix}$
(c) $\begin{pmatrix} 5 \end{pmatrix}$

**2.** For $A = \begin{pmatrix} 1 & -2 & 5 \\ 0 & 3 & 4 \end{pmatrix}$, find $a_{11}, a_{13}, a_{22}, a_{23}$.

**3.** Write down the $3 \times 3$ identity matrix.

**4.** Find $x$ and $y$ if $\begin{pmatrix} x + 2 & 5 \\ 7 & y - 3 \end{pmatrix} = \begin{pmatrix} 8 & 5 \\ 7 & 4 \end{pmatrix}$.

**5.** Find the transpose of $A = \begin{pmatrix} 1 & 0 & 2 \\ 3 & -1 & 4 \end{pmatrix}$.

**6.** Is the matrix $\begin{pmatrix} 5 & 0 \\ 0 & 5 \end{pmatrix}$ a diagonal matrix? An identity matrix?

**7.** Find $a, b, c$ if $\begin{pmatrix} 2a + 1 \\ b - 4 \\ 3c \end{pmatrix} = \begin{pmatrix} 7 \\ 2 \\ -9 \end{pmatrix}$.

### Worked solutions

**1.** (a) $3 \times 2$. (b) $1 \times 4$. (c) $1 \times 1$.

**2.** $a_{11} = 1, a_{13} = 5, a_{22} = 3, a_{23} = 4$.

**3.** $\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$.

**4.** $x + 2 = 8 \to x = 6$. $y - 3 = 4 \to y = 7$.

**5.** $\begin{pmatrix} 1 & 3 \\ 0 & -1 \\ 2 & 4 \end{pmatrix}$.

**6.** Diagonal matrix: yes (zeros off the diagonal). Identity: no (entries on diagonal are $5$, not $1$).

**7.** $2a + 1 = 7 \to a = 3$. $b - 4 = 2 \to b = 6$. $3c = -9 \to c = -3$.
