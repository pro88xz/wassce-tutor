"""English Language set 4: three original passages with 18 comprehension and summary questions.

Written by WASSCE Tutor. The passages and questions are original; nothing is
copied from a WAEC paper. WASSCE comprehension and summary are written-answer
questions on Paper 2. These objective versions practise the same skills:
finding facts, making inferences, meaning in context, grammatical names, tone
and attitude, and picking out main points for a summary. Every answer can be
checked against a sentence in its passage; an editor checked that exactly one
option is supported. See SCOPE.md.

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

from qbank import Q, Wrong

TOPICS = {
    "Answering Comprehension Questions": "Comprehension: facts, inferences, meaning in context and grammatical names from a passage",
    "Tone and Attitude in Comprehension": "Comprehension: the writer's tone, attitude, purpose and mood",
    "Summary Writing": "Summary: identifying main points and leaving out examples and detail",
}

PASSAGES = {
    "Answering Comprehension Questions": {
        "title": "The new footbridge",
        "text": """
For as long as anyone in Mafora could remember, the only way to the secondary school on the other side of the river was a narrow bridge of palm logs. Every rainy season the water rose, the logs grew slippery, and parents waited anxiously on the bank until their children came home. Then, one stormy night in August, the river carried the old bridge away completely.

The next morning, nobody went to school. The older pupils stood at the water's edge, staring at the broken ends of rope where the bridge had been. Some of the younger children were secretly pleased, but Mr Kamara, the Mathematics teacher, was not. "Your examinations will not wait for the river to fall," he told the pupils who gathered round him. "If we wait for help from outside, we may be waiting until the dry season."

That evening he called a meeting under the cotton tree. The chief listened carefully, the elders argued for a long time, and at last everyone agreed on a plan. The men would cut strong timber from the forest, the women would cook for the workers, and the older pupils, who knew a little about measurement from their lessons, would help Mr Kamara mark out where each post should stand.

The work was hard and slow. Twice the current swept away a post before it could be fixed, and twice the workers waded back into the cold water to try again. Yet nobody gave up. Even the children who had been glad to miss school carried stones to steady the posts.

After three weeks, the new bridge stood high above the water, wider and stronger than the old one. On the morning it opened, the chief walked across first, followed by a long line of pupils in their uniforms. Mr Kamara came last. When someone asked him why he looked so pleased, he smiled. "Today the whole village has passed an examination," he said, "and nobody failed."
""",
    },
    "Tone and Attitude in Comprehension": {
        "title": "A letter to my grandchildren",
        "text": """
When I was your age, a book was a treasure. My father kept his three books in a tin box under his bed, away from the rain and the rats, and I was allowed to read them only after my chores were done. I read them so many times that I could recite whole pages, and I still remember how proud I felt when I finished the longest one.

Today you have more books on one small phone than my whole village had in a lifetime. And what do you do with this wonderful library? You watch other people dance. You send pictures of your lunch to friends who are sitting beside you. Truly, my generation must look very foolish to you: we walked miles to borrow a book that you can now ignore for free.

Do not misunderstand me. I am not angry with the phone, any more than I am angry with the hoe. A hoe in idle hands clears no farm, and a phone in idle hands fills no mind. The fault is not in the tool but in how we choose to use it.

So I will make you an offer. For every book you finish this holiday, I will buy you a bag of groundnuts from Mama Fatu's stall, and I will listen while you tell me the story. I suspect you will find, as I did, that a good story is sweeter than any groundnut.

I believe in you. The same hands that scroll so quickly can turn pages just as fast, and the same eyes that never tire of videos can learn to love words. Start tonight. The tin box is open.
""",
    },
    "Summary Writing": {
        "title": "Making revision count",
        "text": """
Many candidates spend long hours with their books and still feel unprepared on the day of the examination. The problem is usually not how much they revise, but how they do it. A few simple habits can make the same hours far more useful.

First, plan your revision instead of reading whatever you happen to pick up. Divide the weeks before the examination among your subjects, and give more time to the topics you find difficult. A candidate who writes a timetable on the back of an exercise book and sticks to it will cover far more than one who revises at random.

Second, test yourself rather than simply rereading your notes. Reading a page several times makes it feel familiar, but familiarity is not the same as memory. Close the book and write down what you remember, or answer practice questions, then check what you missed. My cousin Ibrahim, who failed Chemistry once, passed it with a credit after he started covering his notes and explaining each topic aloud to his younger sister.

Third, revise in short sessions with breaks. The mind tires, and after a long stretch without rest most people stop taking in new information. A short walk, a glass of water or a few minutes of helping at home will send you back to your desk refreshed.

Finally, look after your body. Candidates who stay up all night before a paper often cannot remember what they know when they need it most. Regular meals and enough sleep are part of revision, not a distraction from it.
""",
    },
}


def mc(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str) -> Q:
    """A four-option item on its topic's passage. `wrong` is (option, why it is not supported)."""
    return Q(
        id=id,
        topic=topic,
        ref=TOPICS[topic],
        stem=stem,
        answer=(answer, answer),
        wrong=[Wrong(text, text, why) for text, why in wrong],
        solve=lambda a=answer: a,  # checked against the passage by an editor
        working=working,
    )


C = "Answering Comprehension Questions"
T = "Tone and Attitude in Comprehension"
S = "Summary Writing"

QUESTIONS = [
    # ── The new footbridge ─────────────────────────────────────────────────
    mc("eng-comp-01", C,
       "According to the passage, why did nobody go to school on the morning after the storm?",
       "The river had carried the bridge away.",
       [("The school had been flooded.", "The passage never says the school was flooded; it was the bridge that was lost."),
        ("Mr Kamara had cancelled lessons.", "Mr Kamara wanted the pupils back at school as soon as possible."),
        ("The chief had closed the school.", "The chief is not mentioned until the meeting that evening.")],
       "The first paragraph ends: *the river carried the old bridge away completely*. With no bridge, the pupils could not cross to the school."),
    mc("eng-comp-02", C,
       "Why were some of the younger children *secretly pleased*?",
       "They were glad to miss school.",
       [("They wanted a new bridge to be built.", "At that point nobody had suggested building a new bridge."),
        ("They enjoyed playing in the river.", "The passage does not mention playing in the river."),
        ("Their parents had promised them a reward.", "No reward is mentioned anywhere in the passage.")],
       "The fourth paragraph refers back to them as *the children who had been glad to miss school*."),
    mc("eng-comp-03", C,
       "Which word or phrase can best replace *anxiously* as it is used in the first paragraph?",
       "with worry",
       [("with excitement", "The parents were afraid for their children on a slippery bridge, not excited."),
        ("patiently", "*Patiently* describes calm waiting; *anxiously* describes worried waiting."),
        ("angrily", "Nothing suggests the parents were angry.")],
       "The parents waited while their children crossed slippery logs over a rising river: *anxiously* means *with worry*."),
    mc("eng-comp-04", C,
       "What is the grammatical name of the expression *If we wait for help from outside*, as it is used in the second paragraph?",
       "adverbial clause of condition",
       [("noun clause", "It is not the subject or object of a verb; it sets a condition."),
        ("adjectival clause", "It does not describe a noun."),
        ("adverbial phrase of time", "It has a subject (*we*) and a finite verb (*wait*), so it is a clause, and it states a condition, not a time.")],
       "The clause begins with *if*, has its own subject and verb, and states the condition on which the main clause (*we may be waiting until the dry season*) depends."),
    mc("eng-comp-05", C,
       "What part did the older pupils play in building the bridge?",
       "They helped to mark out where the posts should stand.",
       [("They cut timber from the forest.", "The passage gives that job to the men."),
        ("They cooked for the workers.", "The passage gives that job to the women."),
        ("They walked across the bridge first.", "The chief walked across first, on the morning it opened.")],
       "The third paragraph says the older pupils *would help Mr Kamara mark out where each post should stand*."),
    mc("eng-comp-06", C,
       "What does Mr Kamara mean when he says that *the whole village has passed an examination*?",
       "The village succeeded at a hard test by working together.",
       [("Everyone in the village sat an examination.", "He is speaking figuratively; nobody sat a written examination."),
        ("The pupils had passed their Mathematics examination.", "No examination results are mentioned."),
        ("The chief had set the village a test.", "The *test* was the lost bridge, not something the chief set.")],
       "He uses *examination* figuratively: rebuilding the bridge was a hard test, and because everyone helped (*nobody failed*), the village passed it."),

    # ── A letter to my grandchildren ───────────────────────────────────────
    mc("eng-tone-01", T,
       "What is the writer's tone in the second paragraph?",
       "sarcastic",
       [("admiring", "He does not admire how the phones are used; he mocks it."),
        ("fearful", "Nothing in the paragraph shows fear."),
        ("neutral", "Phrases such as *Truly, my generation must look very foolish to you* are far from neutral.")],
       "He says the opposite of what he means: *my generation must look very foolish to you* really means that wasting a phone full of books is foolish. Saying the opposite to mock is sarcasm."),
    mc("eng-tone-02", T,
       "What is the writer's attitude to the phone itself, in the third paragraph?",
       "It is a tool that can be used well or badly.",
       [("Phones should be banned.", "He says *I am not angry with the phone*."),
        ("Phones are more useful than books.", "He does not compare their usefulness; he wants phones used for reading."),
        ("He is afraid of new technology.", "He describes the phone as *this wonderful library*, which is not fear.")],
       "*The fault is not in the tool but in how we choose to use it*: like a hoe, a phone is only as good as the hands that hold it."),
    mc("eng-tone-03", T,
       "What is the writer's main purpose in the passage?",
       "to encourage his grandchildren to read books",
       [("to describe life in his village", "The village is mentioned only to compare it with today."),
        ("to persuade them to stop using phones", "He blames how phones are used, not the phones, and wants the same hands to *turn pages*."),
        ("to advertise Mama Fatu's stall", "The groundnuts are a reward for reading, not the point of the letter.")],
       "Everything builds towards reading: the treasured books of his youth, the wasted library on the phone, the groundnut offer, and *Start tonight*."),
    mc("eng-tone-04", T,
       "Which word best describes the mood of the final paragraph?",
       "hopeful",
       [("bitter", "The sarcasm of the second paragraph has gone; he says *I believe in you*."),
        ("sorrowful", "Nothing in the paragraph expresses sadness."),
        ("indifferent", "He clearly cares: he urges them to *Start tonight*.")],
       "*I believe in you*, *can learn to love words* and *Start tonight* show confidence that the children will change: the mood is hopeful."),
    mc("eng-tone-05", T,
       "Why does the writer mention his father's tin box in the first paragraph?",
       "to show how precious books were when he was young",
       [("to show that his father was rich", "Three books in a tin box suggests books were rare, not that his father was rich."),
        ("to complain about the rats", "The rats are a detail; the point is how carefully the books were protected."),
        ("to explain where he keeps his phone", "The box held books, and the writer had no phone as a child.")],
       "The paragraph opens *a book was a treasure*; keeping three books safe from rain and rats shows how precious they were."),
    mc("eng-tone-06", T,
       "What does the writer mean by *The tin box is open*?",
       "He is inviting them to start reading.",
       [("The box has been broken by thieves.", "Nothing suggests a theft; the sentence follows *Start tonight*."),
        ("He has lost his father's books.", "An open box is an invitation, not a loss."),
        ("He wants them to put their phones in the box.", "He wants the phones used well, not locked away.")],
       "The tin box stands for books and reading. Saying it is *open* invites the grandchildren to begin, just after *Start tonight*."),

    # ── Making revision count ──────────────────────────────────────────────
    mc("eng-sum-01", S,
       "Which of the following is one of the habits the writer recommends?",
       "Test yourself instead of only rereading your notes.",
       [("Revise for as many hours as possible.", "The writer says the problem *is usually not how much they revise*."),
        ("Read each page several times until it feels familiar.", "The writer warns that *familiarity is not the same as memory*."),
        ("Stay up late before each paper.", "The writer warns against staying up all night.")],
       "The third paragraph begins: *Second, test yourself rather than simply rereading your notes*."),
    mc("eng-sum-02", S,
       "Which sentence best summarises the second paragraph?",
       "Plan your revision, giving more time to difficult topics.",
       [("Write your timetable on the back of an exercise book.", "This is an example of planning, not the main point."),
        ("Revise whatever you happen to pick up.", "The writer advises against this."),
        ("Give every subject exactly the same amount of time.", "The writer says to give *more time to the topics you find difficult*.")],
       "The paragraph's main point is in its first two sentences: plan your revision, and give more time to difficult topics. The timetable is an illustration."),
    mc("eng-sum-03", S,
       "In a summary of the writer's advice, which of these should be left out because it is an example, not a main point?",
       "Ibrahim passed Chemistry after explaining topics aloud to his sister.",
       [("Revise in short sessions with breaks.", "This is the main point of the fourth paragraph."),
        ("Look after your body by eating well and sleeping enough.", "This is the main point of the last paragraph."),
        ("Plan your revision.", "This is the main point of the second paragraph.")],
       "A summary keeps the main points and drops illustrations. Cousin Ibrahim's story only supports the point about testing yourself."),
    mc("eng-sum-04", S,
       "How many main habits does the writer recommend?",
       "four",
       [("two", "The writer lists more than two: count *First*, *Second*, *Third* and *Finally*."),
        ("three", "*Finally* introduces a fourth habit."),
        ("five", "The first paragraph only introduces the topic; it is not a habit.")],
       "The habits are signposted: *First* (plan), *Second* (test yourself), *Third* (short sessions with breaks), *Finally* (look after your body)."),
    mc("eng-sum-05", S,
       "Which sentence best states the main idea of the whole passage?",
       "How you revise matters more than how long you revise.",
       [("Candidates should revise for longer hours.", "The writer says the problem is *not how much they revise*."),
        ("Sleep is more important than revision.", "The writer calls sleep *part of revision*, not more important than it."),
        ("Testing yourself is the only way to pass.", "Testing yourself is one of four habits, not the only one.")],
       "The first paragraph states the main idea: *The problem is usually not how much they revise, but how they do it*."),
    mc("eng-sum-06", S,
       "Which of the following is NOT one of the writer's recommendations?",
       "Revise with friends in a study group.",
       [("Plan your revision.", "This is the first habit the writer recommends."),
        ("Take short breaks while revising.", "This is the third habit."),
        ("Eat regular meals and get enough sleep.", "This is the last habit.")],
       "Study groups are never mentioned. The four recommendations are planning, testing yourself, short sessions with breaks, and looking after your body."),
]
