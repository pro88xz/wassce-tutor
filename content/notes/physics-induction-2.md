Spin a coil in a magnetic field and electricity flows. That is a generator. This lesson explains a.c. and d.c. generators, self- and mutual induction, and the eddy currents that engineers both use and fight.

## Learning objectives

By the end of this lesson you should be able to:

- explain the action of a simple a.c. generator and a d.c. generator
- sketch the output of each generator
- explain mutual induction and self-induction
- describe eddy currents, their uses and how they are reduced

## The a.c. generator (alternator)

A rectangular **coil** rotates between the poles of a magnet. Its ends connect to two **slip rings**, which turn with the coil and press against fixed **carbon brushes** that lead to the external circuit.

1. As the coil rotates, its sides **cut the field lines**, and the flux through the coil changes continuously, so an e.m.f. is induced.
2. The e.m.f. is **greatest** when the coil's plane is **parallel** to the field (the sides cut the lines fastest) and **zero** when the coil is **perpendicular** to the field (sides moving along the lines).
3. Every half turn, each side of the coil reverses its direction of motion through the field, so the current **reverses**: the output is **alternating current**, a sine wave.

The peak e.m.f. is $E_0 = NBA\omega$, so it increases with more turns, a stronger field, a larger coil area and faster rotation (which also increases the frequency).

## The d.c. generator (dynamo)

Same as the a.c. generator, but the slip rings are replaced by a **split-ring commutator**. Every half turn, as the current in the coil reverses, the commutator **swaps the connections** to the external circuit, so the output current always flows in the **same direction**. The output is a **varying d.c.**: a series of "humps" that never go negative.

| a.c. generator | d.c. generator |
|---|---|
| slip rings | split-ring commutator |
| output reverses direction (sine wave) | output in one direction (humps) |
| e.g. power-station alternators, car alternators | e.g. older bicycle dynamos and car dynamos |

:::callout{type=local-example}
The turbines at Bumbuna hydroelectric station turn huge alternators. Instead of a coil spinning in a magnet, large electromagnets spin inside fixed coils — the same principle, built so that the heavy output windings do not have to rotate.
:::

## Mutual induction

When the current in one coil (the **primary**) changes, the changing magnetic field it produces passes through a nearby coil (the **secondary**) and **induces an e.m.f.** in it. This is **mutual induction**.

- Switching the primary current **on** or **off** gives a brief pulse of induced current in the secondary.
- A **steady d.c.** in the primary induces **nothing** (no change of flux).
- An **a.c.** in the primary induces a continuous a.c. in the secondary — the principle of the **transformer** and the **induction coil**.

## Self-induction

A changing current in a coil induces an e.m.f. **in the same coil**, which (by Lenz's law) opposes the change. This **back e.m.f.** slows the growth of current when it is switched on and produces a large e.m.f. (and often a spark) when it is switched off suddenly. A coil designed for this effect is an **inductor**; its **inductance** is measured in **henries (H)**.

Uses: chokes in fluorescent lamp circuits, tuning circuits (with a capacitor) in radios, and smoothing circuits.

## Eddy currents

When a solid piece of metal moves in a magnetic field, or sits in a changing field, currents are induced that swirl around inside it: **eddy currents**. By Lenz's law, they **oppose** the motion or change.

**Uses:**

- **electromagnetic braking** in trains and some exercise bikes
- **damping** the needles of moving-coil meters so they settle quickly
- **induction cookers** and induction furnaces (the eddy currents heat the metal pot)
- metal detectors

**Problems:** in transformer cores and motor armatures, eddy currents **waste energy as heat**. They are reduced by making the cores from thin **laminations** (sheets) insulated from one another, which breaks up the eddy-current paths.

## Key points

- a.c. generator: coil + slip rings; output alternates (sine wave); peak $E_0 = NBA\omega$.
- d.c. generator: coil + split-ring commutator; output in one direction.
- Mutual induction: changing current in one coil induces e.m.f. in another (needs a change).
- Self-induction: back e.m.f. in the same coil opposes changes of current.
- Eddy currents oppose motion; useful in brakes and cookers; reduced by laminated cores.

## WASSCE examination focus

:::callout{type=waec-tests}
**Describe the a.c. generator** with a labelled diagram, **sketch its output**, and **state the difference between a.c. and d.c. generators** (slip rings versus commutator). Explain **mutual induction** and **eddy currents** (and why transformer cores are laminated). Factors affecting the generator's output are often asked.
:::

## Quick check

1. What part of an a.c. generator lets the coil turn while keeping contact with the external circuit?
2. At what position of the coil is the e.m.f. of a generator greatest?
3. Why are transformer cores laminated?

**Answers:** 1. Slip rings (with carbon brushes). 2. When the plane of the coil is parallel to the magnetic field. 3. To reduce eddy currents and the energy they waste as heat.
