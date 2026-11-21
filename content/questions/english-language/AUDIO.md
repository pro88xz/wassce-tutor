# Oral English audio: check report

Written by `scripts/audio/oral_audio.py`; do not edit by hand. Each clip is spoken by the
Kokoro voice model (Apache 2.0) in standard British English from dictionary phonemes,
then transcribed by two speech recognisers (Whisper small.en and NVIDIA Parakeet).
A clip that fails is not linked from any question. See the script for the checks.

**212 of 214 clips passed.**

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
| pig | /pɪɡ/ | pˈɪɡ (gold) | bf_emma, 0.9 | The word is pig. | The word is pig. | pass (after 'The word is') |
| big | /bɪɡ/ | bˈɪɡ (gold) | bf_emma, 0.9 | big | Big. | pass |
| town | /taʊn/ | tˈWn (gold) | bf_emma, 1.0 | TOWN | Town | pass |
| down | /daʊn/ | dˌWn (gold) | bf_emma, 1.0 | down | Down. | pass |
| goat | /ɡəʊt/ | ɡˈQt (gold) | bf_emma, 0.9 | goat | Goat. | pass |
| fan | /fæn/ | fˈan (gold) | bf_emma, 1.0 | fan | Fun. | pass (one recogniser) |
| van | /væn/ | vˈan (gold) | bf_emma, 1.0 | Van | Then | pass (one recogniser) |
| thin | /θɪn/ | θˈɪn (gold) | bf_emma, 1.0 | thin | Thin | pass |
| this | /ðɪs/ | ðɪs (gold) | bf_emma, 0.9 | this | This | pass |
| price | /praɪs/ | pɹˈIs (gold) | bf_emma, 1.0 | price | Price | pass |
| prize | /praɪz/ | pɹˈIz (gold) | bf_emma, 0.9 | prize | Prize | pass |
| vision | /ˈvɪʒn/ | vˈɪʒᵊn (gold) | bf_emma, 0.9 | Vision | Vision | pass |
| jeep | /dʒiːp/ | ʤˈiːp (gold) | bf_emma, 0.9 | Jeep | Jeep | pass |
| man | /mæn/ | mˈan (gold) | bf_isabella, 0.85 | man-sy | Man | pass (one recogniser) |
| knife | /naɪf/ | nˈIf (gold) | bf_emma, 0.85 | Knife | Knife | pass |
| sing | /sɪŋ/ | sˈɪŋ (gold) | bf_emma, 0.9 | A sing. | Sing | pass |
| leg | /leɡ/ | lˈɛɡ (gold) | bf_emma, 0.9 | leg | Leg | pass |
| red | /red/ | ɹˈɛd (gold) | bf_emma, 0.9 | red | Red | pass |
| wet | /wet/ | wˈɛt (gold) | bf_emma, 1.0 | Wet | Wet | pass |
| yes | /jes/ | jˈɛs (gold) | bf_emma, 0.9 | Yes. | Yes. | pass |
| tin | /tɪn/ | tˈɪn (gold) | bf_emma, 1.0 | Tin | Tin. | pass |
| three | /θriː/ | θɹˈiː (gold) | bf_emma, 0.85 | A three | A three. | pass |
| tree | /triː/ | tɹˈiː (gold) | bf_isabella, 0.9 | tree | Tree | pass |
| they | /ðeɪ/ | ðA (gold) | bf_emma, 1.0 | They | They. | pass |
| day | /deɪ/ | dˈA (gold) | bf_emma, 1.0 | day | Day | pass |
| then | /ðen/ | ðˈɛn (gold) | bf_emma, 0.9 | then | Then | pass |
| den | /den/ | dˈɛn (gold) | bf_emma, 0.9 | den | The den | pass (one recogniser) |
| pleasure | /ˈpleʒə/ | plˈɛʒə (gold) | bf_emma, 0.85 | A pleasure | A pleasure. | pass |
| test | /test/ | tˈɛst (gold) | bf_emma, 0.9 | Test | Test. | pass |
| desk | /desk/ | dˈɛsk (gold) | bf_emma, 0.9 | desk | Desk | pass |
| chew | /tʃuː/ | ʧˈuː (gold) | bf_emma, 0.85 | Dachu | A chew. | pass (one recogniser) |
| share | /ʃeə/ | ʃˈɛː (gold) | bf_lily, 0.85 | share | Cheryl | pass (one recogniser) |
| chair | /tʃeə/ | ʧˈɛː (gold) | bf_emma, 1.0 | c'est | Chair | pass (one recogniser) |
| sign | /saɪn/ | sˈIn (gold) | bf_emma, 1.0 | sign | Sign | pass |
| island | /ˈaɪlənd/ | ˈIlənd (gold) | bf_emma, 0.9 | Islander | Island | pass (one recogniser) |
| wanted | /ˈwɒntɪd/ | wˈɒntɪd (silver) | bf_emma, 0.9 | Wanted | Wanted. | pass |
| needed | /ˈniːdɪd/ | nˈiːdɪd (silver) | bf_emma, 0.9 | needed | Needed. | pass |
| walked | /wɔːkt/ | wˈɔːkt (silver) | bf_emma, 0.9 | We worked. | Walked. | pass (one recogniser) |
| stopped | /stɒpt/ | stˈɒpt (silver) | bf_emma, 1.0 | Stopped. | They stopped. | pass (one recogniser) |
| played | /pleɪd/ | plˈAd (silver) | bf_emma, 0.9 | A played | A played. | pass |
| rained | /reɪnd/ | ɹˈAnd (silver) | bf_emma, 0.9 | rained | Rained. | pass |
| waited | /ˈweɪtɪd/ | wˈAtɪd (silver) | bf_emma, 0.9 | Waited | Waited. | pass |
| jumped | /dʒʌmpt/ | ʤˈʌmpt (silver) | bf_emma, 1.0 | jumped | Jumped a | pass (one recogniser) |
| cried | /kraɪd/ | kɹˈId (gold) | bf_emma, 1.0 | cried. | Cried. | pass |
| washed | /wɒʃt/ | wˈɒʃt (silver) | bf_emma, 0.9 | Washed. | Washed. | pass |
| buses | /ˈbʌsɪz/ | bˈʌsɪz (silver) | bf_emma, 0.9 | Buses | Buses | pass |
| roses | /ˈrəʊzɪz/ | ɹˈQzɪz (silver) | bf_emma, 0.9 | roses | Roses | pass |
| cats | /kæts/ | kˈats (silver) | bf_isabella, 1.0 | cats | Cats | pass |
| books | /bʊks/ | bˈʊks (silver) | bf_emma, 0.9 | Books. | Books. | pass |
| dogs | /dɒɡz/ | dˈɒɡz (silver) | bf_emma, 0.9 | Dogs. | Dogs | pass |
| days | /deɪz/ | dˈAz (silver) | bf_emma, 0.9 | Days | Days | pass |
| write | /raɪt/ | ɹˈIt (gold) | bf_isabella, 1.0 | Write | Right. | pass (one recogniser) |
| climb | /klaɪm/ | klˈIm (gold) | bf_emma, 1.0 | Climb | The climb. | pass (one recogniser) |
| hour | /ˈaʊə/ | ˈWə (gold) | bf_emma, 1.0 | hour | Owet | pass (one recogniser) |
| psychology | /saɪˈkɒlədʒi/ | sIkˈɒləʤi (gold) | bf_emma, 1.0 | Psychology | Psychology | pass |
| seat | /siːt/ | sˈiːt (gold) | bf_emma, 0.9 | a seat | A seat. | pass |
| sit | /sɪt/ | sˈɪt (gold) | bf_emma, 0.9 | Sit | That's it. | pass (one recogniser) |
| bed | /bed/ | bˈɛd (gold) | bf_emma, 0.9 | bed | Bed. | pass |
| cart | /kɑːt/ | kˈɑːt (gold) | bf_isabella, 0.9 | CART | Cart. | pass |
| pot | /pɒt/ | pˈɒt (gold) | bf_emma, 0.9 | The word is pot. | The word is put. | pass (one recogniser) (after 'The word is') |
| wash | /wɒʃ/ | wˈɒʃ (gold) | bf_emma, 0.9 | WASH | Wash. | pass |
| port | /pɔːt/ | pˈɔːt (gold) | bf_emma, 1.0 | Port | Part | pass (one recogniser) |
| book | /bʊk/ | bˈʊk (gold) | bf_emma, 0.9 | book | Book. | pass |
| put | /pʊt/ | pˌʊt (gold) | bf_emma, 0.9 | Put | But | pass (one recogniser) |
| bird | /bɜːd/ | bˈɜːd (gold) | bf_emma, 0.9 | bird | Bird | pass |
| teacher | /ˈtiːtʃə/ | tˈiːʧə (gold) | bf_emma, 0.85 | A teacher | A teacher | pass |
| time | /taɪm/ | tˈIm (gold) | bf_emma, 0.9 | Time. | Time. | pass |
| my | /maɪ/ | mI (gold) | bf_emma, 1.0 | My | My | pass |
| boy | /bɔɪ/ | bˈY (gold) | bf_emma, 1.0 | boy | Boy. | pass |
| coin | /kɔɪn/ | kˈYn (gold) | bf_emma, 1.0 | coin | Coin | pass |
| home | /həʊm/ | hˈQm (gold) | bf_emma, 1.0 | home | Home. | pass |
| house | /haʊs/ | hˈWs (gold) | bf_emma, 0.9 | A house. | A house. | pass |
| now | /naʊ/ | nˈW (gold) | bf_emma, 1.0 | Now | Now | pass |
| here | /hɪə/ | hˈɪə (gold) | bf_emma, 0.9 | here | Here. | pass |
| near | /nɪə/ | nˌɪə (gold) | bf_lily, 1.0 | near | Near | pass |
| there | /ðeə/ | ðɛː (gold) | bf_emma, 0.85 | There. | There. | pass |
| care | /keə/ | kˈɛː (gold) | bf_emma, 0.9 | Care? | Cab | pass (one recogniser) |
| tour | /tʊə/ | tˈʊə (gold) | bf_emma, 0.9 | The tour | Tour | pass (one recogniser) |
| sure | /ʃʊə/ | ʃˈʊə (gold) | bf_emma, 1.0 | Sure | Sure. | pass |
| ship | /ʃɪp/ | ʃˈɪp (gold) | bf_emma, 0.9 | A ship. | A ship. | pass |
| pool | /puːl/ | pˈuːl (gold) | bf_emma, 1.0 | pool | Poole | pass (one recogniser) |
| pull | /pʊl/ | pˈʊl (gold) | bf_emma, 0.9 | The word is puddle. | The word is pull. | pass (one recogniser) (after 'The word is') |
| foot | /fʊt/ | fˈʊt (gold) | bf_emma, 1.0 | foot | Foot | pass |
| hut | /hʌt/ | hˈʌt (gold) | bf_emma, 1.0 | HUT | Hut. | pass |
| late | /leɪt/ | lˈAt (gold) | bf_emma, 0.9 | late | Late. | pass |
| let | /let/ | lˈɛt (gold) | bf_emma, 1.0 | let | Let | pass |
| pain | /peɪn/ | pˈAn (gold) | bf_emma, 1.0 | pain | Pain. | pass |
| pen | /pen/ | pˈɛn (gold) | bf_emma, 1.0 | pen | Pen | pass |
| bought | /bɔːt/ | bˈɔːt (gold) | bf_emma, 0.9 | bought | But | pass (one recogniser) |
| bout | /baʊt/ | bˈWt (gold) | bf_emma, 1.0 | bout | Bout | pass |
| paid | /peɪd/ | pˈAd (gold) | bf_emma, 0.9 | paid | Paid | pass |
| raid | /reɪd/ | ɹˈAd (gold) | bf_emma, 0.9 | Raid | Raid. | pass |
| seed | /siːd/ | sˈiːd (gold) | bf_emma, 0.9 | Seed | Seed. | pass |
| calm | /kɑːm/ | kˈɑːm (gold) | bf_isabella, 0.9 | Comms | Calm. | pass (one recogniser) |
| happy | /ˈhæpi/ | hˈapi (gold) | bf_emma, 0.9 | Happy | Happy. | pass |
| yellow | /ˈjeləʊ/ | jˈɛlQ (gold) | bf_emma, 0.9 | yellow | Yellow. | pass |
| present (noun) | /ˈpreznt/ | pɹˈɛzᵊnt (gold) | bf_emma, 0.9 | present | Present | pass |
| present (verb) | /prɪˈzent/ | pɹɪzˈɛnt (gold) | bf_emma, 0.9 | Present | present | pass |
| object (noun) | /ˈɒbdʒekt/ | ˈɒbʤɛkt (gold) | bf_emma, 0.9 | Object | Object | pass |
| object (verb) | /əbˈdʒekt/ | əbʤˈɛkt (gold) | bf_emma, 0.9 | object | Object | pass |
| increase (noun) | /ˈɪnkriːs/ | ˈɪnkɹiːs (gold) | bf_emma, 0.9 | increase | Increase | pass |
| increase (verb) | /ɪnˈkriːs/ | ɪnkɹˈiːs (gold) | bf_emma, 1.0 | increase | Increase | pass |
| education | /ˌedjʊˈkeɪʃn/ | ˌɛdjʊkˈAʃᵊn (gold) | bf_emma, 0.9 | education | Education | pass |
| decision | /dɪˈsɪʒn/ | dɪsˈɪʒᵊn (gold) | bf_emma, 0.85 | A decision | A decision | pass |
| scientific | /ˌsaɪənˈtɪfɪk/ | sˌIəntˈɪfɪk (gold) | bf_emma, 1.0 | scientific | Scientific | pass |
| university | /ˌjuːnɪˈvɜːsɪti/ | jˌuːnɪvˈɜːsɪti (gold) | bf_emma, 0.9 | University | University | pass |
| political | /pəˈlɪtɪkl/ | pəlˈɪtɪkᵊl (gold) | bf_emma, 0.9 | A political | Political | pass |
| historical | /hɪˈstɒrɪkl/ | hɪstˈɒɹɪkᵊl (gold) | bf_emma, 0.9 | Historical | Historical | pass |
| musician | /mjuːˈzɪʃn/ | mjuːzˈɪʃᵊn (gold) | bf_emma, 0.9 | A musician. | A musician | pass |
| politician | /ˌpɒlɪˈtɪʃn/ | pˌɒlɪtˈɪʃᵊn (gold) | bf_emma, 0.9 | politician | Politician | pass |
| blackboard | /ˈblækbɔːd/ | blˈakbɔːd (gold) | bf_emma, 1.0 | Blackboard | Blackboard | pass |
| classroom | /ˈklɑːsruːm/ | klˈɑːsɹuːm (gold) | bf_emma, 1.0 | Classroom | Classroom | pass |
| football | /ˈfʊtbɔːl/ | fˈʊtbɔːl (gold) | bf_emma, 0.9 | Football | Football | pass |
| everybody | /ˈevrɪbɒdi/ | ˈɛvɹɪbɒdi (gold) | bf_emma, 0.9 | Everybody | Everybody. | pass |
| principal | /ˈprɪnsɪpl/ | pɹˈɪnsɪpᵊl (gold) | bf_emma, 0.9 | Principal | Principal | pass |
| exercise | /ˈeksəsaɪz/ | ˈɛksəsIz (gold) | bf_emma, 0.9 | Exercise | Exercise | pass |
| adjective | /ˈædʒɪktɪv/ | ˈaʤɪktɪv (gold) | bf_emma, 0.9 | Adjective | A adjective | pass |
| cathedral | /kəˈθiːdrəl/ | kəθˈiːdɹᵊl (gold) | bf_emma, 0.9 | A cathedral. | A cathedral. | pass |

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
