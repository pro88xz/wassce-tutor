Blow across the top of an empty bottle and it hums. Add water and the note rises. Air in a tube resonates at frequencies set by its length — a fact that lets you measure the speed of sound with nothing more than a tuning fork and a tube of water.

## Learning objectives

By the end of this lesson you should be able to:

- describe stationary waves in closed and open pipes
- find the fundamental frequency and overtones of closed and open pipes
- apply the end correction
- determine the speed of sound with a resonance tube

## Resonance in air columns

A sound wave sent down a tube reflects at the far end. The incident and reflected waves form a **stationary wave** in the air.

- At a **closed end**, the air cannot move: a **displacement node (N)**.
- At an **open end**, the air moves freely: a **displacement antinode (A)**.

![Left: a pipe closed at one end has a node at the closed end and an antinode at the open end; its length is a quarter of a wavelength. Right: a pipe open at both ends has antinodes at both ends and a node in the middle; its length is half a wavelength](https://wasscetutor.com/img/physics/pipes-resonance.svg)

*Figure 1. Fundamental modes of closed and open pipes. WASSCE Tutor diagram.*

### Closed pipe (closed at one end)

| Mode | Length | Frequency |
|---|---|---|
| Fundamental | $L = \dfrac{\lambda}{4}$ | $f_0 = \dfrac{v}{4L}$ |
| 1st overtone | $L = \dfrac{3\lambda}{4}$ | $3f_0$ |
| 2nd overtone | $L = \dfrac{5\lambda}{4}$ | $5f_0$ |

A closed pipe produces **only odd harmonics** ($f_0, 3f_0, 5f_0, \ldots$).

### Open pipe (open at both ends)

| Mode | Length | Frequency |
|---|---|---|
| Fundamental | $L = \dfrac{\lambda}{2}$ | $f_0 = \dfrac{v}{2L}$ |
| 1st overtone | $L = \lambda$ | $2f_0$ |
| 2nd overtone | $L = \dfrac{3\lambda}{2}$ | $3f_0$ |

An open pipe produces **all harmonics**, so it sounds richer; its fundamental is an **octave higher** (double the frequency) than a closed pipe of the same length.

:::callout{type=worked-example}
**Find the fundamental frequency of (a) a closed pipe and (b) an open pipe, each 0.34 m long. (speed of sound = 340 m s⁻¹)**

(a) $f_0 = \dfrac{v}{4L} = \dfrac{340}{1.36} = 250$ Hz.

(b) $f_0 = \dfrac{v}{2L} = \dfrac{340}{0.68} = 500$ Hz.
:::

## End correction

The antinode at an open end actually forms a little **beyond** the end of the tube. The distance is the **end correction** $c$ (about $0.3 \times$ the tube's diameter). For a closed pipe:

$$\dfrac{\lambda}{4} = L + c$$

## Measuring the speed of sound: the resonance tube

1. A long glass tube stands vertically in a tall jar of water, so the length of the air column above the water can be changed by raising or lowering the tube.
2. Strike a tuning fork of known frequency $f$ and hold it over the open top.
3. Starting with a very short air column, raise the tube slowly until the sound is **loudest** (first resonance). Measure the length $L_1$.
4. Raise the tube further to find the **second resonance**, length $L_2$.

At the first resonance $\dfrac{\lambda}{4} = L_1 + c$; at the second $\dfrac{3\lambda}{4} = L_2 + c$. Subtracting removes the end correction:

$$\dfrac{\lambda}{2} = L_2 - L_1 \Rightarrow v = f\lambda = 2f(L_2 - L_1)$$

:::callout{type=worked-example}
**With a 512 Hz fork, resonance occurs at air-column lengths of 16.0 cm and 49.5 cm. Find the speed of sound and the end correction.**

$$\lambda = 2(49.5 - 16.0) = 67.0\ \text{cm} = 0.670\ \text{m}$$

$$v = f\lambda = 512 \times 0.670 = 343\ \text{m s}^{-1}$$

End correction: $\dfrac{\lambda}{4} = L_1 + c \Rightarrow c = 16.75 - 16.0 = 0.75$ cm.
:::

**Alternative (one resonance, several forks):** for each fork, $L = \dfrac{v}{4f} - c$. Plot $L$ against $\dfrac{1}{f}$: a straight line of gradient $\dfrac{v}{4}$ and negative intercept $-c$.

**Precautions:** hold the fork horizontally just above the tube without touching it; do not strike the fork on a hard surface (it produces overtones); approach each resonance slowly from both sides.

## Resonance in everyday life

- Wind instruments: flutes and recorders (open pipes), clarinets (closed pipe behaviour), and the bamboo flutes played at cultural festivals.
- The bottle that hums when you blow across it.
- Your voice: the throat and mouth are resonating air spaces.
- Tuning a radio: the circuit resonates at the station's frequency.

## Key terms

:::callout{type=definition title="Key terms"}
- **Resonance**: the large vibration that occurs when a body is made to vibrate at its own natural frequency.
- **Node**: a point on a stationary wave where there is no vibration, as at the closed end of a pipe.
- **Antinode**: a point on a stationary wave where the vibration is greatest, as at the open end of a pipe.
- **End correction**: the small distance beyond the open end of a pipe where the antinode actually forms.
- **Resonance tube**: a tube whose air column length is adjusted until it resonates with a tuning fork, used to measure the speed of sound.
:::

## Key points

- Closed end: node; open end: antinode.
- Closed pipe: $f_0 = v/4L$, odd harmonics only. Open pipe: $f_0 = v/2L$, all harmonics.
- End correction: $\lambda/4 = L + c$.
- Resonance tube: $v = 2f(L_2 - L_1)$.

## WASSCE examination focus

:::callout{type=waec-tests}
**Sketch the stationary-wave patterns** in closed and open pipes, **compare** their harmonics, and **describe the resonance-tube experiment** to find the speed of sound (and the end correction). Calculations with the first and second resonance lengths are very common. A graph of $L$ against $1/f$ may appear in the practical paper.
:::

## Quick check

1. Which harmonics does a closed pipe produce?
2. A closed pipe resonates first at 0.20 m with a 425 Hz fork (ignore end correction). Find the speed of sound.
3. Why does an open pipe sound richer than a closed pipe?

**Answers:** 1. Only the odd harmonics ($f_0, 3f_0, 5f_0, \ldots$). 2. $\lambda = 4 \times 0.20 = 0.80$ m; $v = 425 \times 0.80 = 340$ m s⁻¹. 3. It produces all the harmonics, not only the odd ones.
