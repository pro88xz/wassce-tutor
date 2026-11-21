# Oral English audio: check report

Written by `scripts/audio/oral_audio.py`; do not edit by hand. Each clip is spoken by the
Kokoro voice model (Apache 2.0) in standard British English from dictionary phonemes,
then transcribed by two speech recognisers (Whisper small.en and NVIDIA Parakeet).
A clip that fails is not linked from any question. See the script for the checks.

**94 of 96 clips passed.**

## Words

| Clip | Editor's IPA | Dictionary phonemes | Voice, speed | Whisper heard | Parakeet heard | Result |
|---|---|---|---|---|---|---|
| food | /fuːd/ | fˈuːd (gold) | bf_emma, 0.9 | Food | Food | pass |
| shoe | /ʃuː/ | ʃˈuː (gold) | bf_emma, 1.0 | shoe | Shoe. | pass |
| good | /ɡʊd/ | ɡˈʊd (gold) | bf_emma, 0.9 | Good | Good. | pass |
| blood | /blʌd/ | blˈʌd (gold) | bf_emma, 0.85 | Blood | Blood. | pass |
| boat | /bəʊt/ | bˈQt (gold) | bf_emma, 0.9 | boat | Boat. | pass |
| busy | /ˈbɪzi/ | bˈɪzi (gold) | bf_emma, 0.9 | busy | Busy. | pass |
| seize | /siːz/ | sˈiːz (gold) | bf_alice, 0.85 | "A-seize!" |  | pass (one recogniser) |
| field | /fiːld/ | fˈiːld (gold) | bf_emma, 0.9 | field | Field. | pass |
| key | /kiː/ | kˈiː (gold) | bf_emma, 0.85 | Okay. | A key | pass (one recogniser) |
| mud | /mʌd/ | mˈʌd (gold) | bf_emma, 0.9 | MUD | Mud. | pass |
| road | /rəʊd/ | ɹˈQd (gold) | bf_emma, 0.9 | road | Rode | pass |
| hair | /heə/ | hˈɛː (gold) | bf_emma, 0.9 | This is... | The head. | **fail**: neither recogniser heard the word in any take |
| her | /hɜː/ | hɜː (gold) | bf_emma, 0.9 | It's her. | Huh. | **fail**: neither recogniser heard the word in any take |
| hat | /hæt/ | hˈat (gold) | bf_emma, 0.9 | A hat | The hat. | pass (one recogniser) |
| heart | /hɑːt/ | hˈɑːt (gold) | bf_emma, 0.85 | A heart. | A heart. | pass |
| about | /əˈbaʊt/ | əbˈWt (gold) | bf_emma, 1.0 | about | And about | pass (one recogniser) |
| cat | /kæt/ | kˈat (gold) | bf_emma, 1.0 | cat | Cat | pass |
| father | /ˈfɑːðə/ | fˈɑːðə (gold) | bf_emma, 1.0 | father | Father | pass |
| make | /meɪk/ | mˌAk (gold) | bf_emma, 1.0 | Make | Make | pass |
| word | /wɜːd/ | wˈɜːd (gold) | bf_emma, 0.9 | word | Word | pass |
| heard | /hɜːd/ | hˈɜːd (gold) | bf_emma, 0.9 | heard | Heard. | pass |
| ward | /wɔːd/ | wˈɔːd (gold) | bf_lily, 0.9 | WOD | Ward | pass (one recogniser) |
| wood | /wʊd/ | wˈʊd (gold) | bf_emma, 0.9 | would | Wood. | pass |
| wear | /weə/ | wˈɛː (gold) | bf_lily, 0.85 | Where's... | Where | pass (one recogniser) |
| caught | /kɔːt/ | kˈɔːt (gold) | bf_emma, 0.9 | Caught | Court | pass |
| law | /lɔː/ | lˈɔː (gold) | bf_emma, 0.85 | law | Law | pass |
| coat | /kəʊt/ | kˈQt (gold) | bf_emma, 1.0 | coat | Coat | pass |
| cot | /kɒt/ | kˈɒt (gold) | bf_isabella, 0.9 | The word is cot. | The word is God. | pass (one recogniser) (after 'The word is') |
| cut | /kʌt/ | kˈʌt (gold) | bf_emma, 0.9 | Cut | He cut. | pass (one recogniser) |
| great | /ɡreɪt/ | ɡɹˈAt (gold) | bf_emma, 1.0 | Great | Great. | pass |
| bread | /bred/ | bɹˈɛd (gold) | bf_emma, 0.9 | bread | Bread | pass |
| said | /sed/ | sˈɛd (gold) | bf_emma, 1.0 | said | Said | pass |
| thick | /θɪk/ | θˈɪk (gold) | bf_emma, 1.0 | thick | Thick. | pass |
| these | /ðiːz/ | ðiːz (gold) | bf_emma, 0.9 | These. | These | pass |
| Thomas | /ˈtɒməs/ | tˈɒməs (gold) | bf_emma, 1.0 | Thomas. | Thomas | pass |
| though | /ðəʊ/ | ðˌQ (gold) | bf_emma, 0.85 | though | Though | pass |
| television | /ˈtelɪvɪʒn/ | tˈɛlɪvˌɪʒᵊn (gold) | bf_emma, 0.9 | Television | Television | pass |
| mission | /ˈmɪʃn/ | mˈɪʃᵊn (gold) | bf_isabella, 0.85 | Mission De | Mission | pass (one recogniser) |
| nation | /ˈneɪʃn/ | nˈAʃᵊn (gold) | bf_emma, 1.0 | Nation | Nation | pass |
| pressure | /ˈpreʃə/ | pɹˈɛʃə (gold) | bf_emma, 0.9 | pressure | Pressure. | pass |
| landed | /ˈlændɪd/ | lˈandɪd (gold) | bf_emma, 0.9 | landed | Landed. | pass |
| hoped | /həʊpt/ | hˈQpt (silver) | bf_emma, 1.0 | Hoped. | I hoped it. | pass (one recogniser) |
| begged | /beɡd/ | bˈɛɡd (editor override) | bf_emma, 0.9 | begged | Begged. | pass |
| fixed | /fɪkst/ | fˈɪkst (gold) | bf_emma, 0.9 | fixed | Vexed. | pass (one recogniser) |
| judges | /ˈdʒʌdʒɪz/ | ʤˈʌʤɪz (gold) | bf_emma, 0.9 | Judges | Judges | pass |
| beds | /bedz/ | bˈɛdz (silver) | bf_emma, 0.9 | BEDS | Beds | pass |
| caps | /kæps/ | kˈaps (gold) | bf_emma, 1.0 | He caps it. | Caps. | pass (one recogniser) |
| rooms | /ruːmz/ | ɹˈuːmz (silver) | bf_emma, 0.9 | rooms | Rooms | pass |
| listen | /ˈlɪsn/ | lˈɪsᵊn (gold) | bf_emma, 0.9 | Listen. | Listen. | pass |
| lemon | /ˈlemən/ | lˈɛmən (gold) | bf_emma, 0.85 | lemon | Lemon | pass |
| limit | /ˈlɪmɪt/ | lˈɪmɪt (gold) | bf_emma, 0.9 | limit | Limit | pass |
| lentil | /ˈlentl/ | lˈɛntᵊl (editor override) | bf_emma, 0.9 | lentil | Lentil | pass |
| street | /striːt/ | stɹˈiːt (gold) | bf_emma, 0.9 | a street | A street. | pass |
| sheep | /ʃiːp/ | ʃˈiːp (gold) | bf_emma, 0.85 | A sheep. | A sheep. | pass |
| photo | /ˈfəʊtəʊ/ | fˈQtQ (gold) | bf_emma, 1.0 | photo | Photo | pass |
| think | /θɪŋk/ | θˈɪŋk (gold) | bf_emma, 1.0 | Think | Think | pass |
| chemistry | /ˈkemɪstri/ | kˈɛmɪstɹi (gold) | bf_emma, 0.9 | Chemistry | Chemistry | pass |
| church | /tʃɜːtʃ/ | ʧˈɜːʧ (gold) | bf_emma, 1.0 | church | Church | pass |
| machine | /məˈʃiːn/ | məʃˈiːn (gold) | bf_emma, 0.85 | A machine. | A machine. | pass |
| cheap | /tʃiːp/ | ʧˈiːp (gold) | bf_emma, 0.85 | A cheap | A cheap. | pass |
| shop | /ʃɒp/ | ʃˈɒp (gold) | bf_emma, 0.85 | A shop. | A shop. | pass |
| chop | /tʃɒp/ | ʧˈɒp (gold) | bf_alice, 1.0 | Job it. | Chop | pass (one recogniser) |
| measure | /ˈmeʒə/ | mˈɛʒə (gold) | bf_emma, 1.0 | We measure | Measure. | pass (one recogniser) |
| sun | /sʌn/ | sˈʌn (gold) | bf_emma, 1.0 | Sun | Son | pass |
| village | /ˈvɪlɪdʒ/ | vˈɪlɪʤ (gold) | bf_emma, 0.9 | village | Village. | pass |
| arrive | /əˈraɪv/ | əɹˈIv (gold) | bf_isabella, 0.9 | Arrive | Arrive. | pass |
| complete | /kəmˈpliːt/ | kəmplˈiːt (gold) | bf_emma, 1.0 | A complete | Complete. | pass |
| believe | /bɪˈliːv/ | bɪlˈiːv (gold) | bf_emma, 1.0 | believe | Believe. | pass |
| record (verb) | /rɪˈkɔːd/ | ɹɪkˈɔːd (gold) | bf_emma, 0.9 | record | Record. | pass |
| record (noun) | /ˈrekɔːd/ | ɹˈɛkɔːd (gold) | bf_emma, 0.9 | Record | Record | pass |
| examination | /ɪɡˌzæmɪˈneɪʃn/ | ɪɡzˌamɪnˈAʃᵊn (gold) | bf_emma, 0.9 | examination | Examination | pass |
| ability | /əˈbɪlɪti/ | əbˈɪlɪti (gold) | bf_emma, 0.9 | Ability | Ability | pass |
| photograph | /ˈfəʊtəɡrɑːf/ | fˈQtəɡɹɑːf (gold) | bf_emma, 0.9 | Photograph | Photograph | pass |
| engineer | /ˌendʒɪˈnɪə/ | ˌɛnʤɪnˈɪə (gold) | bf_emma, 0.85 | engineer | Engineer | pass |
| interesting | /ˈɪntrɪstɪŋ/ | ˈɪntɹɪstɪŋ (gold) | bf_emma, 1.0 | Interesting. | Interesting. | pass |
| volunteer | /ˌvɒlənˈtɪə/ | vˌɒləntˈɪə (gold) | bf_emma, 0.9 | Volunteer | Volunteer | pass |
| pencil | /ˈpensl/ | pˈɛnsᵊl (gold) | bf_emma, 0.9 | A pencil. | A pencil. | pass |
| calendar | /ˈkælɪndə/ | kˈalɪndə (gold) | bf_emma, 0.9 | calendar | Calendar | pass |
| family | /ˈfæmɪli/ | fˈamɪli (gold) | bf_emma, 0.9 | Family | Family. | pass |
| advertise | /ˈædvətaɪz/ | ˈadvətIz (gold) | bf_emma, 0.9 | advertise | Advertise | pass |
| develop | /dɪˈveləp/ | dɪvˈɛləp (gold) | bf_emma, 0.9 | develop | Develop | pass |
| economic | /ˌiːkəˈnɒmɪk/ | ˌiːkənˈɒmɪk (gold) | bf_emma, 1.0 | Economic | Economic | pass |
| photography | /fəˈtɒɡrəfi/ | fətˈɒɡɹəfi (gold) | bf_emma, 0.9 | Photography | Photography | pass |
| politics | /ˈpɒlɪtɪks/ | pˈɒlɪtɪks (gold) | bf_emma, 0.9 | Politics | Politics | pass |
| development | /dɪˈveləpmənt/ | dɪvˈɛləpmᵊnt (gold) | bf_emma, 0.9 | Development development | Development | pass (one recogniser) |
| begin | /bɪˈɡɪn/ | bɪɡˈɪn (gold) | bf_emma, 1.0 | Begin. | Begin. | pass |
| decide | /dɪˈsaɪd/ | dɪsˈId (gold) | bf_emma, 0.9 | Decide. | Decide | pass |
| table | /ˈteɪbl/ | tˈAbᵊl (gold) | bf_emma, 1.0 | Table | Table | pass |
| open | /ˈəʊpən/ | ˈQpᵊn (gold) | bf_emma, 1.0 | Open | Open | pass |
| market | /ˈmɑːkɪt/ | mˈɑːkɪt (gold) | bf_emma, 0.9 | market | Market | pass |

## Passages

### eng-lis-02: pass (5.54 s)

- **Narrator** (bf_emma, speed 0.9): Many people think the market opens at eight o'clock. However, it actually opens at nine.
  - Whisper: Many people think the market opens at 8 o'clock, however it actually opens at 9.
  - Parakeet: Many people think the market opens at 8 o'clock, however, it actually opens at 9.
  - Word error rates: [0.0, 0.0]

### eng-lis-03: pass (13.29 s)

- **Man** (bm_george, speed 0.9): Take two tablets three times a day, after meals, and finish the whole course.
  - Whisper: Take two tablets three times a day after meals and finish the whole course.
  - Parakeet: Take two tablets three times a day after meals and finish the whole course.
  - Word error rates: [0.0, 0.0]
- **Woman** (bf_emma, speed 0.9): Even if I feel better after two days?
  - Whisper: Even if I feel better after two days.
  - Parakeet: Even if I feel better after two days.
  - Word error rates: [0.0, 0.0]
- **Man** (bm_george, speed 0.9): Yes, even then. And come back if the fever returns.
  - Whisper: Yes, even then, and come back if the fever returns.
  - Parakeet: Yes, even then, and come back if the fever returns.
  - Word error rates: [0.0, 0.0]

### eng-lis-04: pass (11.54 s)

- **Man** (bm_george, speed 0.9): How much are the oranges?
  - Whisper: How much are the oranges?
  - Parakeet: How much are the oranges?
  - Word error rates: [0.0, 0.0]
- **Woman** (bf_emma, speed 0.9): Twenty new leones for ten.
  - Whisper: 20 newly owns for 10
  - Parakeet: 20 newly owns for 10.
  - Word error rates: [0.0, 0.0]
- **Man** (bm_george, speed 0.9): I'll take twenty, and that pineapple.
  - Whisper: I'll take 20 and that pineapple.
  - Parakeet: I'll take twenty, and that pineapple.
  - Word error rates: [0.0, 0.0]
- **Woman** (bf_emma, speed 0.9): The pineapple is fifteen new leones.
  - Whisper: The pineapple is 15 newly owns.
  - Parakeet: The pineapple is 15 newly owns.
  - Word error rates: [0.0, 0.0]

### eng-lis-05: pass (4.55 s)

- **Narrator** (bf_emma, speed 0.9): Well... I suppose I could help you move on Saturday, if there's really nobody else.
  - Whisper: Well, I suppose I could help you move on Saturday if there's really nobody else.
  - Parakeet: Well, I suppose I could help you move on Saturday, if there's really nobody else.
  - Word error rates: [0.0, 0.0]

### eng-lis-06: pass (7.73 s)

- **Narrator** (bf_emma, speed 0.9): Last year, three pupils from this very school were injured crossing the highway. That is why we are asking the council to build a footbridge.
  - Whisper: Last year, three pupils from this very school were injured crossing the highway. That is why we are asking the council to build a footbridge.
  - Parakeet: Last year, three pupils from this very school were injured crossing the highway. That is why we are asking the council to build a footbridge.
  - Word error rates: [0.0, 0.0]

### eng-lis-07: pass (11.74 s)

- **Narrator** (bf_emma, speed 0.9): Good morning. From Monday, the library will open at eight o'clock instead of nine, and close at six. Pupils may now borrow three books at a time instead of two, and books may be kept for two weeks.
  - Whisper: Good morning. From Monday, the library will open at eight o'clock instead of nine, and close at six. Pupils may now borrow three books at a time instead of two, and books may be kept for two weeks.
  - Parakeet: Good morning. From Monday, the library will open at eight o'clock instead of nine, and close at six. Pupils may now borrow three books at a time instead of two, and books may be kept for two weeks.
  - Word error rates: [0.0, 0.0]
