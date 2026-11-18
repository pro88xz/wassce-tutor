-- 2026-11-18 · Fuller cards for two tutors, with their permission (31).
-- Run after 30. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- Nicholas Norman and Mohamed Bangura agreed (to the founder, on WhatsApp,
-- 18 November 2026) to have their cards rewritten so their pages are easier
-- to find. The new text uses only what they had already given: their
-- subjects, experience, teaching style, qualifications and lessons a week.
-- No school, result or area was added. They can change any of it on their
-- dashboard (My card).
--
-- Each update applies only if the card still has the text it had when this
-- was written (md5 below), so an edit the tutor made in the meantime is
-- never overwritten.

begin;

-- Nicholas Norman: biography from his card and the skills he listed under
-- qualifications; qualifications tidied to the diploma itself; name in the
-- usual capitals.
update public.tutors
   set full_name = 'Nicholas Norman',
       bio = 'I am a dedicated teacher with three years of experience teaching the Commercial stream in Freetown. I prepare students for WASSCE in Business Management, Economics, Commerce, English Language and ICT / Computer Studies.'
             || E'\n\n' ||
             'My lessons are built on student participation: practical examples, group discussions and plenty of questions, so every student learns to think critically and explain their answers. I keep good discipline and a clear routine, with a short assignment after every lesson and regular presentations, so you can see your progress week by week.'
             || E'\n\n' ||
             'My strengths are clear communication, classroom management and problem solving, and building a good working relationship with every student.',
       qualifications = 'Higher National Diploma in Business Administration, Freetown Polytechnic Institute',
       updated_at = now()
 where slug = 'nicholas-norman'
   and md5(bio) = '75973f3c2f039aebd4170662795db6e4'
   and md5(qualifications) = '24e700584ed9a596495a7ac5ed73aff6';

-- Mohamed Bangura: his own words kept (spelling corrected), with his
-- subjects, experience, lessons a week and his role as a lesson reviewer.
update public.tutors
   set bio = 'I teach WASSCE Physics, Chemistry, Biology and Geography in Freetown, and I have two years of teaching experience. I teach with compassion and calm, so students feel free to ask questions, and my lessons are interactive and fun: you will love them.'
             || E'\n\n' ||
             'I offer four Physics lessons a week, and three a week for Chemistry, Biology and Geography, in person at your home or a place near you. Lessons follow the WASSCE syllabus topic by topic, and I review WASSCE Tutor lessons in Physics, Biology and Geography.',
       qualifications = 'BSc in Computer Science',
       updated_at = now()
 where slug = 'mohamed-bangura'
   and md5(bio) = 'ef8ee6963e4ac41684104ce8cebfe011'
   and md5(qualifications) = '579c43434854695e649b64f0ebad5032';

commit;
