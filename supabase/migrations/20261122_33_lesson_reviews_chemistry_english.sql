-- 2026-11-22 · Record more lesson reviews by the tutors (33).
-- Run after 32. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- After migration 30 (the first 10 live topics of each reviewer's subjects),
-- two reviewers read and approved more topics:
--   - John Kaitibie: Chemistry topics 11 to 48, every remaining live topic.
--   - Nicholas Norman: English Language topics 11 to 31, Conjunctions to
--     Summary Writing.
-- Topics are numbered as the subject page lists them; each is named below so
-- the record says exactly what was approved. This records the approvals the
-- same way the Review screen does: every published lesson in those topics gets
-- reviewed_at and reviewed_by, so it says "Reviewed by" the tutor with a link
-- to their page. A lesson already reviewed is never changed. A reviewer who is
-- not an active reviewer, or a topic name that does not exist, stops the
-- migration and changes nothing.
--
-- To undo one batch: update public.lessons set reviewed_at = null,
-- reviewed_by = null where reviewed_by = (select user_id from public.tutors
-- where slug = '<slug>') and topic_id in (<the topics below>);

begin;

do $$
declare
  v_batches jsonb := '[
    {"tutor": "john-kaitibie", "subject": "chemistry", "topics": [
      "empirical-and-molecular-formulas", "acids-bases-and-ph", "salts-and-their-preparation",
      "acid-base-titration", "water-and-its-properties", "solutions-and-solubility",
      "oxidation-and-reduction-reactions", "electrolysis", "electrochemical-cells",
      "energy-changes-in-reactions", "rate-of-reaction", "chemical-equilibrium", "hydrogen",
      "oxygen-and-air", "the-halogens", "nitrogen-and-its-compounds", "sulphur-and-its-compounds",
      "carbon-and-its-inorganic-compounds", "reactivity-series-and-extraction-of-metals",
      "alkali-metals", "alkaline-earth-metals", "aluminium-and-group-iii-metals",
      "iron-and-other-transition-metals", "industrial-chemical-processes",
      "introduction-to-organic-chemistry", "alkanes", "alkenes", "alkynes",
      "petroleum-and-petrochemicals", "alkanols", "alkanoic-acids", "alkanoates-and-esters",
      "soaps-detergents-and-oils", "carbohydrates", "proteins-and-amino-acids",
      "polymers-and-plastics", "chemistry-and-the-environment", "practical-chemistry-skills"]},
    {"tutor": "nicholas-norman", "subject": "english-language", "topics": [
      "conjunctions", "articles", "subject-verb-agreement", "direct-and-reported-speech",
      "question-tags", "modal-verbs", "conditionals", "phrases-and-clauses", "sentence-types",
      "punctuation", "common-confusable-words", "synonyms-and-antonyms",
      "homonyms-and-homophones", "idioms-and-idiomatic-expressions", "figures-of-speech",
      "word-formation", "vocabulary-in-context", "literal-and-inferential-comprehension",
      "approaching-a-comprehension-passage", "tone-and-attitude-in-comprehension",
      "summary-writing"]}
  ]';
  v_batch jsonb;
  v_user uuid;
  v_missing text[];
  v_count integer;
begin
  foreach v_batch in array array(select jsonb_array_elements(v_batches)) loop
    v_user := null;
    select t.user_id into v_user
      from public.tutors t
     where t.slug = v_batch->>'tutor' and t.status = 'active' and t.reviewer;
    if v_user is null then
      raise exception '%: not an active reviewer', v_batch->>'tutor';
    end if;

    select array_agg(wanted.topic_slug) into v_missing
      from jsonb_array_elements_text(v_batch->'topics') as wanted(topic_slug)
     where not exists (
             select 1 from public.topics tp join public.subjects s on s.id = tp.subject_id
              where s.slug = v_batch->>'subject' and tp.slug = wanted.topic_slug);
    if v_missing is not null then
      raise exception '%: no such topics: %', v_batch->>'subject', v_missing;
    end if;

    update public.lessons l
       set reviewed_at = now(), reviewed_by = v_user, is_public = true, updated_at = now()
      from public.topics tp
      join public.subjects s on s.id = tp.subject_id
     where l.topic_id = tp.id
       and s.slug = v_batch->>'subject'
       and tp.slug in (select listed.topic_slug from jsonb_array_elements_text(v_batch->'topics') as listed(topic_slug))
       and l.is_published
       and l.reviewed_at is null;
    get diagnostics v_count = row_count;
    raise notice '% (%): % lessons recorded as reviewed', v_batch->>'tutor', v_batch->>'subject', v_count;
  end loop;
end $$;

commit;
