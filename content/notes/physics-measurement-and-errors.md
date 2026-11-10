# Measurement and errors: instruments, accuracy and experimental uncertainty

## Learning objectives
By the end of this lesson, you should be able to explain SI units; select and read measuring instruments; calculate vernier and micrometer readings; correct zero error; distinguish accuracy, precision, resolution and sensitivity; identify systematic, random and gross errors; calculate mean, absolute and percentage error; use significant figures; and apply measurement methods to practical investigations.

## 1. Measurement in physics
A physical measurement has three parts: a quantity, a numerical value and a unit. “Length = 0.842 m” identifies the quantity (length), value (0.842) and unit (metre). Measurement compares an unknown quantity with an agreed standard. No practical measurement is infinitely exact: instruments have finite resolution and procedures introduce uncertainty. A scientific result must therefore be recorded with sensible precision and an appropriate unit.

A market trader measuring rice, a technician checking a wire diameter and a student determining the density of a stone are all performing measurements. The instrument must suit the scale of the quantity. A metre rule is appropriate for a desk; a micrometer is more suitable for a thin wire.

## 2. SI units and derived quantities
The seven SI base quantities and units are:

| Quantity | SI unit | Symbol |
|---|---|---|
| Length | metre | m |
| Mass | kilogram | kg |
| Time | second | s |
| Electric current | ampere | A |
| Thermodynamic temperature | kelvin | K |
| Amount of substance | mole | mol |
| Luminous intensity | candela | cd |

Derived quantities are formed from base quantities.

| Quantity | Definition | SI unit |
|---|---|---|
| Area | length × length | m² |
| Volume | length × length × length | m³ |
| Speed | distance ÷ time | m s⁻¹ |
| Acceleration | velocity change ÷ time | m s⁻² |
| Density | mass ÷ volume | kg m⁻³ |
| Force | mass × acceleration | newton (N) |
| Pressure | force ÷ area | pascal (Pa) |
| Work/energy | force × distance | joule (J) |

For example, density has unit kg/m³ because mass is measured in kg and volume in m³. Checking units in an equation is a useful way to detect mistakes.

### Common prefixes

| Prefix | Symbol | Multiplier |
|---|---|---:|
| kilo | k | 10³ |
| centi | c | 10⁻² |
| milli | m | 10⁻³ |
| micro | μ | 10⁻⁶ |
| nano | n | 10⁻⁹ |

Thus 1 km = 1,000 m; 1 cm = 0.01 m; 1 mm = 0.001 m; and 1 ms = 0.001 s.

**Worked example 1 — Conversion.** Convert 3.6 cm to metres and millimetres.

\[
3.6\text{ cm}=3.6\times0.01=0.036\text{ m}
\]
\[
3.6\text{ cm}=3.6\times10=36\text{ mm}
\]

Answer: 0.036 m and 36 mm. When converting centimetres to metres, divide by 100; do not multiply.

## 3. Selecting a measuring instrument

| Instrument | Main use |
|---|---|
| Metre rule | Ordinary lengths |
| Measuring tape | Longer or curved distances |
| Vernier calipers | External diameter, internal diameter and depth |
| Micrometer screw gauge | Small thicknesses and wire diameters |
| Balance | Mass |
| Stopwatch | Time interval |
| Thermometer | Temperature |

The **range** is the interval an instrument can measure. The **least count** (or scale interval) is the smallest scale step it can resolve. A smaller least count generally allows finer readings, but does not guarantee accuracy if the instrument is damaged or incorrectly calibrated.

### 3.1 Metre rule
A typical metre rule has millimetre divisions. To measure a length, place the rule parallel to the object, align one end with zero, and read the other end directly above the scale. If the object does not begin at zero, subtract the initial reading from the final reading:

\[
L=\text{final reading}-\text{initial reading}
\]

**Worked example 2.** A rod begins at 1.4 cm and ends at 18.9 cm.

\[
L=18.9-1.4=17.5\text{ cm}
\]

The rod is 17.5 cm long, not 18.9 cm. The final scale position is not necessarily the object's length.

Viewing a scale from an angle causes **parallax error**: the mark appears to shift relative to the scale. Place your eye directly above the reading.

### 3.2 Vernier calipers
Vernier calipers combine a fixed main scale with a sliding vernier scale. External jaws measure outside dimensions; internal jaws measure inside dimensions; a depth rod measures depth.

![Vernier calipers showing main scale, sliding vernier and measuring jaws](https://upload.wikimedia.org/wikipedia/commons/4/4a/Vernier_caliper.svg)

*Vernier calipers. Diagram source: Wikimedia Commons.*

For a direct vernier:

\[
LC=1\text{ main-scale division}-1\text{ vernier-scale division}
\]

If 10 vernier divisions equal 9 mm, and one main-scale division is 1 mm:

\[
1\text{ VSD}=\frac{9}{10}=0.9\text{ mm}
\]
\[
LC=1.0-0.9=0.1\text{ mm}
\]

The reading is:

\[
\text{Observed reading}=\text{main-scale reading}+(n\times LC)
\]

where n is the vernier division that exactly coincides with a main-scale mark.

**Worked example 3.** The vernier zero is just beyond 24 mm. The sixth vernier division coincides. The least count is 0.1 mm and zero error is absent.

\[
24+(6\times0.1)=24.6\text{ mm}
\]

Answer: 24.6 mm. Read the last main-scale mark to the left of the vernier zero, not the next mark to its right.

### 3.3 Micrometer screw gauge
A micrometer measures small thicknesses and diameters. A precision screw moves the spindle as the thimble turns. The frame supports the instrument; the anvil is fixed; the spindle moves; the sleeve carries the main scale; the thimble carries the circular scale; and the ratchet helps apply consistent force.

![Micrometer screw gauge with sleeve, thimble, spindle and anvil](https://upload.wikimedia.org/wikipedia/commons/0/0c/Micrometer001.png)

*Micrometer screw gauge. Diagram source: Wikimedia Commons.*

The **pitch** is the distance the spindle advances in one complete revolution.

\[
LC=\frac{\text{pitch}}{\text{number of circular-scale divisions}}
\]

If pitch = 0.5 mm and there are 50 divisions:

\[
LC=\frac{0.5}{50}=0.01\text{ mm}
\]

The reading is:

\[
\text{Observed reading}=\text{sleeve reading}+(n\times LC)
\]

**Worked example 4.** Sleeve reading = 5.5 mm; coinciding thimble division = 28; least count = 0.01 mm.

\[
5.50+(28\times0.01)=5.78\text{ mm}
\]

Answer: 5.78 mm. Use the ratchet as intended. Excessive tightening may compress the object or damage the instrument.

## 4. Zero error and correction
An instrument has zero error if it does not indicate zero when in its defined zero position.

- **Positive zero error:** it shows a positive reading when it should read zero.
- **Negative zero error:** it indicates a reading below zero.

\[
\text{Corrected reading}=\text{observed reading}-\text{zero error}
\]

The zero correction is equal and opposite to the zero error.

**Worked example 5 — Positive zero error.** A caliper reads +0.2 mm when closed. Its observed reading is 16.7 mm.

\[
16.7-(+0.2)=16.5\text{ mm}
\]

**Worked example 6 — Negative zero error.** A micrometer has zero error −0.03 mm and observed reading 2.46 mm.

\[
2.46-(-0.03)=2.49\text{ mm}
\]

Always write the sign of the zero error before applying the correction. Subtracting a negative number means adding its magnitude.

## 5. Accuracy, precision, resolution and sensitivity
These terms are not interchangeable.

- **Accuracy:** closeness to an accepted or reference value.
- **Precision:** closeness of repeated readings to one another.
- **Repeatability:** agreement when the same method, instrument, observer and conditions are used.
- **Resolution:** smallest change an instrument can display or distinguish.
- **Sensitivity:** change in instrument output for a given change in the measured quantity.

Suppose the accepted length is 10.00 cm. Readings 9.99, 10.00 and 10.01 cm are both close together and close to the accepted value. Readings 9.70, 9.71 and 9.70 cm are precise but inaccurate. Readings 9.5, 10.2 and 9.8 cm have poor precision.

An instrument with fine graduations may have high resolution but still be inaccurate if it is incorrectly calibrated.

## 6. Types of measurement error

An error is the difference between a measured result and a reference value. In experimental science, “error” does not necessarily mean a student's blunder; it also describes limitations of measurement.

### Systematic error
A systematic error shifts results consistently in one direction or according to a predictable pattern. Repeating the measurement does not remove it. Causes include zero error, incorrect calibration, a damaged scale, consistent parallax or a flawed method. For example, a balance that reads 2 g when empty makes every uncorrected mass 2 g too high. Reduce systematic errors by checking zero, calibrating instruments and improving the method.

### Random error
Random errors cause unpredictable variations above and below a central value. Causes include reaction-time variation, small environmental fluctuations and difficulty judging a moving object's exact position. Repeated independent readings and a mean can reduce the influence of random variation, but cannot remove a systematic bias.

### Gross error
Gross errors are avoidable mistakes: recording 6.3 cm as 63 cm, reading the wrong scale, using the wrong unit, forgetting to subtract an initial reading or copying a value into the wrong column. Record readings immediately, include units and check calculations. Do not discard an unusual result without a defensible reason.

## 7. Uncertainty and error calculations
A measured value is an estimate with a limitation. For an analogue scale, a school-laboratory estimate is often half the smallest scale division when the reading can reasonably be judged between marks. The exact convention should follow the question or laboratory instructions. For a digital instrument, the display resolution is usually explicit.

For example, a ruler reading might be reported as:

\[
(52.0\pm0.5)\text{ mm}
\]

The ± value expresses an estimated uncertainty under the adopted method; it is not a guarantee that all possible errors have been included.

If a reference value is known:

\[
\text{Absolute error}=|\text{measured}-\text{reference}|
\]
\[
\text{Fractional error}=\frac{\text{absolute error}}{\text{reference}}
\]
\[
\text{Percentage error}=\frac{\text{absolute error}}{\text{reference}}\times100\%
\]

**Worked example 7.** Reference length = 50.0 cm; measured length = 49.0 cm.

\[
\text{Absolute error}=|49.0-50.0|=1.0\text{ cm}
\]
\[
\text{Percentage error}=\frac{1.0}{50.0}\times100=2.0\%
\]

Answer: 1.0 cm absolute error and 2.0% percentage error.

### Repeated readings and mean
Five readings are 12.4, 12.5, 12.3, 12.4 and 12.4 cm.

\[
\bar{x}=\frac{12.4+12.5+12.3+12.4+12.4}{5}=12.4\text{ cm}
\]

The range is:

\[
12.5-12.3=0.2\text{ cm}
\]

The mean is a useful estimate when random variation is present. The range describes the spread of these readings; it is not automatically the uncertainty of the mean. A mean does not correct a zero error shared by every reading.

## 8. Significant figures and rounding
Significant figures communicate the precision of a value.

1. Non-zero digits are significant: 347 has three.
2. Zeros between non-zero digits are significant: 2005 has four.
3. Leading zeros are not significant: 0.0042 has two.
4. Trailing zeros after a decimal point are significant: 4.500 has four.
5. Whole numbers such as 1500 can be ambiguous; scientific notation makes precision clear.

Examples to three significant figures:

- 0.006847 → 0.00685
- 48.76 → 48.8
- 7496 → 7.50 × 10³

For multiplication and division, the final answer is normally reported to the same significant figures as the least precise measured input. For addition and subtraction, decimal places usually determine the limiting precision. Keep extra digits during intermediate working and round only the final answer.

**Worked example 8.** A calculated density is 7.8462 g cm⁻³, but the measurements justify three significant figures.

\[
7.8462\approx7.85\text{ g cm}^{-3}
\]

Do not report unjustified digits.

## 9. Practical: density of a regular solid
Density is mass per unit volume:

\[
\rho=\frac{m}{V}
\]

For a rectangular block:

\[
V=lwh
\]

Apparatus: balance, metre rule or vernier calipers, and a block.

Method:
1. Check that the balance reads zero.
2. Measure length, width and height, repeating dimensions where appropriate.
3. Convert dimensions to a consistent unit.
4. Calculate volume.
5. Measure mass and calculate density.
6. Include units and sensible significant figures.

**Worked example 9.** A block has length 5.00 cm, width 2.00 cm, height 1.50 cm and mass 118.5 g.

\[
V=5.00\times2.00\times1.50=15.0\text{ cm}^3
\]
\[
\rho=\frac{118.5}{15.0}=7.90\text{ g cm}^{-3}
\]

Answer: 7.90 g cm⁻³. If mass is in kg and volume in m³, density is in kg m⁻³.

## 10. Practical: volume of an irregular solid
For a solid that does not dissolve, react with water or absorb significant water, use water displacement.

![Water displacement method for measuring the volume of an irregular object](https://upload.wikimedia.org/wikipedia/commons/3/3b/Displacement_method.svg)

*Water displacement illustration. Source: Wikimedia Commons.*

1. Pour water into a measuring cylinder.
2. Read the initial level at eye height, using the bottom of the meniscus for water.
3. Lower the solid gently until fully submerged.
4. Remove trapped air bubbles.
5. Read the final level.

\[
\text{Volume of solid}=\text{final reading}-\text{initial reading}
\]

**Worked example 10.** Initial reading = 42 cm³; final reading = 57 cm³.

\[
V=57-42=15\text{ cm}^3
\]

If the stone has mass 39 g:

\[
\rho=\frac{39}{15}=2.6\text{ g cm}^{-3}
\]

Precautions: read at eye level, fully submerge the object, remove air bubbles, avoid splashing and do not use this method uncritically for porous or water-reactive materials.

## 11. Improving experimental reliability
- Repeat independent readings and calculate a mean where random variation is expected.
- Select an instrument with suitable range and resolution.
- Check and correct zero error.
- Read analogue scales at eye level.
- Keep relevant conditions controlled.
- Use consistent force with delicate measuring instruments.
- Record readings immediately with units.
- Check the plausibility and dimensions of calculated results.

## 12. Common WASSCE examination mistakes
1. Confusing mass (kg) with weight (N).
2. Confusing accuracy with precision.
3. Forgetting zero correction.
4. Reading the main scale from the wrong side of the vernier zero.
5. Adding a scale division without first multiplying by the least count.
6. Omitting units.
7. Rounding too early.
8. Claiming repeated readings remove systematic errors.
9. Reading the wrong part of a meniscus or viewing it above/below eye level.
10. Reporting more significant figures than the instrument and data justify.

## 13. Formula summary

| Measurement | Formula |
|---|---|
| Length from scale positions | Final − initial reading |
| Vernier least count | 1 MSD − 1 VSD (for a direct vernier) |
| Vernier reading | Main scale + (coinciding division × LC) |
| Micrometer least count | Pitch ÷ circular-scale divisions |
| Micrometer reading | Sleeve + (thimble division × LC) |
| Corrected reading | Observed reading − zero error |
| Mean | Sum of readings ÷ number of readings |
| Absolute error | |Measured − reference| |
| Fractional error | Absolute error ÷ reference |
| Percentage error | Fractional error × 100% |
| Density | Mass ÷ volume |
| Rectangular volume | Length × width × height |
| Displaced volume | Final level − initial level |

## 14. WASSCE practice questions
Show every step, include units and state assumptions.

1. Define a physical quantity and state the SI base units of length, mass and time.
2. Convert (a) 4.8 km to metres, (b) 35 mm to metres and (c) 250 ms to seconds.
3. State two differences between a metre rule and vernier calipers.
4. Ten vernier divisions equal nine main-scale divisions. One main-scale division is 1 mm. Calculate the least count.
5. The main-scale reading is 31 mm and the fourth vernier division coincides. The least count is 0.1 mm and zero error is absent. Find the reading.
6. A micrometer has pitch 0.5 mm and 50 circular divisions. Calculate its least count.
7. Sleeve reading = 3.5 mm; thimble division = 36; least count = 0.01 mm. Find the reading.
8. A caliper has zero error +0.04 cm and observed reading 8.76 cm. Find the corrected reading.
9. Explain systematic and random errors, giving one example of each.
10. Find the mean and range of 6.2, 6.3, 6.1, 6.2 and 6.2 cm.
11. A reference mass is 200 g but the measured mass is 194 g. Calculate absolute and percentage error.
12. Explain why repeating measurements does not necessarily remove zero error.
13. A stone has mass 54 g. Water rises from 30 cm³ to 50 cm³ when it is submerged. Calculate volume and density.
14. Explain why a micrometer is more suitable than a metre rule for a thin wire's diameter.
15. State four precautions when using a measuring cylinder to find an irregular solid's volume.

## 15. Answers and worked solutions

**1.** A physical quantity is a measurable property expressed as a number and unit. Length: metre (m); mass: kilogram (kg); time: second (s).

**2.** (a) 4.8 × 1000 = 4800 m. (b) 35 ÷ 1000 = 0.035 m. (c) 250 ÷ 1000 = 0.250 s.

**3.** A metre rule measures ordinary lengths and usually has millimetre divisions. Vernier calipers measure external dimensions, internal dimensions and depth, with a vernier scale for finer readings.

**4.** 1 VSD = 9/10 = 0.9 mm. Least count = 1.0 − 0.9 = **0.1 mm**.

**5.** 31 + (4 × 0.1) = **31.4 mm**.

**6.** 0.5 ÷ 50 = **0.01 mm**.

**7.** 3.5 + (36 × 0.01) = **3.86 mm**.

**8.** 8.76 − (+0.04) = **8.72 cm**.

**9.** Systematic errors shift results consistently, e.g. a balance that does not read zero when empty. Random errors vary unpredictably, e.g. small reaction-time differences when operating a stopwatch.

**10.** Mean = (6.2 + 6.3 + 6.1 + 6.2 + 6.2)/5 = **6.2 cm**. Range = 6.3 − 6.1 = **0.2 cm**.

**11.** Absolute error = |194 − 200| = **6 g**. Percentage error = (6/200) × 100 = **3%**.

**12.** Zero error is systematic. Repeating the measurement with the same incorrectly zeroed instrument repeats the bias; the instrument must be corrected or recalibrated.

**13.** Volume = 50 − 30 = **20 cm³**. Density = 54/20 = **2.7 g cm⁻³**.

**14.** A micrometer has a much smaller least count than a typical metre rule and its ratchet helps apply a consistent measuring force, making it more suitable for small diameters.

**15.** Any four: read the bottom of the meniscus at eye level; record initial level first; lower the object gently; fully submerge it; remove air bubbles; avoid splashing; ensure the object does not dissolve or absorb significant water.

## Further reading and scientific references
The explanations in this original lesson are informed by established measurement standards and physics principles. Consult these authoritative references for deeper study:

- National Institute of Standards and Technology (NIST), **SI Units and writing with the SI**: https://www.nist.gov/pml/owm/metric-si/si-units
- NIST, **Guide for the Use of the International System of Units (SI)**: https://www.nist.gov/pml/special-publication-811
- Bureau International des Poids et Mesures (BIPM), **The International System of Units (SI Brochure)**: https://www.bipm.org/en/publications/si-brochure
- OpenStax, **University Physics, Volume 1**: https://openstax.org/details/books/university-physics-volume-1

Always follow the instrument specification and the practical conventions stated in your WASSCE question or laboratory instructions.