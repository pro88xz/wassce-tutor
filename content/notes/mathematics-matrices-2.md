Matrices store numbers in rows and columns, but their real power comes from the operations: adding, multiplying, finding the **determinant** and the **inverse**. With an inverse matrix you can solve a pair of simultaneous equations in one step. This lesson covers every matrix operation in the WASSCE core syllabus.

## Learning objectives

By the end of this lesson you should be able to:

- add, subtract and multiply matrices by a scalar
- decide when two matrices can be multiplied, and multiply them
- find the determinant of a $2 \times 2$ matrix (and a $3 \times 3$ matrix)
- find the inverse of a $2 \times 2$ matrix and recognise a singular matrix
- solve simultaneous linear equations using matrices

## Addition, subtraction and scalar multiplication

Matrices of the **same order** are added or subtracted element by element. A scalar multiplies every element.

:::callout{type=worked-example}
**$A = \begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix}$ and $B = \begin{pmatrix} 1 & 0 \\ 2 & 5 \end{pmatrix}$. Find $A + B$, $A - B$ and $3A$.**

$$A + B = \begin{pmatrix} 3 & 1 \\ 5 & 9 \end{pmatrix}$$

$$A - B = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$

$$3A = \begin{pmatrix} 6 & 3 \\ 9 & 12 \end{pmatrix}$$
:::

## Matrix multiplication

$AB$ exists only when **the number of columns of $A$ equals the number of rows of $B$**. An $m \times n$ matrix times an $n \times p$ matrix gives an $m \times p$ matrix.

Each element of $AB$ is a **row of $A$ times a column of $B$**: multiply matching entries and add.

:::callout{type=worked-example}
**With $A$ and $B$ as above, find $AB$ and $BA$.**

For $AB$, take each row of $A$ with each column of $B$:

- row 1, column 1: $2(1) + 1(2) = 4$
- row 1, column 2: $2(0) + 1(5) = 5$
- row 2, column 1: $3(1) + 4(2) = 11$
- row 2, column 2: $3(0) + 4(5) = 20$

$$AB = \begin{pmatrix} 4 & 5 \\ 11 & 20 \end{pmatrix}$$

In the same way,

$$BA = \begin{pmatrix} 2 & 1 \\ 19 & 22 \end{pmatrix}$$

So $AB \ne BA$: **matrix multiplication is not commutative**.
:::

:::callout{type=common-mistake}
Do not multiply matrices element by element. $\begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 1 & 0 \\ 2 & 5 \end{pmatrix}$ is **not** $\begin{pmatrix} 2 & 0 \\ 6 & 20 \end{pmatrix}$. Always use row × column.
:::

## The determinant

![For a 2 by 2 matrix the determinant is ad − bc; for rows (3, 2) and (4, 5) it is 15 − 8 = 7](https://wasscetutor.com/img/mathematics/determinant-cross.svg)

*Figure 1. The determinant of a $2 \times 2$ matrix. WASSCE Tutor diagram.*

For $M = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$, the determinant is

$$|M| = ad - bc$$

:::callout{type=worked-example}
**(a) Find $|A|$ for $A = \begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix}$. (b) Find $x$ if $\begin{vmatrix} x & 3 \\ 2 & x \end{vmatrix} = 10$.**

**(a)** $|A| = 2(4) - 1(3) = 5$

**(b)** $x^2 - 6 = 10$, so $x^2 = 16$ and $x = \pm 4$.
:::

**$3 \times 3$ determinant:** expand along the first row, with signs $+, -, +$.

$$\begin{vmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 1 & 0 & 6 \end{vmatrix}$$

Each first-row element multiplies the $2 \times 2$ determinant left when its row and column are covered:

$$= 1(4 \cdot 6 - 5 \cdot 0) - 2(0 \cdot 6 - 5 \cdot 1) + 3(0 \cdot 0 - 4 \cdot 1)$$

$$= 24 + 10 - 12 = 22$$

## The inverse of a $2 \times 2$ matrix

$$M^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

Swap the leading diagonal, change the signs of the other two elements, and divide by the determinant. Then $MM^{-1} = M^{-1}M = I$, the identity matrix.

A matrix with determinant **0** is **singular** and has no inverse. For example, $\begin{pmatrix} 2 & 4 \\ 1 & 2 \end{pmatrix}$ has determinant $4 - 4 = 0$.

:::callout{type=worked-example}
**Find the inverse of $A = \begin{pmatrix} 2 & 1 \\ 3 & 4 \end{pmatrix}$ and check it.**

$|A| = 5$, so $A^{-1} = \dfrac{1}{5}\begin{pmatrix} 4 & -1 \\ -3 & 2 \end{pmatrix}$.

**Check:** $AA^{-1} = \dfrac{1}{5}\begin{pmatrix} 8 - 3 & -2 + 2 \\ 12 - 12 & -3 + 8 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$. ✓
:::

## Solving simultaneous equations

The equations $2x + y = 7$ and $3x + 4y = 18$ can be written $A\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 7 \\ 18 \end{pmatrix}$, so $\begin{pmatrix} x \\ y \end{pmatrix} = A^{-1}\begin{pmatrix} 7 \\ 18 \end{pmatrix}$.

:::callout{type=worked-example}
**Solve $2x + y = 7$ and $3x + 4y = 18$ using matrices.**

$$\begin{pmatrix} x \\ y \end{pmatrix} = \frac{1}{5}\begin{pmatrix} 4 & -1 \\ -3 & 2 \end{pmatrix}\begin{pmatrix} 7 \\ 18 \end{pmatrix}$$

$$= \frac{1}{5}\begin{pmatrix} 28 - 18 \\ -21 + 36 \end{pmatrix} = \frac{1}{5}\begin{pmatrix} 10 \\ 15 \end{pmatrix} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}$$

So $x = 2$ and $y = 3$. **Check:** $2(2) + 3 = 7$ ✓ and $3(2) + 4(3) = 18$ ✓.
:::

:::callout{type=local-example}
A shop in Kenema sells 2 bags of rice and 1 tin of oil for NLe 700, and 3 bags of rice and 4 tins of oil for NLe 1,800. Writing $r$ and $t$ for the prices in hundreds of leones gives $2r + t = 7$ and $3r + 4t = 18$: the same system as above. So a bag of rice costs NLe 200 and a tin of oil NLe 300.
:::

## Key points

- Add, subtract: **same order**, element by element. Scalar: multiply every element.
- $AB$ exists if **columns of $A$ = rows of $B$**; multiply **row × column**; in general $AB \ne BA$.
- $|M| = ad - bc$; $M^{-1} = \dfrac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$.
- **Singular** matrix: determinant 0, no inverse.
- Solve $AX = B$ by $X = A^{-1}B$.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **add and multiply matrices**, to **find determinants and inverses of $2 \times 2$ matrices**, to **find an unknown from a given determinant**, and to **solve simultaneous equations by the matrix method**. Show the inverse step by step; a wrong sign in the adjoint is the most common loss of marks.
:::

## Practice

Try each question first, then open the answer to check your working.

**1.** Find $\begin{pmatrix} 1 & 2 \\ 0 & 3 \end{pmatrix}\begin{pmatrix} 4 \\ 5 \end{pmatrix}$.

:::reveal{title="Show the answer"}
$\begin{pmatrix} 14 \\ 15 \end{pmatrix}$.
:::

**2.** Find the determinant of $\begin{pmatrix} 5 & 3 \\ 2 & 2 \end{pmatrix}$.

:::reveal{title="Show the answer"}
$10 - 6 = 4$.
:::

**3.** Find the inverse of $\begin{pmatrix} 5 & 3 \\ 2 & 2 \end{pmatrix}$.

:::reveal{title="Show the answer"}
$\dfrac{1}{4}\begin{pmatrix} 2 & -3 \\ -2 & 5 \end{pmatrix}$.
:::

**4.** For what value of $k$ is $\begin{pmatrix} k & 6 \\ 2 & 4 \end{pmatrix}$ singular?

:::reveal{title="Show the answer"}
$4k - 12 = 0$, so $k = 3$.
:::

**5.** Can a $2 \times 3$ matrix be multiplied by a $2 \times 2$ matrix (in that order)?

:::reveal{title="Show the answer"}
No: the first has 3 columns but the second has only 2 rows.
:::

