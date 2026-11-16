A **function** is a rule that takes an input and gives exactly one output: *double it and add 3*. A vending machine is a function: press one button, get one drink. Functions are the language of all higher mathematics, and WASSCE tests them through mappings, notation like $f(x)$, domain and range, composite functions and inverse functions. This lesson builds each idea step by step with worked examples.

## Learning objectives

By the end of this lesson you should be able to:

- describe relations and mappings, and identify one-to-one, many-to-one, one-to-many and many-to-many relations
- decide whether a relation is a function
- use function notation $f(x)$ and evaluate functions
- state the domain and range of a function
- find composite functions $f(g(x))$ and inverse functions $f^{-1}(x)$

## Relations and mappings

:::callout{type=definition}
A **relation** links members of one set (the **domain**) to members of another set (the **co-domain**). It can be shown as a list of ordered pairs, an arrow diagram (a **mapping**), a table or a graph.

The set of outputs actually produced is the **range**.
:::

### Four kinds of relation

| Kind | Meaning | Example |
|---|---|---|
| **one-to-one** | each input has one output, and each output comes from one input | each student → their own index number |
| **many-to-one** | several inputs share one output | students → their class |
| **one-to-many** | one input has several outputs | a mother → her children |
| **many-to-many** | several inputs, several outputs, both ways | students → subjects they take |

:::callout{type=definition}
A **function** is a relation in which **every input has exactly one output**. So **one-to-one** and **many-to-one** relations are functions; **one-to-many** and **many-to-many** are not.
:::

:::callout{type=worked-example}
**Which of these are functions?**

| Relation | Function? | Reason |
|---|---|---|
| $\{(1, 3), (2, 5), (3, 7)\}$ | yes | one-to-one |
| $\{(1, 4), (2, 4), (3, 4)\}$ | yes | many-to-one: allowed |
| $\{(4, 2), (4, -2), (9, 3)\}$ | **no** | the input $4$ has two outputs |
| "$x$ → its square" | yes | each number has one square |
| "$x$ → a number whose square is $x$" | **no** | $4 \to 2$ and $4 \to -2$ |
:::

:::callout{type=tip}
**The vertical line test:** a graph shows a function if every vertical line cuts it **at most once**. A circle fails (a vertical line can cut it twice); a parabola $y = x^2$ passes.
:::

## Function notation

$f(x) = 2x + 3$ means *"the function $f$ takes $x$, doubles it and adds 3"*. To evaluate, replace $x$ by the input everywhere.

:::callout{type=worked-example}
**If $f(x) = 2x + 3$ and $g(x) = x^2 - 1$, find:**

**(a)** $f(4) = 2(4) + 3 = 11$

**(b)** $g(-3) = (-3)^2 - 1 = 8$

**(c)** $f(a + 1) = 2(a + 1) + 3 = 2a + 5$

**(d)** the value of $x$ for which $f(x) = 15$: $2x + 3 = 15 \Rightarrow x = 6$
:::

The same idea is written in mapping notation: $f: x \mapsto 2x + 3$ ("$f$ maps $x$ to $2x + 3$").

## Domain and range

:::callout{type=worked-example}
**$f: x \mapsto 3x - 1$ is defined on the domain $\{-1, 0, 1, 2\}$. Find the range.**

$$f(-1) = -4,\; f(0) = -1,\; f(1) = 2,\; f(2) = 5$$

**Range $= \{-4, -1, 2, 5\}$.**
:::

Some values must be **excluded** from the domain:

| Function | Excluded values | Why |
|---|---|---|
| $f(x) = \dfrac{5}{x - 2}$ | $x = 2$ | division by zero |
| $g(x) = \sqrt{x - 3}$ | $x < 3$ | no real square root of a negative number |

## Composite functions

$f(g(x))$, also written $fg(x)$ or $(f \circ g)(x)$, means **apply $g$ first, then $f$**.

:::callout{type=worked-example}
**If $f(x) = 2x + 3$ and $g(x) = x^2 - 1$, find $f(g(x))$, $g(f(x))$ and $f(g(2))$.**

$$f(g(x)) = 2(x^2 - 1) + 3 = 2x^2 + 1$$

$$g(f(x)) = (2x + 3)^2 - 1 = 4x^2 + 12x + 9 - 1 = 4x^2 + 12x + 8$$

$$f(g(2)) = f(3) = 9 \quad\text{(since } g(2) = 4 - 1 = 3\text{)}$$

Notice that $f(g(x)) \ne g(f(x))$: **order matters**.
:::

:::callout{type=common-mistake}
**Doing them in the wrong order.** In $f(g(x))$, the function **closest to $x$** (here $g$) is applied **first**. Work from the inside out.
:::

## Inverse functions

The **inverse** $f^{-1}$ undoes $f$: if $f(3) = 9$, then $f^{-1}(9) = 3$. Only **one-to-one** functions have inverses.

### Finding the inverse

1. Write $y = f(x)$.
2. Make $x$ the subject.
3. Swap: replace $y$ by $x$, giving $f^{-1}(x)$.

:::callout{type=worked-example}
**Find the inverse of $f(x) = \dfrac{2x + 3}{5}$, and $f^{-1}(3)$.**

$$y = \frac{2x + 3}{5} \;\Rightarrow\; 5y = 2x + 3 \;\Rightarrow\; x = \frac{5y - 3}{2}$$

$$f^{-1}(x) = \frac{5x - 3}{2}, \qquad f^{-1}(3) = \frac{15 - 3}{2} = 6$$

**Check:** $f(6) = \dfrac{12 + 3}{5} = 3$ ✓
:::

:::callout{type=worked-example}
**Find the inverse of $g(x) = \dfrac{x + 1}{x - 2}$, $x \ne 2$.**

$$y(x - 2) = x + 1 \;\Rightarrow\; xy - 2y = x + 1 \;\Rightarrow\; xy - x = 2y + 1 \;\Rightarrow\; x(y - 1) = 2y + 1$$

$$g^{-1}(x) = \frac{2x + 1}{x - 1}, \quad x \ne 1$$

(This uses the "subject in two places" method from the change-of-subject lesson.)
:::

:::callout{type=local-example}
Conversions are functions with inverses. If a bureau changes US dollars to leones with $f(d) = 23d$ (an illustrative rate), then $f^{-1}(L) = \dfrac{L}{23}$ changes leones back to dollars. Composite functions appear when two changes are made in a row: convert, then add a fixed fee.
:::

## Practice

:::reveal{title="1. Is {(2, 5), (3, 5), (2, 7)} a function? Why?"}
**No.** The input $2$ has two outputs ($5$ and $7$).
:::

:::reveal{title="2. If f(x) = 3x² − 2x, find f(−2)."}
$3(4) - 2(-2) = 12 + 4 = 16$.
:::

:::reveal{title="3. Find the range of g: x ↦ x² + 1 on the domain {−2, −1, 0, 1, 2}."}
$g(\pm2) = 5$, $g(\pm1) = 2$, $g(0) = 1$. **Range $= \{1, 2, 5\}$** (a many-to-one function).
:::

:::reveal{title="4. If f(x) = x + 4 and g(x) = 3x, find fg(x) and gf(x)."}
$fg(x) = f(3x) = 3x + 4$; $gf(x) = g(x + 4) = 3x + 12$.
:::

:::reveal{title="5. Find the inverse of h(x) = 4x − 7."}
$y = 4x - 7 \Rightarrow x = \dfrac{y + 7}{4}$, so **$h^{-1}(x) = \dfrac{x + 7}{4}$**.
:::

:::reveal{title="6. State the value of x that must be excluded from the domain of f(x) = 1/(2x + 6)."}
$2x + 6 = 0 \Rightarrow$ **$x = -3$**.
:::

## Key points

- A **function** gives **exactly one output** for each input: one-to-one or many-to-one.
- Evaluate $f(x)$ by **substituting** the input everywhere $x$ appears.
- The **range** is the set of outputs; **exclude** values that make a denominator zero or a square root negative.
- $f(g(x))$: apply $g$ **first** (inside out); order matters.
- Inverse: $y = f(x)$, make $x$ the subject, swap $x$ and $y$. Check that $f(f^{-1}(x)) = x$.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect objective questions on evaluating $f(x)$, identifying the type of a relation or mapping, finding the range, and finding composite and inverse functions. Theory questions often combine these: *"find $f^{-1}(x)$ and hence $f^{-1}(5)$"*, *"find the value of $x$ for which $fg(x) = 2$"*. Show each step of making $x$ the subject.
:::
