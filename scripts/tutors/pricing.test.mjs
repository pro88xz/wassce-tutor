// The tutor price shown before a student agrees must match what the database
// charges (request_tutor(), migration 19). These cases are the same as the
// database tests. Run: npm run tutors:test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { quote, nle, listText, paymentText } from '../../src/lib/tutor-pricing.ts'

const offer = { multiSubjectDiscountPct: 10, groupMax: 4, groupDiscountPct: 15 }
const biology = { price: 150, lessonsPerWeek: 2 }
const chemistry = { price: 180, lessonsPerWeek: 2 }

test('one subject, one student: the fee as set', () => {
  const q = quote([biology], offer, 1)
  assert.equal(q.perStudent, 150)
  assert.equal(q.total, 150)
  assert.equal(q.subjectDiscountPct, 0)
  assert.equal(q.groupDiscountPct, 0)
  assert.equal(q.saving, 0)
})

test('two subjects: 150 + 180 = 330, 10% off = 297', () => {
  const q = quote([biology, chemistry], offer, 1)
  assert.deepEqual([q.subtotal, q.perStudent, q.total, q.saving, q.subjectDiscountPct], [330, 297, 297, 33, 10])
})

test('group of 3, two subjects: 252.45 rounds to 252 each, 756 in total', () => {
  const q = quote([biology, chemistry], offer, 3)
  assert.deepEqual([q.perStudent, q.total, q.groupDiscountPct], [252, 756, 15])
})

test('one subject, pair: 127.5 rounds up to 128 each, no subject discount', () => {
  const q = quote([biology], offer, 2)
  assert.deepEqual([q.perStudent, q.total, q.subjectDiscountPct], [128, 256, 0])
})

test('fees with cents are exact (no floating-point drift)', () => {
  assert.equal(quote([{ price: 0.1, lessonsPerWeek: 1 }, { price: 0.2, lessonsPerWeek: 1 }], { multiSubjectDiscountPct: 0, groupMax: null, groupDiscountPct: 0 }).subtotal, 0.3)
  assert.equal(quote([{ price: 165, lessonsPerWeek: 1 }], { multiSubjectDiscountPct: 0, groupMax: 2, groupDiscountPct: 10 }, 2).perStudent, 149) // 148.5 -> 149
})

test('cost of a lesson: 4 lessons a week, NLe 297 a month is about NLe 17', () => {
  assert.equal(quote([biology, chemistry], offer).lessonsPerWeek, 4)
  assert.equal(quote([biology, chemistry], offer).perLesson, 17)
  assert.equal(quote([{ price: 150, lessonsPerWeek: null }], offer).perLesson, null)
})

test('wording', () => {
  assert.equal(nle(1250), 'NLe 1,250')
  assert.equal(nle(12.5), 'NLe 12.50')
  assert.equal(listText(['Biology', 'Chemistry', 'Physics']), 'Biology, Chemistry and Physics')
  assert.equal(paymentText(['cash', 'orange_money']), 'Orange Money or cash')
  assert.equal(paymentText(['orange_money', 'afrimoney', 'cash']), 'Orange Money, Afrimoney or cash')
  assert.equal(paymentText([]), null)
})
