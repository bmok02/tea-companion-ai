// Auto-generated from the original tea_companion.html knowledge base.
// Tea entries have two shapes in the source data: richly-structured catalogue
// entries (category/origin/aroma/...) and simpler "manually_saved" entries
// (name/description only) — both are represented by the optional fields below.

export interface Tea {
  name: string;
  source?: string;
  chinese_name?: string;
  category?: string;
  origin?: string;
  aroma?: string;
  colour?: string;
  taste?: string;
  description?: string;
  brewing_instructions?: string;
  mindfulness_note?: string;
  url?: string;
}

export interface TeaChapterBusiness {
  name: string;
  tagline: string;
  founding: string;
  location: string;
  opening_hours: string;
  notable_visits: string[];
  description: string;
  what_they_sell: string[];
  workshops: string;
  website: string;
}

export interface KnowledgeBase {
  source: string;
  description: string;
  business: TeaChapterBusiness;
  teas: Tea[];
  pages: unknown[];
  blog_posts: unknown[];
}

export const KNOWLEDGE_BASE: KnowledgeBase = {
  "source": "teachapter.com",
  "description": "Tea Chapter is Singapore's largest and oldest traditional Chinese teahouse. Located in the first pre-war shophouse to have been restored in Singapore, in the Chinatown Historic District near Tanjong Pagar. The name '茶渊' comes from the tenet '茶学渊博,茶文化源远流长' — likening the profound art of tea appreciation to the deep, flowing history of tea. The three-storey shophouse has three distinct seating areas: 'Oriental' on the ground floor (where Queen Elizabeth sat), 'Japanese' on the third floor with low wooden tables, and 'Korean' with curtains hung for privacy. Tea Chapter has been devoted to the renaissance of Chinese tea drinking culture in Singapore.",
  "business": {
    "name": "Tea Chapter (茶渊)",
    "tagline": "Chinese Tea Appreciation Since 1989",
    "founding": "Founded in 1989 by a group of Chinese tea enthusiasts who were schooling friends",
    "location": "9 & 9A Neil Road, Singapore 088808 (Chinatown Historic District)",
    "opening_hours": "Tea House: Sun–Thu 11am–9pm, Fri–Sat 11am–10:30pm",
    "notable_visits": [
      "Queen Elizabeth II and Prince Philip (10 October 1989) — they were served Imperial Golden Cassia",
      "Prime Minister Lee Hsien Loong"
    ],
    "description": "Tea Chapter is Singapore's largest and oldest traditional Chinese teahouse. Located in the first pre-war shophouse to have been restored in Singapore, in the Chinatown Historic District near Tanjong Pagar. The name '茶渊' comes from the tenet '茶学渊博,茶文化源远流长' — likening the profound art of tea appreciation to the deep, flowing history of tea. The three-storey shophouse has three distinct seating areas: 'Oriental' on the ground floor (where Queen Elizabeth sat), 'Japanese' on the third floor with low wooden tables, and 'Korean' with curtains hung for privacy. Tea Chapter has been devoted to the renaissance of Chinese tea drinking culture in Singapore.",
    "what_they_sell": [
      "Loose leaf teas: Oolong, Green, White, Black/Red, Dark/Pu'er, Floral",
      "Compressed teas (tea cakes and bricks)",
      "Teabags",
      "Tea ware and accessories",
      "Gift sets and bundles"
    ],
    "workshops": "Tea appreciation workshops available from S$48/person, in English and Mandarin, Mon–Sun afternoons",
    "website": "https://teachapter.com"
  },
  "teas": [
    {
      "name": "Imperial Golden Cassia",
      "chinese_name": "御用黄金桂",
      "category": "Oolong Tea, Lightly Oxidised Oolong",
      "origin": "Anxi, Fujian Province, China",
      "aroma": "Osmanthus (cassia flower) — light and floral",
      "colour": "Golden Yellow",
      "taste": "Light, sweet, floral with a clean finish",
      "description": "Tea Chapter's signature tea and the one that made history. This is a famous lightly-fermented oolong from Anxi, Fujian province, celebrated for its osmanthus-like fragrance. On 10 October 1989, Queen Elizabeth II and Prince Philip visited Tea Chapter and were served this very tea — after which Tea Chapter named it 'Imperial Golden Cassia' in her honour. It remains their best-selling and most iconic tea.",
      "brewing_instructions": "Teaware: Use a small gongfu teapot or gaiwan (100–150ml). Leaf amount: Use approximately 5–7g of tea leaves (about 1–2 teaspoons per 100ml of water). Water temperature: 85–90°C (not boiling — let boiled water cool for 2–3 minutes). First rinse: Pour hot water over leaves and discard immediately — this 'wakes' the leaves. Steeping: 1st brew: 30–45 seconds. 2nd brew: 20–30 seconds. 3rd+ brews: add 10 seconds each time. The leaves can be re-steeped 5–7 times. Tip: Warm your teacups with hot water before pouring to preserve aroma.",
      "mindfulness_note": "As you inhale the osmanthus fragrance before your first sip, pause. This is the tea that was shared with royalty — let that sense of occasion slow you down.",
      "url": "https://teachapter.com/product/imperial-golden-cassia/"
    },
    {
      "name": "Top Grade Dragon Well",
      "chinese_name": "特级龙井",
      "category": "Green Tea",
      "origin": "West Lake (Xi Hu), Hangzhou, Zhejiang Province, China",
      "aroma": "Chestnuts or fresh beans — nutty, grassy",
      "colour": "Light green, clear and bright",
      "taste": "Smooth, mellow, subtly sweet with a fresh, grassy note",
      "description": "Dragon Well (Longjing) is arguably China's most famous green tea, grown around the scenic West Lake in Hangzhou. The flat, sword-shaped leaves are pan-fired by hand in a wok — a technique that halts oxidation and gives the tea its signature chestnut-like aroma. It has been an imperial tribute tea for centuries, famously favoured by Emperor Qianlong of the Qing dynasty who reportedly visited the tea gardens and granted imperial status to 18 specific tea bushes. Tea Chapter sources a top grade (特级) which represents the finest early spring harvest, picked before Qingming festival (early April).",
      "brewing_instructions": "Teaware: A glass cup or tall glass is ideal so you can watch the leaves dance. Leaf amount: 3–5g of leaves per 150ml of water. Water temperature: 75–80°C — critical! Boiling water will make it bitter and destroy delicate flavours. No rinsing needed for green tea. Steeping: 1st brew: 60–90 seconds. 2nd brew: 90 seconds. 3rd brew: 2–3 minutes. The leaves can be re-steeped 3–4 times. Tip: If using a glass, you can brew directly in it — the visual of the flat leaves slowly sinking is part of the experience.",
      "mindfulness_note": "Dragon Well is a tea for full presence. Watch the flat leaves unfurl and slowly sink — there is no rushing this.",
      "url": "https://teachapter.com/product/top-grade-dragon-well/"
    },
    {
      "name": "Tie Guan Yin",
      "chinese_name": "铁观音",
      "category": "Oolong Tea, Semi-Oxidised Oolong",
      "origin": "Anxi, Fujian Province, China",
      "aroma": "Orchid floral, sweet, lingering",
      "colour": "Golden amber to light green depending on grade",
      "taste": "Rich floral sweetness with a smooth, creamy body and long-lasting finish (回甘)",
      "description": "Tie Guan Yin (Iron Goddess of Mercy) is one of China's most celebrated oolongs. Its name comes from the Buddhist Goddess of Mercy, Guan Yin. Legend says a poor farmer found a neglected iron statue of Guan Yin in a dilapidated temple. He cleaned and tended to it devotedly. In gratitude, the Goddess appeared in his dream and told him to look behind the temple where he found a single tea shoot — this became Tie Guan Yin. The tea is famous for its hui gan (回甘), a returning sweetness felt in the throat long after swallowing.",
      "brewing_instructions": "Teaware: Traditional gongfu gaiwan or small Yixing clay teapot (100–150ml). Leaf amount: Fill the teapot or gaiwan about 1/3 to 1/2 full with leaves (7–10g). Water temperature: 90–95°C. First rinse: Rinse leaves once with hot water and discard (3–5 seconds). Steeping: 1st brew: 45 seconds. 2nd brew: 30 seconds. 3rd+ brews: add 15 seconds each time. Can be steeped 6–8 times — the flavour evolves with each steeping. Tip: Pour in a circular motion to ensure even extraction.",
      "mindfulness_note": "Notice the hui gan — the sweet echo that lingers in your throat after swallowing. This is the tea teaching you to pay attention to what remains.",
      "url": "https://teachapter.com/product/tie-guan-yin/"
    },
    {
      "name": "Da Hong Pao",
      "chinese_name": "大红袍",
      "category": "Oolong Tea, Rock Tea (Wuyi Yancha)",
      "origin": "Wuyi Mountains, Fujian Province, China",
      "aroma": "Deep, roasted, mineral — notes of dark chocolate, dried fruit, and stone",
      "colour": "Deep amber-brown, rich and clear",
      "taste": "Complex, roasted mineral character with a persistent sweetness and rock-mineral (yan yun) finish",
      "description": "Da Hong Pao (Big Red Robe) is the king of Wuyi rock oolongs and one of the most legendary teas in Chinese history. The original mother bushes grow on the rocky cliffs of Tianxin Rock in the Wuyi Mountains — the leaves from these ancient plants are essentially priceless. What Tea Chapter carries is a high-grade cultivar propagated from those original plants. The name 'Big Red Robe' comes from a legend: a Ming dynasty scholar was cured of an illness after drinking this tea and draped his scholar's red robe over the bushes in gratitude. The tea's distinctive 'yan yun' (rock rhyme) mineral quality comes from the unique mineral-rich rocky soil of the Wuyi Mountains.",
      "brewing_instructions": "Teaware: Yixing clay teapot is ideal (the clay absorbs the roasted character beautifully). A gaiwan works equally well. Leaf amount: 6–8g per 100ml. Rock teas benefit from more leaves. Water temperature: 95–100°C — full boiling water is appropriate for this robust tea. First rinse: Rinse once, discard immediately. Steeping: 1st brew: 30 seconds. 2nd brew: 20 seconds. 3rd+ brews: add 10–15 seconds. Can be re-steeped 8–10 times. The deep complexity fully opens up from the 3rd steep onward. Tip: Da Hong Pao pairs beautifully with dark chocolate or dried fruits.",
      "mindfulness_note": "Da Hong Pao asks for patience. The first steep is just an introduction — its real character reveals itself slowly, steep after steep.",
      "url": "https://teachapter.com/product/da-hong-pao/"
    },
    {
      "name": "Silver Needle White Tea",
      "chinese_name": "白毫银针",
      "category": "White Tea",
      "origin": "Fuding or Zhenghe, Fujian Province, China",
      "aroma": "Delicate, fresh, faintly floral — like fresh hay and white flowers",
      "colour": "Pale gold, crystalline and clear",
      "taste": "Incredibly gentle and sweet — soft, clean, with a honeyed, cucumber-like freshness",
      "description": "Silver Needle (Baihao Yinzhen) is the most prized white tea in the world. It is made exclusively from unopened tea buds covered in fine white hairs (the 'silver needles'). White tea undergoes the least processing of all tea types — just withering and drying, with no firing or rolling. This minimal handling preserves the highest concentration of antioxidants and gives the tea its uniquely delicate, pure character. Traditionally harvested only during a narrow window each spring, it was once reserved exclusively for the Chinese imperial court.",
      "brewing_instructions": "Teaware: A clear glass teapot or glass cup is ideal — let the beautiful silver needles be visible. Leaf amount: 4–5g per 150ml (slightly more than other teas, as the buds are light). Water temperature: 70–75°C — white tea is extremely delicate. Never use boiling water. No rinsing needed. Steeping: 1st brew: 2–3 minutes. 2nd brew: 3–4 minutes. 3rd brew: 4–5 minutes. Can be steeped 3–4 times. Tip: Cold brewing works beautifully — steep in cold water overnight in the fridge for an even sweeter, more delicate cup.",
      "mindfulness_note": "Silver Needle is a teacher of subtlety. If you rush it, you'll miss it entirely. Breathe slowly and let its quiet sweetness find you.",
      "url": "https://teachapter.com/product/silver-needle/"
    },
    {
      "name": "Aged Pu'er Tea Cake",
      "chinese_name": "普洱茶饼",
      "category": "Dark Tea, Pu'er Tea, Compressed Tea",
      "origin": "Yunnan Province, China",
      "aroma": "Earthy, woody, deep — like forest floor, aged wood, and wet earth",
      "colour": "Very deep reddish-brown, opaque and rich",
      "taste": "Full-bodied, smooth earthiness with a clean, lingering sweetness. No bitterness when properly brewed.",
      "description": "Pu'er is unique among teas — it is the only tea that genuinely improves with age, like a fine wine. It comes from Yunnan Province and is made from the leaves of ancient wild tea trees, some hundreds of years old. The tea undergoes a microbial fermentation process that transforms its character over time. Pu'er cakes are traditionally stored and traded as an investment — some aged cakes sell for thousands of dollars. There are two types: raw (sheng) pu'er which ages naturally over decades, and ripe (shou) pu'er which undergoes an accelerated fermentation. Both are deeply connected to the ancient Tea Horse Road trade route.",
      "brewing_instructions": "Before brewing — Breaking the cake: Use a pu'er pick or a butter knife. Insert at the edge of the cake and gently pry pieces loose — try to keep the leaves whole, not crushed to powder. This is called 'prying' the tea. Use about 6–8g per 100ml. Teaware: Yixing clay pot or a large gaiwan. A clay pot dedicated to pu'er is ideal — the absorbed earthy character enhances each subsequent brew. Water temperature: 95–100°C. First rinse: 1–2 quick rinses (5–10 seconds each), discarding the liquid — this is essential for aged pu'er to remove any storage notes. Steeping: 1st brew: 10–20 seconds (pu'er releases quickly). Add 5–10 seconds per subsequent brew. Can be steeped 10–15+ times.",
      "mindfulness_note": "Pu'er connects you to time itself. You are drinking something that has been slowly transforming, perhaps for longer than you have been alive.",
      "url": "https://teachapter.com/product-category/all-teas/puer-tea/"
    },
    {
      "name": "Jasmine Silver Needle",
      "chinese_name": "茉莉银针",
      "category": "Floral Tea",
      "origin": "Fujian Province, China",
      "aroma": "Intensely floral jasmine over a delicate white tea base",
      "colour": "Pale golden yellow",
      "taste": "Sweet floral jasmine with a clean, light, and refreshing finish",
      "description": "Jasmine Silver Needle is made by layering Silver Needle white tea buds with fresh jasmine blossoms during the night — jasmine flowers open only at night, releasing their fragrance. The process is repeated multiple times over several nights. The result is a tea that carries one of the most naturally intoxicating aromas imaginable. This is one of the most labour-intensive teas to produce and is considered a premium gift tea in China.",
      "brewing_instructions": "Teaware: A tall clear glass or glass gaiwan to appreciate the visual beauty of the silver buds. Leaf amount: 3–4g per 150ml. Water temperature: 75–80°C — protect the delicate jasmine fragrance. No rinsing needed. Steeping: 1st brew: 2 minutes. 2nd brew: 2–3 minutes. Tip: Do not over-steep — the jasmine can become cloying. 2 steeps is ideal.",
      "mindfulness_note": "Jasmine was used in ancient Chinese ceremonies to calm the mind before meditation. Let the fragrance arrive before the taste — scent is the fastest path to presence.",
      "url": "https://teachapter.com/product-category/all-teas/floral-tea/"
    },
    {
      "name": "Jin Jun Mei",
      "chinese_name": "金骏眉",
      "category": "Black Tea, Red Tea",
      "origin": "Wuyi Mountains, Fujian Province, China",
      "aroma": "Sweet, honey-like, with notes of dried longan, cocoa, and a faint smokiness",
      "colour": "Bright, clear amber-gold",
      "taste": "Incredibly smooth and sweet, with no bitterness — hints of honey, malt, and a floral sweetness",
      "description": "Jin Jun Mei (Golden Beautiful Eyebrow) is one of China's most prized black teas, developed only in 2005 but already considered a modern classic. It is made exclusively from the tiny golden tips (buds) of the tea plant, hand-picked in early spring. It takes approximately 10,000 hand-picked buds to produce just 500g of finished tea — making it one of the most labour-intensive teas in the world. Unlike many black teas, Jin Jun Mei needs no milk or sugar — its natural sweetness is complete.",
      "brewing_instructions": "Teaware: A gaiwan or a small purple clay teapot. A white porcelain gaiwan is ideal to appreciate the beautiful golden colour. Leaf amount: 4–5g per 100ml. Water temperature: 90–95°C. First rinse: Optional — a very quick 3-second rinse. Steeping: 1st brew: 15–20 seconds. 2nd brew: 20–25 seconds. Add 5–10 seconds each time. Can be steeped 6–8 times.",
      "mindfulness_note": "Jin Jun Mei was made by hands that spent an entire day picking what fits in your palm. Let that sink in as you drink.",
      "url": "https://teachapter.com/product-category/all-teas/black-tea/"
    },
    {
      "name": "Mu Bai Compressed Tea (White Tea) – 2014",
      "source": "manually_saved",
      "description": "Supervised and crafted by renowned tea artist Li Shu Yun (李曙韵), this 2014 Mu Bai exhibits a rich taste and exquisite aroma. BREWING SUGGESTION Time — 30 Seconds Temperature —80-85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew For 250/350ml Infuser Cup"
    },
    {
      "name": "Bi Luo Chun",
      "source": "manually_saved",
      "description": "Produced from the Dongting mountain of Taihu in Jiangsu province, Bi Luo Chun tea trees are grown between trees bearing sweet-scented fruits, which gives the tea a fruity and flowery aroma. It was also named after Lady Bi Luo in a love story that happened in Tai Hu. BREWING SUGGESTION Time — 20 seconds Temperature — 70-80°C Weight — 4 / 6g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Ming Qian Dragon Well",
      "source": "manually_saved",
      "description": "Ming Qian Dragon Well is a top-quality green tea harvested before the Qing Ming Festival every year just at the dawn of spring. Its leaves are plucked at the first flush, containing the most nutrients and bearing a pure, delicate taste. BREWING SUGGESTION Time — 20 seconds Temperature — 70-80°C Weight — 4 / 6g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Liu Bao Tea Brick – 2013",
      "source": "manually_saved",
      "description": "Another type of dark tea from Liu Bao, Guangxi, China, this Liu Bao Tea Brick carries a full-bodied taste with an earthy, woody flavour and smooth down the throat. HEALTH BENEFITS • Improves digestion • Regulation of lipid metabolism • High in antioxidants BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Golden Cassia Teabags (20pcs)",
      "source": "manually_saved",
      "description": "Golden Cassia tea was discovered in Anxi village, Fujian, China, sometime between 1850 and 1860. This Chinese tea and its variants are made from oolong tea shoots, which produces a golden yellow colour during its brew, hence its name. An alternative name for the Golden Cassia used in Zhao An Tea, or ‘Eight Immortals Tea’ (八仙茶). This tea is also available in loose leaf form. BREWING SUGGESTION Time — 2 minutes Temperature — 85°C Water — 250ml"
    },
    {
      "name": "Wild Dian Hong",
      "source": "manually_saved",
      "description": "This unique and organic Wild Dian Hong (a Black/Red Tea) is harvested from ancient trees located in the primeval forests deep within the Lincang mountain range. Instead of processing using the modern black tea methodology, the ancient method of sun-drying was adopted. This creates a tea that exhibits a gentle, sweet aroma along with a fresh and full-bodied taste. The amino acids and the polyphenols are retained with the help of the ancient sun-drying methodology. BREWING SUGGESTION Time — 30 seconds Temperature — 95°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Jasmine Pearls Teabags (20pcs)",
      "source": "manually_saved",
      "description": "Jasmine Pearls teabags are a convenient way to experience this uniquely shaped, high-grade variant of our Jasmine tea, combining a light-bodied green tea with superior-grade Jasmine flowers. It’s a refreshing floral twist for green tea lovers. Also available as a loose leaf tea. BREWING SUGGESTION Time — 1.5 minutes Temperature — 75°C Water — 250ml"
    },
    {
      "name": "Guan Yin Wang",
      "source": "manually_saved",
      "description": "Using top-quality Tie Guan Yin tea leaves, Guan Yin Wang undergoes a fermentation process shorter than that of the usual Tie Guan Yin. The lighter fermentation allows its drinker to truly appreciate its brewed aroma while offering a lighter taste, closer to that of green tea. BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Dong Ding Oolong",
      "source": "manually_saved",
      "description": "Produced in Nantou and Jayi regions of Taiwan, Dong Ding Oolong is manufactured only from tea trees that grow above the altitude of 1200m. The tea leaves are a vivid dark green and are rolled into small pearls. When brewed, the tea exhibits an aroma of flowers and is incredibly light on the palate. BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Phoenix Shrubbery",
      "source": "manually_saved",
      "description": "Phoenix Shrubbery is a semi-oxidised tea from the Fenghuang mountain of Guangdong province. Harvested from centurial tea trees, its tea carries a fruity and ginger-like aroma. It is commonly prepared using the Gongfu Cha method, and believed by the locals to be best drank from small porcelain or clay cups to savour its rich taste. BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Mini Tuo Tea, Glutinous Rice Fragrance (Ripe Pu'er)",
      "source": "manually_saved",
      "description": "Mini Tuo Tea or “Tuo Cha” is shaped from superior Pu’er tea steamed at a high temperature. It yields a fragrant liquor upon infusion, producing a fresh and aromatic drink with the aroma of glutinous rice."
    },
    {
      "name": "Full Blossom (10pcs)",
      "source": "manually_saved",
      "description": "Full Blossom is an exquisite flowering tea blend of dried superior-grade jasmine and a light-bodied green tea, hand-sewn into balls that unfurl into full bloom when steeped. BREWING SUGGESTION Time — 2 minutes Temperature — 80°C Water — 250ml"
    },
    {
      "name": "Golden Key",
      "source": "manually_saved",
      "description": "Grown in the Wuyi mountain of Fujian China, the leaves of the Golden Key Oolong tea plant are three inches long with a subtle gold colour underbelly. When brewed, the tea turns clear with mild golden-brown hue, and has a lasting aftertaste with a fruity fragrance. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Golden Cassia",
      "source": "manually_saved",
      "description": "The Golden Cassia was discovered in Anxi village, Fujian, China, sometime between 1850 and 1860. This Chinese tea and its variants are made from oolong tea shoots, which produces a golden yellow colour during its brew, hence its name. An alternative name for the Golden Cassia used in Zhaoan China is “Eight Immortals Tea”(八仙茶). BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Yue Guang Bai (Moonlight Beauty)",
      "source": "manually_saved",
      "description": "One of Simao area's speciality teas, Yue Guang Bai (Moonlight Beauty) is a white tea from Yunnan. Its naming comes from unconventional harvesting and manufacturing timings, which must be done at night under the moonlight. The slow drying process under the gentle moonlight creates a light tea with subtle notes of honey and young sprouts. Brewing this tea at different water temperatures creates entirely different experiences. With 85°C water, the tea exhibits the previously mentioned subtle notes of honey and young sprouts. With 100°C water, the tea transforms into a medium-bodied tea with strong honey notes, similar to that of black tea. BREWING SUGGESTION Time — 20 Seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Tea Chapter 28th Anniversary Compressed Tea (Raw Pu'er) – 2017",
      "source": "manually_saved",
      "description": "From one of the 6 most sought after ancient mountains that produces Pu’er, this prized tea from the Yiwu Mountains of Yunnan, was specially selected to commemorate Tea Chapter's 28th anniversary. The Raw Pu’er is aged to give a complex taste that develops from a slight bitterness into a sweetness, with a strong aftertaste that gently lingers. BREWING SUGGESTION Time — 30 Seconds Temperature — 90°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "White Peony",
      "source": "manually_saved",
      "description": "Produced in Fuding, Fujian, White Peony is a mildly fermented tea that is very lightly processed to retain high levels of antioxidants. This white tea is made from rgwmore tender shoots of the tea plant to make a premium-grade cup of tea. It has a pleasantly sweet taste similar to fruit and honey. BREWING SUGGESTIONS Time — 20 Seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml (Infuser Cup Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Citrus Pu'er (10pcs)",
      "source": "manually_saved",
      "description": "Citrus Pu’er (小青柑) has the aroma and fragrance of dried citrus fruit (2017) and the flavour of aged Pu’er (2015) tea. BREWING SUGGESTION Time — 30 Seconds Temperature — 100°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Keemun Red Tea",
      "source": "manually_saved",
      "description": "One of the world's three most famous red (or black) teas, the Keemun Red Tea makes for a versatile beverage that pairs well with most types of food. BREWING SUGGESTION Time — 30 Seconds Temperature — 95°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Meng Ku Zhi Xing Compressed Tea (Raw Pu'er) – 2017",
      "source": "manually_saved",
      "description": "The Meng Ku Zhi Xing raw Pu’er is reminiscent of a complex green tea, with a fresh fragrance and a smooth and slightly sweet taste. HEALTH BENEFITS • Reduces cholesterol levels • Alleviates metabolic syndrome BREWING SUGGESTION Time — 30 Seconds Temperature —90°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Scarlet Robe",
      "source": "manually_saved",
      "description": "Touted as the “Emperor Tea of Wuyi” and the best of the great four of Wuyi Mountain, Scarlet Robe is a heavily fermented Oolong has captivated the taste buds of millions who savour its woody flavour. Its leaves are semi-oxidised (40%) to give a dark amber tint and an aroma of ripe fruit and wood. Though heavily roasted, its aroma remains soothing with a mellow finish. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Iron Arhat",
      "source": "manually_saved",
      "description": "Named as one of the great four of Wuyi mountain, Iron Arhat is grown in between the rocky mountains of northern Fujian province. It is believed that the Iron Arhat has been cultivated since the Song Dynasty, between 960 and 1279, making it one of the earliest teas to be grown in the Wuyi region. Iron Arhat embodies a strong flavour and scent that blends fruit and charcoal. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Lapsang Souchong",
      "source": "manually_saved",
      "description": "Lapsang Souchong is a Black (or Red) tea originating from the Wuyi region of Fujian and best known for its uniquely smoky scent. In its processing, the tea is smoked with pine fire and easily reminds you of a barbecue or a campfire. BREWING SUGGESTION Time — 30 seconds Temperature — 95°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Ban Pen Ancient Tea Tree (Raw Pu'er) – 2019",
      "source": "manually_saved",
      "description": "With hints of floral and dried longan notes, Ban Pen Ancient Tea Tree Pu’er is harvested at Banpen Village at an altitude of 1760 meters. This brownish-red brew is slightly on the bitter side and suits the palate of tea enthusiast who prefers a stronger-tasting tea. BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 6 / 8g Water — 250 / 350ml (Infuser Cup Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Da Xue Shan (Raw Pu'er) – 2021",
      "source": "manually_saved",
      "description": "From the Da Xue Shan (大雪山) mountain region of Yunnan, this raw Pu’er has a complex flavour, from a slight bitterness and subtle sweetness reminiscent of stone fruits. Enjoy now or later to observe the subtle changes to taste as the tea ages. Brewing Suggestion Time — 30 Seconds Temperature —90°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Dragon Well",
      "source": "manually_saved",
      "description": "Dragon Well is a pan-fried green tea produced in the West Lake of Hangzhou. It is said to have been named after a well that contains relatively dense water. After a rainfall, the lighter rainwater floating on its surface would exhibit a sinuous and twisting boundary with the well water, resembling the movements of a Chinese dragon. Dragon Well exudes a refreshing aroma of roasted chestnuts or beans. This tea is rich in vitamin C and is purported to have anti-inflammatory and antioxidant properties. As a beverage that cools one down effectively, Dragon Well is recommended if you want to cool down from the scorching heat. BREWING SUGGESTION Time — 20 seconds Temperature — 70-80°C Weight — 4 / 6g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Imperial Pu'er",
      "source": "manually_saved",
      "description": "Aged for more than 10 years, this ripe Pu’er is sweet, mellow and full-bodied with light traces of bitterness and a sweet aftertaste. Great for seasoned tea drinkers as well as for those that are exploring aged pu’er. BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Ba Nuo (Ripe Pu'er)",
      "source": "manually_saved",
      "description": "This Ba Nuo is harvested from ancient trees from Ba Nuo Village in Yunnan, China. BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Ban Tian Yao",
      "source": "manually_saved",
      "description": "Ban Tian Yao is produced in the Wuyi mountain of Fujian, China. The tea carries a special name which means halfway to the sky, taken literally from how the tea grows—on a high cliff, to look like it is hanging on the sky. Ban Tian Yao Oolong Tea bears a deep history and has existed since the 18th century. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Chen Xiang Old Tea Brick (Ripe Pu'er) – 2000",
      "source": "manually_saved",
      "description": "This Chen Xiang Old Tea Brick prides itself as the most mature compressed Pu’er at Tea Chapter. This Pu’er carries a full-bodied taste attributed to both its cooking and ageing processes, to give a woody flavour that is mellow, sweet and smooth down the throat. HEALTH BENEFITS • Improves digestion • Regulation of lipid metabolism • High in antioxidants BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Top Grade Narcissus",
      "source": "manually_saved",
      "description": "Narcissus is one of the best-known Oolong teas in the world. Originating from Northern Fujian, this heavily fermented Oolong carries a scent with a hint of bamboo and a rich and smoky flavour. Brewing Suggestion: Time: 30 Seconds Temp: 100°C Weight: 6/8g Water: 250/350ml Infuser Cup Brews: Can be brewed for 3 rounds (add 10 seconds for each subsequent brew)"
    },
    {
      "name": "Osmanthus Tea",
      "source": "manually_saved",
      "description": "Osmanthus Tea is the perfect blend of sweet-scented osmanthus flowers and oolong tea, a favourite among floral tea lovers for its full-bodied and flowery honey notes. BREWING SUGGESTION Time — 20 Seconds Temperature — 80°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Silver Needles",
      "source": "manually_saved",
      "description": "Silver Needles is an imperial harvest tea produced in Fujian province of China. Consisting purely of pekoes (the newest and most tender part) of the tea plant, Silver Needles tea has a sweet, velvety taste and mouthfeel. The tea is minimally processed and dried, resulting in high levels of antioxidants with anti-ageing benefits. BREWING SUGGESTION Time — 20 Seconds Temperature — 80°C Weight — 6 / 8g Water — 250 / 350ml (Infuser Cup Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Imperial Pu'er Teabags (20pcs)",
      "source": "manually_saved",
      "description": "Pu’er (or Pu-erh) is a type of fermented dark tea produced in Yunnan province, famous worldwide for its taste complexity and potential health benefits. This mature tea is even used as a medicine in some countries. But instead of mirroring the bitter taste of most medicines, the taste of Pu’er is better likened to a deep breath of fresh air in a springtime pine forest, after heavy rain. BREWING SUGGESTION Time — 2 minutes Temperature — 95°C Water — 250ml"
    },
    {
      "name": "Supreme Grade Tie Guan Yin",
      "source": "manually_saved",
      "description": "Tie Guan Yin is the most well-known lightly fermented Oolong tea from Anxi, Fujian in China. This medium-bodied tea falls between green and red tea in both character and colour. The story of Tie Guan Yin originates from a Buddhist devotee who offered tea to the Avalokitasvara Bodhisattva every morning. There was a night that he dreamt of a truly unique tea tree that was beyond his wildest imaginations. The next morning it appeared right before his eyes while he was heading to the tea plantation. Shocked and thrilled, he brought back the tree and grew it in his garden. The brew exhibited unique metallic-like colours while the tea resembled the Avalokitasvara bodhisattva. Henceforth, the tea was named *Tie Guan Yin' [鐵觀音]. *Tie Guan Yin means the Iron Buddha of Mercy BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Bu Zhi Chun",
      "source": "manually_saved",
      "description": "Prided as one of the most aromatic teas produced in the Wuyi Mountain in Fujian Province, Bu Zhi Chun carries notes of flowers and ripe fruit alongside its signature smoky and aged scent. The origins of its name are traced to its special harvesting season that occurs just at the end of winter and the dawn of spring, hence the name, Bu Zhi Chun [不知春], which translates literally to 'not knowing Spring'. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Mini Tuo Tea, Glutinous Rice Flavour (Ripe Pu'er)",
      "source": "manually_saved",
      "description": "Mini Tuo Tea or “Tuo Cha” is shaped from superior Pu’er tea steamed at a high temperature. It yields a fragrant liquor upon infusion, producing a fresh and aromatic drink with the aroma of glutinous rice."
    },
    {
      "name": "Silver Hair Jasmine",
      "source": "manually_saved",
      "description": "A blend of superior-grade jasmine flowers and Fujian green tea makes for this high-grade Silver Hair Jasmine tea. It is best sipped on slowly to ease stress and to enjoy a distinctively smooth finish and a rich aroma. BREWING SUGGESTION Time — 30 seconds Temperature — 75°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Shui Jin Gui",
      "source": "manually_saved",
      "description": "Shui Jin Gui is a semi-oxidised tea and one of the great four teas of Wuyi mountain. When brewed, the tea has a bright golden sheen that closely resembles that of the golden tortoise, hence its name (水金龟, or 'Golden Tortoise'). Shui Jin Gui has a special mellow and refreshing taste similar to that of Tie Guan Yin and green tea. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Top Grade Rou Gui",
      "source": "manually_saved",
      "description": "This smoky, full-bodied Top Grade Rou Gui is a product of the famous Wu Yi mountain in Fujian Province. Apart from its Wu Yi characteristics, Rou Gui's brew exhibits a hint of cinnamon in both its taste and aroma, which explains how this heavily fermented tea was given the name 'Rou Gui' [肉桂], or 'cinnamon'. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Yunnan Cultural Revolution Tea Bricks (Ripe Pu'er) – 2016",
      "source": "manually_saved",
      "description": "Yunnan Cultural Revolution Tea Bricks dedicates itself as a modern variant of compressed tea that originated shortly after the Yunnan cultural revolution. The result is a similarly complex tea with a flavour that is sweetly smooth and mellow. This set comes with five individually packaged bricks with vintage wrapping. BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Dragon Well Teabags (20pcs)",
      "source": "manually_saved",
      "description": "Dragon Well is a pan-fried green tea produced in the West Lake of Hangzhou. It is said to have been named after a well that contains relatively dense water. After a rainfall, the lighter rainwater floating on its surface would exhibit a sinuous and twisting boundary with the well water, resembling the movements of a Chinese dragon. Dragon Well exudes a refreshing aroma of roasted chestnuts or beans. This tea is rich in vitamin C and is purported to have anti-inflammatory and antioxidant properties. As a beverage that cools one down effectively, Dragon Well is recommended if you want to cool down from the scorching heat. Enjoy these Dragon Well Teabags at your convenience, or in traditional loose leaf form. BREWING SUGGESTION Time — 1.5 minutes Temperature — 75°C Water — 250ml"
    },
    {
      "name": "Jasmine Tea",
      "source": "manually_saved",
      "description": "A combination of oolong and jasmine makes this floral Jasmine tea. It bears a sweet floral scent that is light on your palate – perfect for relaxing and winding down. BREWING SUGGESTION Time — 30 Seconds Temperature — 75°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "High Mountain Tea",
      "source": "manually_saved",
      "description": "Produced in Nantou and Jayi regions of Taiwan, High Mountain Tea is manufactured only by tea trees that grow above the altitude of 1000m. The tea leaves are a vivid dark green and are rolled into small pearls. When brewed, the tea exhibits an aroma of flowers and is incredibly light on the palate. BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Jasmine Pearls",
      "source": "manually_saved",
      "description": "Jasmine Pearls (or Jasmine Dragon Pearls) is our top-grade floral tea. Its unique shape is hand-rolled using a light-bodied green tea and infused with the aroma of superior-grade jasmine flowers for a refreshing floral twist. BREWING SUGGESTION Time — 20 Seconds Temperature — 80°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Pu'er",
      "source": "manually_saved",
      "description": "Pu’er (or pu-erh) is a type of fermented dark tea produced in Yunnan province, famous worldwide for its taste complexity and potential health benefits. This mature tea is even used as a medicine in some countries. But instead of mirroring the bitter taste of most medicines, the taste of Pu’er is better likened to a deep breath of fresh air in a springtime pine forest, after heavy rain. Brewing Suggestion Time — 30 seconds Temperature — 100°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Aged Narcissus",
      "source": "manually_saved",
      "description": "Produced in the Wuyi mountain of Fujian China, Aged Narcissus is handmade and allowed to oxidise to about 60%. This tea is more heavily baked with charcoal than other rock teas, resulting in a relatively dark rock tea-type Oolong with a full body. BREWING SUGGESTION Time — 30 seconds Temperature — 100°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Vintage Pu'er",
      "source": "manually_saved",
      "description": "This rare 18-year-old ripe Vintage Pu’er is sweet, mellow and full-bodied with light traces of bitterness and a sweet aftertaste. It is for sure an interesting selection for seasoned drinkers. BREWING SUGGESTION Time — 30 Seconds Temperature —100°C Weight — 5 / 7g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Aged White Tea, 80g",
      "source": "manually_saved",
      "description": "Produced in Fuding, Fujian, White Peony is a mildly fermented tea that is very lightly processed to retain high levels of antioxidants. This white tea is made from rgwmore tender shoots of the tea plant to make a premium-grade cup of tea. It has a pleasantly sweet taste similar to fruit and honey. BREWING SUGGESTIONS Time — 20 Seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml (Infuser Cup Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Oriental Beauty",
      "source": "manually_saved",
      "description": "Oriental Beauty is a heavily fermented (60-70% oxidised) tea produced in the Hsinchu and Taoyuan regions of Taiwan. Also known as Dong Fang Mei Ren, it's the 'Chin-Shin Da Pan' (青心大億) cultivar grown without pesticides to deliberately encourage a common pest, the tea green leafhopper (Jacobiasca formosana), to feed on its leaves, stems, and buds. These insects suck the phloem juices of the plant which leads to its production of monoterpene diol and hotrienol that together give the tea its unique flavour. It was once thought that a tea farmer in Beipu noticed that small green insects, later known as cicadas, had damaged the leaves of his newly picked spring crop. Rather than destroying his crop, he decided to process the leaves into tea. He then took his product to a local tea merchant, who liked it well enough to pay him twice the price of his usual tea. When he returned to his village, he boasted to his neighbours about his success. They believed he was exaggerating and so named his tea, 'Peng Feng Cha' [膨風茶], or Braggart's tea. BREWING SUGGESTION Time — 30 seconds Temperature — 85°C Weight — 6 / 8g Water — 250 / 350ml Brews — Can be brewed for 3 rounds; add 10 seconds for each subsequent brew"
    },
    {
      "name": "Jin Xuan",
      "chinese_name": "金萱",
      "category": "Oolong Tea, Taiwanese Oolong",
      "origin": "Jayi and Nantou regions, Taiwan",
      "aroma": "Naturally milky and creamy — light, delicate, almost buttery",
      "colour": "Golden yellow, clear and bright",
      "taste": "Smooth and light on the palate with a distinctive natural creaminess. No bitterness. Clean, sweet finish.",
      "description": "Jin Xuan (金萱) is a Taiwanese oolong cultivar developed in 1980 by the Tea Research and Extension Station in Taiwan. It is grown exclusively at altitudes above 1,000 metres in the Nantou and Jayi regions of Taiwan. The leaves are vivid dark green and rolled into small, tight pearls — a form that helps preserve freshness. What makes Jin Xuan unique is its naturally occurring milky, creamy aroma, which comes entirely from the tea plant itself and not from any added flavouring. This sets it apart from artificially flavoured 'milk oolong' teas found elsewhere. It is incredibly gentle on the palate — light, smooth, and subtly sweet — making it an excellent choice for those new to oolongs.",
      "brewing_instructions": "Teaware: A gaiwan or small teapot (150–200ml) works well. A porcelain gaiwan is ideal to appreciate its light colour. Leaf amount: 6–8g per 250–350ml of water. Water temperature: 85°C — do not use boiling water, which would strip the delicate milky aroma. No rinsing needed. Steeping: 1st brew: 30 seconds. 2nd brew: 40 seconds. 3rd brew: 50 seconds. Can be brewed 3 rounds. Tip: The milky aroma is most pronounced in the first two steeps — breathe it in before sipping.",
      "mindfulness_note": "Jin Xuan asks nothing of you. Let its gentle creaminess arrive quietly — this is a tea for soft attention, not analysis.",
      "url": "https://teachapter.com/product/jin-xuan/"
    }
  ],
  "pages": [],
  "blog_posts": []
};
