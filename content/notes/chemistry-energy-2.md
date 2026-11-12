Some enthalpy changes cannot be measured directly. You cannot burn carbon to give only carbon(II) oxide, for example. Hess's law lets you find them from others. Bond energies explain where the energy of a reaction comes from. Entropy and free energy explain why some endothermic reactions happen anyway. This lesson covers all three.

## Learning objectives

By the end of this lesson you should be able to:

- state Hess's law and use it to calculate enthalpy changes
- explain bond breaking and bond making in terms of energy
- calculate ΔH from bond energies
- define entropy and predict whether entropy increases or decreases
- use ΔG = ΔH − TΔS to decide whether a reaction is spontaneous

## Hess's law

:::callout{type=definition}
**Hess's law:** the **total enthalpy change** for a reaction is the **same whatever route** is taken from reactants to products, provided the initial and final conditions are the same.
:::

This follows from the conservation of energy. If two routes gave different energy changes, energy could be created by going one way and returning the other.

:::callout{type=worked-example}
**Find ΔH for C(s) + ½O₂(g) → CO(g)**, which cannot be measured directly, from:

- (1) C(s) + O₂(g) → CO₂(g); ΔH₁ = −394 kJ/mol
- (2) CO(g) + ½O₂(g) → CO₂(g); ΔH₂ = −283 kJ/mol

Route A (direct): C → CO₂, ΔH₁. Route B: C → CO (ΔH = x), then CO → CO₂ (ΔH₂).

By Hess's law, $\Delta H_1 = x + \Delta H_2$:

$$x = \Delta H_1 - \Delta H_2 = -394 - (-283) = -111 \text{ kJ/mol}$$
:::

**Using enthalpies of formation:**

$$\Delta H_{\text{reaction}} = \sum \Delta H_f(\text{products}) - \sum \Delta H_f(\text{reactants})$$

The enthalpy of formation of any **element** in its standard state is **zero**.

:::callout{type=worked-example}
**Find ΔH for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).**

Given ΔH_f (kJ/mol): CH₄ −75, CO₂ −394, H₂O −286; O₂ is 0.

$$\Delta H = [-394 + 2(-286)] - [-75 + 0] = -966 + 75 = -891 \text{ kJ/mol}$$
:::

## Bond energies

- **Breaking bonds** needs energy: **endothermic**.
- **Making bonds** releases energy: **exothermic**.
- A reaction is **exothermic** if more energy is released forming the new bonds than is used breaking the old ones.

$$\Delta H = \sum(\text{energy of bonds broken}) - \sum(\text{energy of bonds formed})$$

| Bond | Average bond energy (kJ/mol) |
|---|---|
| H–H | 436 |
| Cl–Cl | 242 |
| H–Cl | 431 |
| C–H | 413 |
| O=O | 498 |
| C=O (in CO₂) | 805 |
| O–H | 464 |

:::callout{type=worked-example}
**1. H₂(g) + Cl₂(g) → 2HCl(g)**

- Broken: H–H + Cl–Cl $= 436 + 242 = 678$ kJ
- Formed: 2 H–Cl $= 2 \times 431 = 862$ kJ
- $\Delta H = 678 - 862 = -184$ kJ (exothermic)

**2. CH₄ + 2O₂ → CO₂ + 2H₂O (all gases)**

- Broken: 4 C–H + 2 O=O $= 4(413) + 2(498) = 1652 + 996 = 2648$ kJ
- Formed: 2 C=O + 4 O–H $= 2(805) + 4(464) = 1610 + 1856 = 3466$ kJ
- $\Delta H = 2648 - 3466 = -818$ kJ/mol

This differs from the measured value (−890 kJ/mol) because **average** bond energies are used and the water here is a gas.
:::

## Entropy

:::callout{type=definition}
**Entropy (S)** is a measure of the **disorder (randomness)** of a system. Nature tends towards greater disorder.
:::

Entropy **increases** (ΔS positive) when:

- a solid **melts** or a liquid **boils** (solid < liquid < gas)
- a solid **dissolves**
- a reaction produces **more moles of gas** than it uses, e.g. CaCO₃(s) → CaO(s) + CO₂(g)
- temperature rises

Entropy **decreases** when gases condense, liquids freeze, or the number of gas molecules falls, e.g. N₂ + 3H₂ → 2NH₃.

## Free energy and spontaneity

Whether a reaction happens on its own (**spontaneous** or **feasible**) depends on both ΔH and ΔS, combined in the **Gibbs free energy change**:

$$\Delta G = \Delta H - T\Delta S$$

where T is in **kelvin**. A reaction is **spontaneous when ΔG is negative**.

| ΔH | ΔS | ΔG | Spontaneous? |
|---|---|---|---|
| − (exothermic) | + (more disorder) | Always − | **At all temperatures** |
| + (endothermic) | − (less disorder) | Always + | **Never** |
| − | − | − at low T | At **low** temperatures |
| + | + | − at high T | At **high** temperatures |

:::callout{type=worked-example}
**Decomposition of limestone:** CaCO₃(s) → CaO(s) + CO₂(g); ΔH = +178 kJ/mol, ΔS = +0.161 kJ/(mol K).

**At 25 °C (298 K):**

$$\Delta G = 178 - 298 \times 0.161 = 178 - 48.0 = +130 \text{ kJ/mol}$$

ΔG is positive, so limestone does **not** decompose at room temperature.

**The temperature above which it becomes spontaneous** (ΔG = 0):

$$T = \dfrac{\Delta H}{\Delta S} = \dfrac{178}{0.161} \approx 1106 \text{ K} \approx 833\ ^\circ\text{C}$$

This is why **lime kilns** are run at around 900 °C or more.
:::

:::callout{type=local-example}
Some Sierra Leonean communities burn **oyster and other shells** (mainly calcium carbonate) in kilns to make lime for whitewash and building. The free-energy calculation explains why a weak fire is not enough: below about 830 °C the decomposition is not spontaneous, so the kiln must be fired very hot.
:::

:::callout{type=common-mistake}
"Spontaneous" means the reaction is **thermodynamically possible**, not that it is **fast**. Diamond turning into graphite has a negative ΔG, but it is so slow that diamonds last for ever. Speed is a question of **rate**, covered in the next topic.
:::

## Key points

- **Hess's law:** ΔH is independent of the route; use energy cycles or ΔH = ΣΔH_f(products) − ΣΔH_f(reactants).
- **Bond breaking is endothermic, bond making is exothermic**; ΔH = Σ(broken) − Σ(formed).
- **Entropy** measures disorder; it increases from solid → liquid → gas and when more gas forms.
- **ΔG = ΔH − TΔS**; a reaction is spontaneous when **ΔG < 0**.
- Endothermic reactions with a large entropy increase (like CaCO₃ decomposition) become spontaneous at **high temperature**.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **state Hess's law** and **calculate ΔH** from given enthalpy changes or enthalpies of formation, to **calculate ΔH from bond energies**, and to use **ΔG = ΔH − TΔS** to predict spontaneity, remembering to use kelvin and consistent units (kJ or J).
:::

## Quick check

1. State Hess's law.
2. Using the bond energies above, calculate ΔH for 2H₂ + O₂ → 2H₂O(g).
3. Does entropy increase or decrease when steam condenses?
4. A reaction has ΔH = −50 kJ/mol and ΔS = +0.10 kJ/(mol K). Is it spontaneous at 300 K?

**Answers:**

1. The total enthalpy change of a reaction is the same whatever route is taken, provided the initial and final conditions are the same.
2. Broken: $2(436) + 498 = 1370$; formed: $4(464) = 1856$; $\Delta H = 1370 - 1856 = -486$ kJ.
3. It decreases (gas → liquid is more ordered).
4. $\Delta G = -50 - 300(0.10) = -80$ kJ/mol: negative, so yes.
