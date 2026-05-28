-- ============================================================
-- Sample paper: Mathematics Practice Set 1 (real WASSCE-style MCQs)
-- ============================================================
do $$
declare
  v_subject_id uuid;
  v_paper_id   uuid;
  v_q          uuid;
begin
  select id into v_subject_id from public.subjects where slug = 'mathematics';

  insert into public.papers (subject_id, title, year, paper_type, description, question_count, sort_order)
  values (v_subject_id, 'Mathematics Practice Set 1', 2024, 'Practice', 'Core algebra, fractions and percentages.', 5, 1)
  returning id into v_paper_id;

  -- Q1
  insert into public.questions (paper_id, stem, explanation, position)
  values (v_paper_id, 'Simplify: 3/4 + 1/8', 'Convert 3/4 to 6/8, then 6/8 + 1/8 = 7/8.', 1)
  returning id into v_q;
  insert into public.options (question_id, label, content, is_correct, position) values
    (v_q,'A','7/8', true, 1),
    (v_q,'B','4/12', false, 2),
    (v_q,'C','1/2', false, 3),
    (v_q,'D','5/8', false, 4);

  -- Q2
  insert into public.questions (paper_id, stem, explanation, position)
  values (v_paper_id, 'What is 25% of 240?', '25% = 1/4, and 240 ÷ 4 = 60.', 2)
  returning id into v_q;
  insert into public.options (question_id, label, content, is_correct, position) values
    (v_q,'A','40', false, 1),
    (v_q,'B','60', true, 2),
    (v_q,'C','48', false, 3),
    (v_q,'D','120', false, 4);

  -- Q3
  insert into public.questions (paper_id, stem, explanation, position)
  values (v_paper_id, 'Solve for x: 2x + 5 = 17', 'Subtract 5: 2x = 12. Divide by 2: x = 6.', 3)
  returning id into v_q;
  insert into public.options (question_id, label, content, is_correct, position) values
    (v_q,'A','x = 5', false, 1),
    (v_q,'B','x = 11', false, 2),
    (v_q,'C','x = 6', true, 3),
    (v_q,'D','x = 7', false, 4);

  -- Q4
  insert into public.questions (paper_id, stem, explanation, position)
  values (v_paper_id, 'The average of 4, 8, and 12 is:', 'Sum = 24, divided by 3 = 8.', 4)
  returning id into v_q;
  insert into public.options (question_id, label, content, is_correct, position) values
    (v_q,'A','6', false, 1),
    (v_q,'B','8', true, 2),
    (v_q,'C','12', false, 3),
    (v_q,'D','24', false, 4);

  -- Q5
  insert into public.questions (paper_id, stem, explanation, position)
  values (v_paper_id, 'If a = 3 and b = 4, find the value of a² + b².', '3² + 4² = 9 + 16 = 25.', 5)
  returning id into v_q;
  insert into public.options (question_id, label, content, is_correct, position) values
    (v_q,'A','7', false, 1),
    (v_q,'B','12', false, 2),
    (v_q,'C','25', true, 3),
    (v_q,'D','49', false, 4);
end $$;
