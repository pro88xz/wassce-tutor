/** `value` as a whole-number percentage of `max`, kept between 0 and 100 (0 when `max` is 0). */
export const percent = (value: number, max: number) => (max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0)
