# Промпты иллюстраций рассказа №2: «Чинк — щенок из Йеллоустоуна» (`seton-chink`)

**Модель генерации:** Google AI Studio — **Nano Banana Pro** (`gemini-3-pro-image`)  
**Отношение сторон:** `16:9` | **Resolution:** `1K`  
**Целевая папка после конвертации в WebP (`1376×768`, 16:9):** `assets/images/stories/seton-chink/`  
**Схема именования исходников из AI Studio (`.jpg`, с последующей конвертацией в `.webp`):**
- Обложка: `cover.jpg` $\rightarrow$ `cover.webp`
- Кадры по страницам (по 2 кадра на страницу с плавной однократной сменой по таймкоду `at`):
  - `page-01-1.jpg` (`at: 0`), `page-01-2.jpg` (`at: 22`)
  - `page-02-1.jpg` (`at: 0`), `page-02-2.jpg` (`at: 17`)
  - `page-03-1.jpg` (`at: 0`), `page-03-2.jpg` (`at: 17`)
  - `page-04-1.jpg` (`at: 0`), `page-04-2.jpg` (`at: 16`) *(Paywall)*
  - `page-05-1.jpg` (`at: 0`), `page-05-2.jpg` (`at: 14`)
  - `page-06-1.jpg` (`at: 0`), `page-06-2.jpg` (`at: 18`)
  - `page-07-1.jpg` (`at: 0`), `page-07-2.jpg` (`at: 15`)
  - `page-08-1.jpg` (`at: 0`), `page-08-2.jpg` (`at: 15`)
  - `page-09-1.jpg` (`at: 0`), `page-09-2.jpg` (`at: 14`)
  - `page-10-1.jpg` (`at: 0`), `page-10-2.jpg` (`at: 14`)

---

## ⚙️ Настройки для Google AI Studio (System Instructions)

```text
You are a master nature and wildlife storybook illustrator. Generate every image as a SINGLE full-bleed 16:9 horizontal illustration from edge to edge.

ARTISTIC STYLE & TECHNIQUE:
- Luminous plein-air watercolor and soft gouache nature painting inspired by Dermot Brennan.
- Layered traditional watercolor washes: soft wet-on-wet atmospheric depth in the background (soft mountain mist, glowing sky, pine forests, distant peaks) combined with expressive textured brushwork on foreground grass, rocks, and foliage.
- Natural earthy color palette: warm ochre, golden sunlight, sage green, pine needle green, raw sienna, slate gray, and deep soft indigo shadows.

LIGHTING & COMPOSITION:
- Radiant atmospheric lighting: glowing sunbeams streaming through mountain trees, warm golden-hour rim lighting on subjects, and long expressive cast shadows across the ground.
- Natural, unposed cinematic composition: scenes feel alive, candid, and organic, NEVER stiffly posed or staring straight into the camera like a studio photo.

GENERAL SETTING & ENVIRONMENT:
- The untamed Rocky Mountain wilderness of Yellowstone in late 19th century: vast mountain meadows with wild sagebrush, towering Douglas firs and lodgepole pines, crystal mountain streams, rugged granite boulders, and majestic distant mountain ranges.

STRICT NEGATIVE RULES:
- NO white paper margins, NO torn paper edges, NO borders, NO frames, NO rounded corners, NO grids or multi-panel collages.
- NO heavy black comic ink outlines.
- NO photorealism, NO 3D render look, NO plastic cartoon CGI style.
- NO text, NO letters, NO words, NO labels, NO speech bubbles, NO signatures, NO watermarks.
```

---

## 🖼️ Список кадров и промпты по страницам

### 0. `cover.jpg` — Обложка рассказа
- **Описание:** Маленький взъерошенный щенок храбро стоит на пригорке перед белой палаткой лагеря, гордо задрав хвост и охраняя поляну в лучах утреннего горного солнца. Вдали виднеются сосны и заснеженные вершины Скалистых гор.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A heartwarming and heroic cover illustration: a small, scruffy, sturdy young puppy (a rustic mix of bulldog and terrier, with sandy-tan and warm ochre wiry fur, one floppy ear and one half-perked) standing bravely on a small grassy knoll in front of an old white canvas A-frame wall tent. The puppy has his little tail raised proudly, looking out over a sunlit mountain meadow dotted with sagebrush and wildflowers. Radiant golden morning sunbeams stream through towering lodgepole pines, casting long soft shadows and a glowing rim light on the puppy's coat. In the distant background, majestic snow-capped Rocky Mountain peaks rise under a soft watercolor sky. Expressive brushwork, rich natural colors, no black outlines, no text, no watermark.
```

---

### Страница 1 • Маленький сторож Йеллоустоуна (аудио `page-01.mp3` — 41.8 сек)

#### Кадр 1 (`at: 0` сек) — `page-01-1.jpg`
- **Описание:** Живописная горная поляна в Йеллоустоуне, белая парусиновая палатка среди сосен и полыни, старый седобородый охотник сидит у костра с котелком, а рядом бегает забавный щенок.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A wide picturesque morning view of a wilderness camp in Yellowstone. An old white canvas wall tent sits on a meadow of mountain grass and wild sagebrush, surrounded by towering Douglas fir trees. An elderly frontiersman with a full silver-gray beard and battered felt hat sits near a rustic stone fire pit with faint blue smoke rising, holding an iron kettle. Scampering cheerfully near the tent is a small scruffy sandy-tan puppy with floppy ears. Dappled golden sunlight filters through the pine branches, illuminating the campsite. Soft wet-on-wet mountain background, rich earthy palette, no text, no watermark.
```

#### Кадр 2 (`at: 22` сек) — `page-01-2.jpg`
- **Описание:** Крупный план: забавный взъерошенный щенок с круглыми глазами и висячими ушами, важно и гордо задравший мордочку, словно он самый грозный сторожевой пёс в лесу.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A charming medium close-up of the small scruffy sandy-ochre puppy, showing off his comical yet determined expression. The puppy has a wiry ruffled coat, one floppy ear and one semi-erect ear, sturdy short paws, and bright curious dark eyes, puffing out his little chest in a proud, important guard-dog posture among clover and mountain grass. Soft warm morning sunlight catches the textured edges of his fur, creating a luminous glow. Gentle watercolor blur of pine trees and the white canvas tent in the background, organic brush texture, no outlines, no text, no watermark.
```

---

### Страница 2 • Отважные подвиги (аудио `page-02.mp3` — 35.7 сек)

#### Кадр 1 (`at: 0` сек) — `page-02-1.jpg`
- **Описание:** Щенок азартно лает на полосатого бурундука, который сидит на замшелом пне и дерзко смотрит на собаку, шевеля усами.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A playful and dynamic scene on the mountain meadow: the small scruffy sandy-tan puppy with floppy ears barking energetically at a tiny striped chipmunk. The brave little puppy is in a playful play-bow stance with wagging tail, while the cheeky chipmunk sits atop a moss-covered pine tree stump just out of reach, twitching its whiskers. Warm dappled sunlight streams onto the green grass and scattered pine cones. Soft watercolor forest background, lively brushwork, no comic outlines, no text, no watermark.
```

#### Кадр 2 (`at: 17` сек) — `page-02-2.jpg`
- **Описание:** Старый охотник Билл сидит на бревне и с доброй улыбкой в седые усы смотрит на патрулирующего поляну щенка.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). An affectionate scene in the wilderness camp: the elderly hunter with a bushy silver beard, vintage checkered flannel shirt, and felt hat, sitting comfortably on a fallen log. He is looking down with a warm, fond smile in his crinkled eyes at the little scruffy puppy who is trotting proudly across the dirt path like a diligent sentry. Golden afternoon light washes over the campsite, highlighting the rustic canvas tent and pine trees. Atmospheric watercolor washes, tender storytelling mood, no text, no watermark.
```

---

### Страница 3 • Дерзкий теневой гость (аудио `page-03.mp3` — 34.5 сек)

#### Кадр 1 (`at: 0` сек) — `page-03-1.jpg`
- **Описание:** На краю леса, среди серой полыни и сосновых стволов, появляется тощая серая тень — старый койот с острыми ушами и настороженными желтыми глазами.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A mysterious and tense scene at the edge of the pine woods: a lean, grizzled old mountain coyote stepping stealthily out from the dense sagebrush into the shadows of tall pine trunks. The coyote has dusty silver-gray and tan fur, a bushy tail, and piercing amber-yellow eyes focused intently on the distant sunny campsite. Atmospheric late afternoon shadows contrast with distant sunlit meadow grass. Soft wet-on-wet watercolor depth, natural unposed wildlife composition, no text, no watermark.
```

#### Кадр 2 (`at: 17` сек) — `page-03-2.jpg`
- **Описание:** Койот нагло кружит неподалёку от лагеря, оскалив зубы в насмешливой ухмылке, а щенок у палатки глухо ворчит, ощетинив шерсть.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A tense standoff at the edge of the campsite: in the midground, the grizzled coyote trots insolently along the perimeter, glancing mockingly with bared yellow fangs. In the foreground (three-quarter rear profile), the small scruffy sandy puppy stands resolutely near the white tent, his hackles raised and tail stiff, growling bravely at the intruder. Long evening shadows stretch across the dirt and grass under amber sunset light. Dramatic watercolor atmosphere, expressive brush textures, no text, no watermark.
```

---

### Страница 4 • Приказ хозяина (аудио `page-04.mp3` — 36.5 сек) — *PAYWALL*

#### Кадр 1 (`at: 0` сек) — `page-04-1.jpg`
- **Описание:** Охотник Билл подвешивает большой аппетитный копчёный окорок на перекладину под крышей палатки, а щенок сидит рядом и внимательно слушает указания.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). Inside the entrance of the rustic white canvas tent: the elderly hunter with gray beard and flannel shirt reaches up to hang a large smoked ham on a wooden ridge pole beneath the canvas roof. Beside him on the ground, the little scruffy sandy puppy sits attentively with ears perked up, looking up at his master with deep loyalty and devotion. Nearby rests an enamel tin bowl filled with dry biscuits. Warm morning light spills into the open tent flap, highlighting the canvas texture. Rich watercolor details, no comic lines, no text, no watermark.
```

#### Кадр 2 (`at: 16` сек) — `page-04-2.jpg`
- **Описание:** Охотник верхом на лошади уезжает по горной тропе вдаль, а маленький щенок остаётся один сидеть у входа в палатку; из дальних кустов за ним следит койот.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A poignant wide shot of the mountain camp: down the winding dirt trail between towering pines, the elderly hunter rides away on his pack horse, his back turned as he disappears into the canyon. In the foreground, the small solitary scruffy puppy sits loyally in front of the empty white canvas tent, watching his master leave. In the distant shaded bushes across the clearing, the subtle silhouette of the coyote watches hungrily. Warm, bittersweet golden sunlight stretching long shadows across the empty camp. Deep emotional watercolor atmosphere, no text, no watermark.
```

---

### Страница 5 • Осада беззащитного лагеря (аудио `page-05.mp3` — 31.9 сек)

#### Кадр 1 (`at: 0` сек) — `page-05-1.jpg`
- **Описание:** Койот бесшумно и нагло выходит на открытую поляну лагеря, принюхиваясь к запаху мяса и медленно направляясь к палатке.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A menacing and atmospheric scene: the lean, grizzled coyote slinks boldly across the open clearing toward the unattended white canvas tent. His nose is raised high, sniffing the rich scent of smoked meat, amber eyes gleaming with predator hunger. The empty campsite is quiet under the afternoon sun, with the cold fire pit and pine needles scattered on the ground. Long cast shadows, expressive watercolor brushwork on the coyote's coarse fur and dusty grass, no text, no watermark.
```

#### Кадр 2 (`at: 14` сек) — `page-05-2.jpg`
- **Описание:** Щенок, дрожа от страха, но с непреклонной решимостью выбегает навстречу и встаёт в дверях палатки, оскалив маленькие зубы и преграждая путь зверю.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A dramatic confrontation at the tent entrance: the small scruffy sandy puppy stands firmly right in front of the open canvas doorway, legs shaking with nervous tension but body braced, baring his small puppy teeth and snarling defiantly. A few yards away, the large lean coyote pauses in surprise, glaring down at the tiny guard. Dust kicking up in the afternoon mountain light, high tension in the composition, expressive watercolor textures, no text, no watermark.
```

---

### Страница 6 • Ночь страха (аудио `page-06.mp3` — 36.5 сек)

#### Кадр 1 (`at: 0` сек) — `page-06-1.jpg`
- **Описание:** Синие горные сумерки: силуэт койота кружит в десяти шагах от палатки, горящие в темноте глаза, шуршащие ветви.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A chilling twilight scene: deep indigo and cobalt mountain dusk falls over the campsite. Ten paces from the pale canvas tent, the dark shadowy figure of the coyote prowls in a tight circle through the shadowy sagebrush, its yellow eyes glowing faintly in the dim light. Wisps of evening mist curl among the dark pine silhouettes under a pale purple sky. Moody, atmospheric watercolor washes, suspenseful storytelling, no text, no watermark.
```

#### Кадр 2 (`at: 18` сек) — `page-06-2.jpg`
- **Описание:** Глубокая холодная ночь, яркие звёзды и лунный свет: замёрзший, дрожащий щенок сидит на посту у входа в палатку, не смыкая глаз и глядя в темноту.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). An emotional nocturnal painting: under a vast starry night sky and cold silver moonlight, the lonely little scruffy puppy sits steadfast at the open flap of the white canvas tent. The puppy is shivering from the mountain chill, his fur ruffled, but his wide, watchful dark eyes remain bravely fixed on the dark tree line, refusing to seek warmth inside. Silvery rim light reflects on the tent canvas and the puppy's back, deep velvety blue and indigo shadows, expressive brushwork, no text, no watermark.
```

---

### Страница 7 • Испытание голодом и жаждой (аудио `page-07.mp3` — 32.3 сек)

#### Кадр 1 (`at: 0` сек) — `page-07-1.jpg`
- **Описание:** Палящий солнечный полдень: пустая сухая миска в пыли, подвешенный над головой аппетитный окорок, и истощённый щенок, тяжело дышащий в тени брезента.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A poignant daytime scene under harsh, bright midday sun: inside the shade of the tent entrance, the small sandy puppy lies resting with his head on his paws, panting wearily. In front of him sits an overturned, bone-dry tin water bowl in the dusty earth. Directly above on the wooden beam hangs the rich smoked ham, completely untouched. Bright blinding sunlit meadow visible outside the canvas frame. Rich watercolor textures of canvas, dust, and dry grass, conveying thirst and unwavering restraint, no text, no watermark.
```

#### Кадр 2 (`at: 15` сек) — `page-07-2.jpg`
- **Описание:** Щенок с тоской смотрит на далёкий сверкающий ручей в низине, но отворачивается и остаётся на своём посту у палатки, помня наказ Билла.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A touching emotional composition: the weary, thirsty little scruffy puppy sits on the camp boundary, looking down toward a sparkling, clear mountain stream visible through the pine trees in the valley. Despite his overwhelming thirst, the loyal puppy turns his head back resolutely toward the white tent, holding his ground and refusing to abandon his post. Warm shimmering heat haze in the distance, beautiful golden-hour light touching the mountain slopes, heartfelt storytelling mood, no text, no watermark.
```

---

### Страница 8 • Решающий бросок (аудио `page-08.mp3` — 33.7 сек)

#### Кадр 1 (`at: 0` сек) — `page-08-1.jpg`
- **Описание:** Койот, припав к земле и оскалив клыки, в яростном стремительном прыжке бросается прямо в открытую палатку.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). High-action dynamic moment: the aggressive mountain coyote, ears flattened and sharp yellow fangs bared, lunges at full leaping sprint directly toward the open entrance of the white canvas tent. Dust and pebbles erupt from beneath his claws in mid-stride. Dramatic low-angle perspective, dynamic motion blur on the background pine trees, intense afternoon sunlight casting sharp action shadows. Expressive gouache brushstrokes, cinematic tension, no text, no watermark.
```

#### Кадр 2 (`at: 15` сек) — `page-08-2.jpg`
- **Описание:** Маленький щенок бесстрашно бросается наперерез и вцепляется зубами в лапу огромного койота, оба кувыркаются в пыли перед палаткой.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). Climax of the battle: the courageous little scruffy puppy leaps through the air with fierce determination, locking his jaws firmly onto the front leg of the much larger coyote. The two animals clash right on the canvas threshold of the tent, tumbling together in a swirling cloud of sunlit dust. The coyote snarls in sudden shock and pain while the tiny pup holds on with all his might. Dramatic action composition, textured splatters of watercolor, high energy, no comic lines, no text, no watermark.
```

---

### Страница 9 • Гром среди сосен (аудио `page-09.mp3` — 31.7 сек)

#### Кадр 1 (`at: 0` сек) — `page-09-1.jpg`
- **Описание:** Койот стряхивает щенка на землю и заносит свирепую пасть для удара, а израненный щенок храбро рычит, прижавшись спиной к брезенту.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A breathless moment of peril: the furious coyote towers over the fallen little puppy, teeth bared ready to strike. The bruised and scruffy little pup is pinned in the dust against the tent canvas, but his eyes blaze with defiance, still growling and showing his teeth, refusing to surrender. Tense dramatic shadows and radiant backlight streaming through the trees, heightened emotional stakes, masterful watercolor drama, no text, no watermark.
```

#### Кадр 2 (`at: 14` сек) — `page-09-2.jpg`
- **Описание:** Оглушительный выстрел! Сноп дыма из кустов, земля взлетает фонтаном у лап койота, испуганный хищник в панике удирает в сосновый бор.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A dramatic gunshot explosion: a puff of white gunsmoke billows from the distant tree line as a rifle bullet strikes the dirt inches from the coyote, spraying rocks and earth into the air. The terrified coyote yelps in panic, spinning around mid-air with tail tucked, fleeing at top speed into the safety of the dense pine forest. In the foreground, the breathless little puppy sits up in astonishment in the settling dust. Dynamic lighting, motion and relief, no comic lines, no text, no watermark.
```

---

### Страница 10 • Настоящий верный пёс (аудио `page-10.mp3` — 31.9 сек)

#### Кадр 1 (`at: 0` сек) — `page-10-1.jpg`
- **Описание:** Старый охотник Билл Обри с дымящимся ружьём подбегает к палатке, бросается на колени и с трепетом смотрит на своего храброго защитника.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A deeply moving reunion: the elderly hunter Bill Aubrey, breathing heavily with his smoking rifle in one hand, drops to his knees in the dust in front of the tent. He looks with immense pride and tearful affection at the battered, dusty, but unbroken little puppy standing proudly before the intact supplies. Warm golden afternoon sun streams through the ponderosa pines, enveloping them in a warm embrace. Heartfelt watercolor storytelling, rich emotional depth, no text, no watermark.
```

#### Кадр 2 (`at: 14` сек) — `page-10-2.jpg`
- **Описание:** Тёплый финал: дедушка Билл обнимает щенка у зажжённого костра и кормит его огромным сочным куском золотистого окорока, закат над Йеллоустоуном.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A heartwarming triumphant ending: by the warm crackling evening campfire near the white tent, the old hunter with his silver beard lovingly cradles the scruffy little hero puppy in his lap, feeding him a thick, juicy slice of the golden smoked ham. The puppy wags his tail ecstatically, eyes shining with happiness and devotion. The mountain meadow and distant peaks glow in a magnificent golden-rose sunset. Luminous watercolor washes, tender warmth and victory, no comic outlines, no text, no watermark.
```
