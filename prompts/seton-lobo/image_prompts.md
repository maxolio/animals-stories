# Промпты иллюстраций рассказа №1: «Лобо — король Куррумпо» (`seton-lobo`)

**Модель генерации:** Google AI Studio — **Nano Banana Pro**  
**Целевая папка после конвертации в WebP (`1376×768`, 16:9):** `assets/images/stories/seton-lobo/`  
**Схема именования исходников из AI Studio (`.jpg`, с последующей пакетной конвертацией в `.webp`):**
- Обложка: `cover.jpg` $\rightarrow$ `cover.webp`
- Иллюстрации по страницам (по 2 кадра на страницу с плавной однократной сменой по таймкоду `at`):
  - `page-01-1.jpg` (0 сек — 1-й абзац), `page-01-2.jpg` (начало 2-го абзаца)
  - ...
  - `page-12-1.jpg`, `page-12-2.jpg`

---

## ⚙️ Настройки для Google AI Studio (System Instructions)

> **Как использовать при открытии нового чата в AI Studio:**  
> Скопируйте блок ниже в верхнее поле **`System Instructions`** (а также при желании прикрепите в первое сообщение референс стиля или готовую обложку). Имена собственные (`Lobo`, `Blanca`) из английских промптов специально убраны, чтобы нейросеть никогда не писала их буквами на иллюстрациях.

```text
You are a master wildlife storybook illustrator. Generate every image as a SINGLE full-bleed 16:9 horizontal illustration from edge to edge.

ARTISTIC STYLE & TECHNIQUE (FOR THIS STORY):
- Luminous plein-air watercolor and soft gouache nature painting inspired by Dermot Brennan.
- Layered traditional watercolor washes: soft wet-on-wet atmospheric depth in the background (mist, sky, distant mesas and trees) combined with expressive brushwork on foreground rocks, foliage, and grass, and fine drybrush texture on animal fur.
- Earthy, harmonious natural palette (warm gold, ochre, sienna, sage green, and deep slate/indigo shadows).

LIGHTING & COMPOSITION:
- Radiant atmospheric lighting: glowing sunbeams through canyon mist, warm golden-hour rim light on fur edges, or soft silvery moonlight at night, with long expressive cast shadows on the ground.
- Natural, unposed cinematic composition: animals must exist naturally inside the landscape (three-quarter view, profile, or natural movement), NEVER stiffly posing or staring straight into the camera like a studio portrait.

RECURRING CHARACTERS & SETTING:
1. The Alpha Gray Wolf (Лобо): A colossal, powerful old dark-gray timber wolf with thick grizzled charcoal-and-ochre fur on his shoulders, a lighter chest, and wise amber-gold eyes.
2. The White She-Wolf (Бланка): A slender, graceful pure silver-white female wolf, noticeably smaller and sleeker than the giant gray wolf, with a soft fluffy tail.
3. The Naturalist Tracker (Следопыт): A late 19th-century wilderness tracker wearing a weathered felt hat, brown leather jacket, and high riding boots.
4. Setting: The wild Currumpaw valley in New Mexico — red sandstone canyon cliffs, flat-topped mesas, winding river, pine trees, and desert sagebrush.

STRICT NEGATIVE RULES:
- NO white paper margins, NO torn edges, NO borders, NO frames, NO rounded corners, NO grids or collages.
- NO heavy black comic ink outlines.
- NO photorealism, NO 3D render look.
- NO text, NO letters, NO labels, NO signatures, NO watermarks.
```

---

## 🖼️ Список кадров и промпты по страницам

### 0. `cover.jpg` — Обложка рассказа
- **Описание:** Величественный серый волк Лобо стоит на краю красной скалы каньона Куррумпо в лучах золотого заката, рядом с ним — белая волчица Бланка; оба смотрят вдаль на залитую светом долину.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache nature painting, full-bleed 16:9 horizontal from edge to edge (no white margins, no borders). A breathtaking wide shot of the wild Currumpaw canyon in New Mexico at golden sunset. On a warm red sandstone ledge in the foreground (in a natural three-quarter profile view, not looking at the camera) stands a colossal, powerful dark-gray timber wolf beside a slender, graceful silver-white female wolf, both gazing out into the glowing valley below. Radiant golden-amber sunbeams pour through soft evening mist in the canyon, casting long shadows across the rock ledge and illuminating the edges of the wolves' fur with a warm rim glow. Layered watercolor washes, soft wet-on-wet atmospheric distance, no black ink outlines, no text, no watermark.
```

---

### Страница 1 • Властелин долины (озвучка `page-01.mp3` — 48.3 сек)

#### Кадр 1 (`at: 0` сек) — `page-01-1.jpg`
- **Описание:** Обширная долина Куррумпо на закате, красные столовые горы, вьющаяся река внизу и гигантский серый вожак на высоком каменном уступе.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. High on a jagged red sandstone cliff edge stands a colossal, powerful dark-gray timber wolf in noble profile, looking down over a vast canyon valley in New Mexico at golden sunset. Far below, a winding mountain river sparkles among green pastures and pine trees, bathed in warm sunbeams and misty golden haze. Long cast shadows on the rock, expressive watercolor brushwork, no text, no watermark.
```

#### Кадр 2 (`at: 21` сек) — `page-01-2.jpg`
- **Описание:** Сгущаются синие сумерки над каньоном, вожак поднимает голову к первым звёздам и издаёт могучий раскатистый вой.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Deep indigo and violet twilight descending over the rocky canyon in New Mexico. On a dark sandstone ledge, the colossal dark-gray timber wolf stands in side profile with his head raised high toward the pale evening sky and first stars, howling powerfully into the misty gorge. Soft warm afterglow on the horizon creates a delicate rim light along his thick fur. Atmospheric wet-on-wet washes, no text, no watermark.
```

---

### Страница 2 • Белая спутница вожака (озвучка `page-02.mp3` — 43.3 сек)

#### Кадр 1 (`at: 0` сек) — `page-02-1.jpg`
- **Описание:** Лунная прерия; отборная стая из пяти волков на холме, в центре — грациозная серебристо-белая волчица рядом с могучим серым вожаком.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. A moonlit wild prairie in New Mexico with silver mist drifting over tall grass. On a gentle grassy knoll stand five wolves in natural unposed silhouettes bathed in pale silvery moonlight: in the foreground stands a slender, graceful pure silver-white female wolf beside the colossal dark-gray alpha wolf, with three gray pack wolves slightly behind them in the misty shadows. Long moonlit shadows, dreamy wet-on-wet night sky, no text.
```

#### Кадр 2 (`at: 21` сек) — `page-02-2.jpg`
- **Описание:** Белая волчица стремительно несётся вперёд сквозь ночное ущелье, а могучий серый вожак бежит плечом к плечу, прикрывая её.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Dynamic night scene in a misty canyon pass illuminated by silvery moonlight. The slender, graceful pure white female wolf bounds swiftly through tall silver grass, while the colossal dark-gray timber wolf runs protectively right beside her shoulder, guarding her path. Expressive watercolor motion, soft moonlight rim glow on their fur, deep slate shadows, no text.
```

---

### Страница 3 • Насмешка над охотниками (озвучка `page-03.mp3` — 32.8 сек)

#### Кадр 1 (`at: 0` сек) — `page-03-1.jpg`
- **Описание:** Утреннее солнце в каньоне; два пастуха-охотника у лошадей растерянно склонились над огромными волчьими следами на песке.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Early morning sunbeams piercing through golden mist in a red sandstone canyon. Two 19th-century ranch cowboys in felt hats kneel on the sandy trail beside their horses, looking down in disbelief at a line of gigantic wolf pawprints in the sunlit dust. Long morning shadows, warm watercolor foliage and rock washes, no text.
```

#### Кадр 2 (`at: 17` сек) — `page-03-2.jpg`
- **Описание:** Крутые каменистые расщелины в горах; высоко на гребне скалы в лучах солнца спокойно стоит силуэт серого вожака, глядя вниз на отставшую погоню.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Steep, rugged rocky ravines in the New Mexico mountains bathed in bright morning sunlight and mist. High up on an unreachable craggy ledge in the foreground, the colossal dark-gray wolf stands calmly in profile, looking down into the shadowy gorge far below where tiny distant silhouettes of hunting dogs have lost the trail. Warm backlit glow, no text.
```

---

### Страница 4 • Дуэль со следопытом (озвучка `page-04.mp3` — 37.2 сек)

#### Кадр 1 (`at: 0` сек) — `page-04-1.jpg`
- **Описание:** Осенний лагерь следопыта-натуралиста у подножия красных скал Куррумпо; человек изучает в бинокль склоны каньона.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Autumn afternoon camp of a 19th-century naturalist tracker at the foot of towering red sandstone cliffs. The tracker in a weathered leather jacket and felt hat stands in profile looking through brass binoculars toward distant sunlit canyon slopes. A saddled horse, pine trees, and a thin wisp of campfire smoke blend into the warm golden haze. Long shadows, no text.
```

#### Кадр 2 (`at: 15` сек) — `page-04-2.jpg`
- **Описание:** Следопыт в кожаных перчатках маскирует стальной капкан на узкой волчьей тропе в вечерних лучах, засыпая его сухой пылью.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Atmospheric low-angle view on a narrow sandy canyon trail at golden dusk. A 19th-century tracker wearing heavy leather gloves kneels in the long evening shadows, carefully brushing fine golden desert dust over a hidden steel trap at a crossroads of wolf tracks. Warm amber sunbeams filter through desert sagebrush, expressive watercolor texture, no text.
```

---

### Страница 5 • Разгаданная ловушка (озвучка `page-05.mp3` — 35.5 сек)

#### Кадр 1 (`at: 0` сек) — `page-05-1.jpg`
- **Описание:** Рассветный туман; серый вожак резко останавливает стаю за два шага до замаскированного на тропе капкана.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Misty golden dawn on a narrow dirt trail winding through a rocky canyon. The colossal dark-gray alpha wolf halts abruptly two steps before a subtle disturbance in the sand, his head lowered in profile as he sniffs the ground intently, while the slender white female wolf and the pack pause in the glowing morning mist behind him. Long soft shadows, no text.
```

#### Кадр 2 (`at: 16` сек) — `page-05-2.jpg`
- **Описание:** Вожак повернулся спиной к ловушке и мощными задними лапами швыряет в неё комья земли и камни, захлопывая стальные дуги.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Dynamic sunrise scene on a sandy canyon path. The colossal dark-gray timber wolf stands turned with his back toward a partially uncovered steel trap in the dust, kicking flat stones and dry earth onto the trap with his hind legs to spring it safely. Golden morning sunbeams catch the flying dust particles and illuminate his thick fur. No text.
```

---

### Страница 6 • Единственная слабость короля (озвучка `page-06.mp3` — 41.5 сек)

#### Кадр 1 (`at: 0` сек) — `page-06-1.jpg`
- **Описание:** Следопыт склонился у песчаного берега залитого солнцем ручья над двумя цепочками волчьих следов.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Sunlit mountain stream in a quiet canyon glade. The 19th-century naturalist tracker kneels on the wet sandy bank in warm afternoon light, examining two distinct sets of wolf tracks in the mud: smaller, delicate pawprints running ahead, and giant wolf pawprints following right behind them. Sparkling water reflections, soft wet-on-wet pine trees in the mist, no text.
```

#### Кадр 2 (`at: 21` сек) — `page-06-2.jpg`
- **Описание:** Своенравная белая волчица азартно вырывается вперёд вдоль берега ручья в лучах солнца, а мудрый серый вожак следует за ней.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Golden late afternoon along a shallow mountain creek surrounded by autumn foliage and red rocks. The slender, graceful pure white female wolf bounds playfully ahead along the sunlit riverbank, while the colossal dark-gray wolf trots a few paces behind her, watching her fondly. Radiant backlit sunbeams and long cast shadows across the water and sand, no text.
```

---

### Страница 7 • Ошибка в узком ущелье (озвучка `page-07.mp3` — 40.6 сек)

#### Кадр 1 (`at: 0` сек) — `page-07-1.jpg`
- **Описание:** Узкая каменная теснина у сухого русла в предрассветном тумане; затаённая тишина между двумя огромными валунами.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Cool blue-and-amber pre-dawn twilight in a narrow rocky gorge beside a dry creek bed. Two massive sandstone boulders form a tight, shadowy sandy passage in the foreground, while in the pale misty distance the silhouettes of the wolf pack approach along the canyon floor. Suspenseful atmospheric washes, long shadows, no text.
```

#### Кадр 2 (`at: 21` сек) — `page-07-2.jpg`
- **Описание:** Первые лучи зари пробивают туман; белая волчица на полном скаку первой влетает в узкий проход между скалами, пока серый вожак позади пытается её остановить.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Dramatic sunrise light breaking through mist in a narrow rocky gorge. The slender pure white female wolf runs swiftly ahead into the narrow sandy gap between two huge dark boulders, while the colossal dark-gray wolf is seen further back on the trail in a tense posture trying to warn her. Strong contrast of golden light beams and deep canyon shadows, no text.
```

---

### Страница 8 • Одинокий зов над каньоном (озвучка `page-08.mp3` — 37.1 сек)

#### Кадр 1 (`at: 0` сек) — `page-08-1.jpg`
- **Описание:** Серый вожак на высоком скалистом гребне в вечернем свете с тоской смотрит вниз в далёкую долину, где всадники уезжают к ранчо.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Somber late afternoon light over the rocky hills of New Mexico. High on a lonely stone ridge in the foreground stands the colossal dark-gray wolf in profile, casting a long solitary shadow as he looks down into the misty valley far below, where tiny distant silhouettes of horsemen ride away toward a ranch. Melancholic golden-and-slate watercolor tones, no text.
```

#### Кадр 2 (`at: 17` сек) — `page-08-2.jpg`
- **Описание:** Глубокая лунная ночь; одинокий силуэт серого волка на вершине утёса воет в безутешной скорби над туманной долиной.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Deep blue moonlit night in the canyon mountains. The colossal dark-gray wolf stands completely alone on a jagged cliff peak, his head raised to the misty moonlit sky in a mournful, heartbroken howl. Far below in the dark valley, a few tiny warm lights of a distant ranch house glimmer through the mist. Silver rim light, expressive wet-on-wet washes, no text.
```

---

### Страница 9 • По следу любви (озвучка `page-09.mp3` — 42.7 сек)

#### Кадр 1 (`at: 0` сек) — `page-09-1.jpg`
- **Описание:** Пасмурный туманный вечер; старый вожак в одиночку бродит у подножия холмов, низко опустив голову к земле в поисках следа подруги.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Somber, misty dusk at the foothills of the Currumpaw valley. The colossal old dark-gray wolf walks alone through low desert sagebrush in side view, his heavy head lowered close to the sandy ground as he follows a faint trail. Soft fading amber light on the horizon, long lonely shadow, muted atmospheric watercolor washes, no text.
```

#### Кадр 2 (`at: 21` сек) — `page-09-2.jpg`
- **Описание:** Ночная дымка у деревянной изгороди ранчо; серый вожак без оглядки идёт прямо по следам на песке в густые тени.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Misty moonlit night near the weathered wooden fence of a 19th-century ranch. The colossal dark-gray wolf walks forward in profile with his nose close to delicate pawprints in the sand, stepping into the deep shadows cast by the fence posts under pale moonlight, completely ignoring the danger around him. Atmospheric indigo and silver watercolor washes, no text.
```

---

### Страница 10 • Взгляд непокорённого вожака (озвучка `page-10.mp3` — 40.1 сек)

#### Кадр 1 (`at: 0` сек) — `page-10-1.jpg`
- **Описание:** Рассветные лучи в прерии; могучий старый волк стоит во весь рост с высоко поднятой головой, озарённый утренним солнцем.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Golden sunrise breaking through morning mist over the sandy prairie. The colossal old dark-gray timber wolf stands tall and unconquered in a noble three-quarter profile, his thick grizzled fur illuminated by warm golden sunbeams, gazing calmly ahead with glowing amber-gold eyes. Expressive drybrush fur detail and soft watercolor background, no text.
```

#### Кадр 2 (`at: 20` сек) — `page-10-2.jpg`
- **Описание:** Потрясённый мужеством зверя следопыт в лучах утреннего солнца с глубоким уважением опускает ружьё перед волком.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Warm morning sunlight in the misty prairie. The 19th-century naturalist tracker stands beside his horse in profile and slowly lowers his rifle in silent reverence and compassion as he looks toward the noble, calm giant dark-gray wolf resting proudly on the sunlit sand before him. Long morning shadows, warm emotional atmosphere, no text.
```

---

### Страница 11 • Взор, устремлённый в прерию (озвучка `page-11.mp3` — 33.5 сек)

#### Кадр 1 (`at: 0` сек) — `page-11-1.jpg`
- **Описание:** Спокойный солнечный день у ранчо; старый вожак лежит в тени, гордо отвернув голову от нетронутой миски с водой и мясом.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Quiet sunlit afternoon at a rustic wooden ranch yard. The colossal old dark-gray wolf lies calmly on the warm earth in a stoic profile posture, turning his head proudly away from an untouched wooden bowl of water and food near him. Dappled sunlight and long shadows across the ground, soft watercolor brushwork, no text.
```

#### Кадр 2 (`at: 16` сек) — `page-11-2.jpg`
- **Описание:** Сияющий золотой закат над Куррумпо; старый вожак положил голову на лапы и неотрывно смотрит сквозь лучи солнца вдаль на родные просторы и столовые горы.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Radiant golden sunset pouring over the Currumpaw valley. In the foreground, the colossal old dark-gray wolf lies motionless with his heavy head resting on his front paws (seen from a three-quarter rear-side angle), gazing intently into the glowing distance toward the vast golden prairies and red mesas of his homeland. Warm sunbeams, long evening shadows, no text.
```

---

### Страница 12 • Легенда Куррумпо (озвучка `page-12.mp3` — 40.4 сек)

#### Кадр 1 (`at: 0` сек) — `page-12-1.jpg`
- **Описание:** Тихая звёздная ночь опускается на долину и холмы; старый волк мирно спит под звёздным небом в серебристом свете.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Peaceful starry night descending over the quiet hills and canyon valley of New Mexico. The colossal old dark-gray wolf rests peacefully on the ground with his eyes gently closed under the vast starlit sky, bathed in soft silvery starlight and mist, free from pain. Tender, serene wet-on-wet indigo and silver watercolor washes, no text.
```

#### Кадр 2 (`at: 19` сек) — `page-12-2.jpg`
- **Описание:** В сиянии луны и звёзд над горными вершинами Куррумпо среди светящегося тумана бегут рядом два силуэта — могучий серый волк и серебристо-белая волчица.
- **Prompt (EN):**
```text
Luminous plein-air watercolor and soft gouache painting, full-bleed 16:9 horizontal, no borders. Magical moonlit night over the high red mesas and misty valley of Currumpaw. High along a starlit ridge bathed in glowing silver mist and moonbeams, two wolves — a colossal dark-gray wolf and a slender pure silver-white female wolf — run side by side in eternal freedom, looking out toward the horizon. Ethereal wet-on-wet watercolor glow, no text, no watermark.
```
