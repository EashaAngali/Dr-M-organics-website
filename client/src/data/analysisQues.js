export const hairQuestions = [

  {
    id: "hairConcern",
    question: "What is your main hair concern?",
    options: [
      {
        label: "Hair fall",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Dandruff",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Frizzy hair",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Dry and rough hair",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Thin or weak hair",
        tags: ["weak-hair", "hair-strengthening"]
      },
      {
        label: "Curly hair that is difficult to manage",
        tags: ["curly-hair", "frizz", "curl-care"]
      }
    ]
  },

  {
    id: "hairNow",
    question: "How would you describe your hair right now?",
    options: [
      {
        label: "Soft and silky",
        tags: ["normal-hair", "shine"]
      },
      {
        label: "Dry",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Very dry and rough",
        tags: ["very-dry-hair", "repair", "moisturizing"]
      },
      {
        label: "Frizzy",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Oily",
        tags: ["oily-hair", "oil-balance"]
      },
      {
        label: "Dull and lifeless",
        tags: ["dull-hair", "shine", "repair"]
      }
    ]
  },

  {
    id: "hairGoal",
    question:
      "What result do you expect from your hair-care products?",
    options: [
      {
        label: "Reduce hair fall",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Control dandruff",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Reduce frizz and make hair smoother",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Make dry hair soft and moisturized",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Improve shine and silky texture",
        tags: ["shine", "smoothing"]
      },
      {
        label: "Define and maintain curls",
        tags: ["curly-hair", "curl-care", "moisturizing"]
      }
    ]
  },

  {
    id: "hairFallAmount",
    question:
      "How much hair fall do you currently notice?",
    options: [
      {
        label: "Very little",
        tags: ["mild-hair-fall"]
      },
      {
        label: "Mild hair fall",
        tags: ["hair-fall"]
      },
      {
        label: "Moderate hair fall",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Heavy hair fall",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label:
          "Hair comes out noticeably during washing or brushing",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Severe or sudden hair fall",
        tags: ["hair-fall", "professional-consult"],
        alert: true
      }
    ]
  },

  {
    id: "hairFallTiming",
    question:
      "When do you notice the most hair fall?",
    options: [
      {
        label: "While shampooing",
        tags: ["hair-fall", "gentle-hair-care"]
      },
      {
        label: "While brushing",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Throughout the day",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "After applying oil",
        tags: ["hair-fall", "scalp-care"]
      },
      {
        label: "Hair is getting thinner gradually",
        tags: ["thinning", "hair-strengthening"]
      },
      {
        label: "I do not have noticeable hair fall",
        tags: ["no-hair-fall"]
      }
    ]
  },

  {
    id: "thinning",
    question: "Is your hair becoming thinner?",
    options: [
      {
        label: "No",
        tags: ["no-thinning"]
      },
      {
        label: "Slightly thinner than before",
        tags: ["thinning", "hair-strengthening"]
      },
      {
        label: "Hair feels weak and fine",
        tags: ["weak-hair", "hair-strengthening"]
      },
      {
        label: "Scalp is becoming more visible",
        tags: [
          "thinning",
          "hair-strengthening",
          "professional-consult"
        ]
      },
      {
        label: "Thinning mainly around the front",
        tags: ["thinning", "hair-strengthening"]
      },
      {
        label: "Thinning mainly around the crown/top",
        tags: ["thinning", "hair-strengthening"]
      }
    ]
  },

  {
    id: "dandruff",
    question: "Do you have dandruff?",
    options: [
      {
        label: "No dandruff",
        tags: ["no-dandruff"]
      },
      {
        label: "Mild white flakes",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Moderate dandruff",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Heavy dandruff",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Oily or sticky dandruff",
        tags: ["dandruff", "oily-scalp", "oil-balance"]
      },
      {
        label: "Dandruff with itching or redness",
        tags: [
          "dandruff",
          "sensitive-scalp",
          "soothing"
        ]
      }
    ]
  },

  {
    id: "scalpFeel",
    question: "How does your scalp usually feel?",
    options: [
      {
        label: "Normal and comfortable",
        tags: ["normal-scalp"]
      },
      {
        label: "Oily",
        tags: ["oily-scalp", "oil-balance"]
      },
      {
        label: "Very oily",
        tags: ["very-oily-scalp", "oil-balance"]
      },
      {
        label: "Dry",
        tags: ["dry-scalp", "moisturizing"]
      },
      {
        label: "Itchy",
        tags: ["itchy-scalp", "soothing", "scalp-care"]
      },
      {
        label: "Flaky or irritated",
        tags: [
          "sensitive-scalp",
          "soothing",
          "scalp-care"
        ]
      }
    ]
  },

  {
    id: "afterWash",
    question:
      "How would you describe your hair texture after washing?",
    options: [
      {
        label: "Smooth and silky",
        tags: ["normal-hair", "shine"]
      },
      {
        label: "Slightly dry",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Rough",
        tags: ["dry-hair", "repair"]
      },
      {
        label: "Very frizzy",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Tangled and difficult to manage",
        tags: ["tangled-hair", "conditioning", "smoothing"]
      },
      {
        label:
          "Dry at the ends but oily near the scalp",
        tags: [
          "combination-hair",
          "oil-balance",
          "moisturizing"
        ]
      }
    ]
  },

  {
    id: "frizzAmount",
    question: "How much frizz do you experience?",
    options: [
      {
        label: "No frizz",
        tags: ["no-frizz"]
      },
      {
        label: "Slight frizz",
        tags: ["frizz"]
      },
      {
        label: "Frizz mainly after washing",
        tags: ["frizz", "conditioning"]
      },
      {
        label: "Frizz in humid weather",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Frizzy almost every day",
        tags: ["frizz", "smoothing", "moisturizing"]
      },
      {
        label:
          "Extremely dry, rough, and frizzy hair",
        tags: [
          "frizz",
          "very-dry-hair",
          "repair",
          "moisturizing"
        ]
      }
    ]
  },

  {
    id: "hairPattern",
    question: "What is your natural hair pattern?",
    options: [
      {
        label: "Straight",
        tags: ["straight-hair"]
      },
      {
        label: "Slightly wavy",
        tags: ["wavy-hair"]
      },
      {
        label: "Wavy",
        tags: ["wavy-hair"]
      },
      {
        label: "Loose curls",
        tags: ["curly-hair", "curl-care"]
      },
      {
        label: "Curly",
        tags: ["curly-hair", "curl-care"]
      },
      {
        label: "Very curly / coily",
        tags: [
          "coily-hair",
          "curl-care",
          "moisturizing"
        ]
      }
    ]
  },

  {
    id: "curlConcern",
    question:
      "If you have curly or wavy hair, what is your main concern?",
    options: [
      {
        label: "Curls lose their shape",
        tags: ["curl-care"]
      },
      {
        label: "Hair becomes frizzy",
        tags: ["curly-hair", "frizz", "smoothing"]
      },
      {
        label: "Curls feel dry",
        tags: ["curly-hair", "dry-hair", "moisturizing"]
      },
      {
        label: "Hair gets tangled easily",
        tags: [
          "curly-hair",
          "tangled-hair",
          "conditioning"
        ]
      },
      {
        label: "I want softer and more defined curls",
        tags: [
          "curl-care",
          "moisturizing",
          "smoothing"
        ]
      },
      {
        label: "I do not have curly or wavy hair",
        tags: ["not-curly"]
      }
    ]
  },

  {
    id: "hairDryness",
    question: "How dry does your hair feel?",
    options: [
      {
        label: "Not dry",
        tags: ["normal-hair"]
      },
      {
        label: "Slightly dry",
        tags: ["dry-hair"]
      },
      {
        label: "Dry mainly at the ends",
        tags: ["dry-ends", "conditioning"]
      },
      {
        label: "Dry throughout the hair",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Very dry and rough",
        tags: [
          "very-dry-hair",
          "moisturizing",
          "repair"
        ]
      },
      {
        label: "Extremely dry, brittle, and damaged",
        tags: [
          "very-dry-hair",
          "brittle-hair",
          "repair",
          "moisturizing"
        ]
      }
    ]
  },

  {
    id: "damage",
    question: "Does your hair feel damaged?",
    options: [
      {
        label: "No",
        tags: ["no-damage"]
      },
      {
        label: "Slightly damaged",
        tags: ["repair"]
      },
      {
        label: "Hair breaks easily",
        tags: [
          "brittle-hair",
          "repair",
          "hair-strengthening"
        ]
      },
      {
        label: "Split ends and rough texture",
        tags: ["split-ends", "repair", "conditioning"]
      },
      {
        label: "Damaged from heat styling",
        tags: ["heat-damage", "repair"]
      },
      {
        label:
          "Damaged from colouring, bleaching, or chemical treatments",
        tags: ["chemical-damage", "repair"]
      }
    ]
  },

  {
    id: "topHairResult",
    question:
      "Choose the ONE result you want the most.",
    weight: 3,
    options: [
      {
        label: "Less hair fall",
        tags: ["hair-fall", "hair-strengthening"]
      },
      {
        label: "Dandruff-free scalp",
        tags: ["dandruff", "scalp-care"]
      },
      {
        label: "Smooth and frizz-free hair",
        tags: ["frizz", "smoothing"]
      },
      {
        label: "Soft and moisturized hair",
        tags: ["dry-hair", "moisturizing"]
      },
      {
        label: "Silky and shiny hair",
        tags: ["shine", "smoothing"]
      },
      {
        label: "Defined and manageable curls",
        tags: ["curly-hair", "curl-care"]
      }
    ]
  }

];


/* ======================================
   SKIN QUESTIONS
====================================== */

export const skinQuestions = [

  {
    id: "skinFeel",
    question:
      "How does your skin usually feel 1–2 hours after washing?",
    options: [
      {
        label: "Very oily and shiny",
        tags: ["oily-skin", "oil-control"]
      },
      {
        label:
          "Oily mainly on forehead, nose, and chin",
        tags: ["combination-skin", "oil-control"]
      },
      {
        label: "Normal and comfortable",
        tags: ["normal-skin"]
      },
      {
        label: "Dry and tight",
        tags: ["dry-skin", "hydration", "barrier-care"]
      },
      {
        label:
          "Dry in some areas and oily in others",
        tags: [
          "combination-skin",
          "hydration",
          "oil-control"
        ]
      },
      {
        label:
          "Sensitive, red, or easily irritated",
        tags: [
          "sensitive-skin",
          "soothing",
          "barrier-care"
        ]
      }
    ]
  },

  {
    id: "mainSkinConcern",
    question: "What is your main skin concern?",
    options: [
      {
        label: "Acne or pimples",
        tags: ["acne", "acne-care"]
      },
      {
        label: "Blackheads / whiteheads",
        tags: ["comedones", "pore-care", "acne-care"]
      },
      {
        label: "Open pores and excess oil",
        tags: [
          "open-pores",
          "oil-control",
          "pore-care"
        ]
      },
      {
        label: "Tanning or uneven skin tone",
        tags: [
          "tanning",
          "brightening",
          "uneven-tone"
        ]
      },
      {
        label: "Dry, rough, or dull skin",
        tags: ["dry-skin", "hydration", "dull-skin"]
      },
      {
        label: "Redness or irritation",
        tags: [
          "sensitive-skin",
          "soothing",
          "barrier-care"
        ]
      }
    ]
  },

  {
    id: "cloggedPores",
    question:
      "What type of clogged pores or acne do you notice?",
    options: [
      {
        label: "Mostly blackheads",
        tags: ["blackheads", "comedones", "pore-care"]
      },
      {
        label: "Mostly whiteheads",
        tags: ["whiteheads", "comedones", "acne-care"]
      },
      {
        label: "Both blackheads and whiteheads",
        tags: [
          "blackheads",
          "whiteheads",
          "comedones",
          "pore-care"
        ]
      },
      {
        label: "Small bumps under the skin",
        tags: ["comedones", "acne-care"]
      },
      {
        label: "Red or inflamed pimples",
        tags: ["acne", "inflamed-acne", "soothing"]
      },
      {
        label:
          "I do not have acne or clogged pores",
        tags: ["no-acne"]
      }
    ]
  },

  {
    id: "pores",
    question: "How noticeable are your pores?",
    options: [
      {
        label: "Very large and visible",
        tags: ["open-pores", "pore-care"]
      },
      {
        label: "Mainly visible around my nose",
        tags: ["open-pores", "pore-care"]
      },
      {
        label: "Visible on cheeks and nose",
        tags: ["open-pores", "pore-care"]
      },
      {
        label: "Slightly visible",
        tags: ["pore-care"]
      },
      {
        label: "Filled with oil or blackheads",
        tags: [
          "open-pores",
          "blackheads",
          "oil-control",
          "pore-care"
        ]
      },
      {
        label: "Not noticeable",
        tags: ["normal-pores"]
      }
    ]
  },

  {
    id: "skinTone",
    question:
      "How would you describe your skin tone?",
    options: [
      {
        label: "Even and clear",
        tags: ["even-tone"]
      },
      {
        label: "Face is darker than my neck",
        tags: [
          "uneven-tone",
          "brightening",
          "tanning"
        ]
      },
      {
        label:
          "Some areas of my face are darker",
        tags: [
          "uneven-tone",
          "pigmentation",
          "brightening"
        ]
      },
      {
        label: "I have strong sun tanning",
        tags: ["tanning", "detan", "brightening"]
      },
      {
        label:
          "I have dark patches or pigmentation",
        tags: ["pigmentation", "brightening"]
      },
      {
        label: "My skin looks dull and uneven",
        tags: [
          "dull-skin",
          "uneven-tone",
          "brightening"
        ]
      }
    ]
  },

  {
    id: "darkCircles",
    question:
      "Do you have dark circles around your eyes?",
    options: [
      {
        label: "No",
        tags: ["no-dark-circles"]
      },
      {
        label: "Mild dark circles",
        tags: ["dark-circles", "under-eye"]
      },
      {
        label: "Moderate dark circles",
        tags: ["dark-circles", "under-eye"]
      },
      {
        label: "Very dark circles",
        tags: ["dark-circles", "under-eye"]
      },
      {
        label: "Dark circles with tired-looking eyes",
        tags: [
          "dark-circles",
          "under-eye",
          "dull-skin"
        ]
      },
      {
        label:
          "Dark circles with dryness around the eyes",
        tags: [
          "dark-circles",
          "under-eye",
          "hydration"
        ]
      }
    ]
  },

  {
    id: "irritation",
    question:
      "Does your skin become red, itchy, or irritated?",
    options: [
      {
        label: "Never",
        tags: ["not-sensitive"]
      },
      {
        label: "Occasionally",
        tags: ["sensitive-skin", "soothing"]
      },
      {
        label: "After using skincare products",
        tags: [
          "sensitive-skin",
          "soothing",
          "barrier-care"
        ]
      },
      {
        label: "After sun exposure",
        tags: ["sun-sensitivity", "soothing"]
      },
      {
        label: "Frequently",
        tags: [
          "sensitive-skin",
          "soothing",
          "barrier-care"
        ]
      },
      {
        label:
          "My skin is almost always sensitive or irritated",
        tags: [
          "sensitive-skin",
          "soothing",
          "barrier-care",
          "professional-consult"
        ],
        alert: true
      }
    ]
  },

  {
    id: "skinDryness",
    question:
      "How dry or rough does your skin feel?",
    options: [
      {
        label: "Not dry",
        tags: ["normal-hydration"]
      },
      {
        label: "Slightly dry",
        tags: ["dry-skin", "hydration"]
      },
      {
        label: "Dry after washing",
        tags: [
          "dry-skin",
          "hydration",
          "gentle-cleanser"
        ]
      },
      {
        label:
          "Dry and rough throughout the day",
        tags: [
          "dry-skin",
          "hydration",
          "barrier-care"
        ]
      },
      {
        label: "Flaky or peeling",
        tags: [
          "very-dry-skin",
          "hydration",
          "barrier-care"
        ]
      },
      {
        label:
          "Extremely dry and sensitive",
        tags: [
          "very-dry-skin",
          "sensitive-skin",
          "hydration",
          "barrier-care"
        ]
      }
    ]
  },

  {
    id: "skinGoal",
    question:
      "Which result do you want most from your skincare routine?",
    weight: 3,
    options: [
      {
        label: "Control oil and reduce pores",
        tags: ["oil-control", "pore-care"]
      },
      {
        label:
          "Reduce acne, blackheads, and whiteheads",
        tags: [
          "acne-care",
          "comedones",
          "pore-care"
        ]
      },
      {
        label:
          "Reduce tanning and uneven skin tone",
        tags: [
          "detan",
          "brightening",
          "uneven-tone"
        ]
      },
      {
        label:
          "Improve hydration and softness",
        tags: ["hydration", "dry-skin"]
      },
      {
        label: "Calm redness and irritation",
        tags: [
          "soothing",
          "sensitive-skin",
          "barrier-care"
        ]
      },
      {
        label:
          "Improve overall brightness and smoothness",
        tags: [
          "brightening",
          "dull-skin",
          "smoothing"
        ]
      }
    ]
  },

  {
    id: "nutritionSigns",
    question:
      "Do you also notice weakness in your hair, nails, or overall skin quality?",
    options: [
      {
        label: "No",
        tags: ["no-nutrition-concern"]
      },
      {
        label: "My nails break easily",
        tags: [
          "brittle-nails",
          "nutrition-support"
        ]
      },
      {
        label: "My hair feels weak or thin",
        tags: [
          "weak-hair",
          "nutrition-support"
        ]
      },
      {
        label: "I have increased hair fall",
        tags: [
          "hair-fall",
          "nutrition-support"
        ]
      },
      {
        label:
          "My skin feels unusually dry, dull, or rough",
        tags: [
          "dull-skin",
          "dry-skin",
          "nutrition-support"
        ]
      },
      {
        label:
          "I have weak nails, hair problems, and dull skin together",
        tags: [
          "brittle-nails",
          "weak-hair",
          "dull-skin",
          "nutrition-support"
        ]
      }
    ]
  },

  {
    id: "qualityConcern",
    question:
      "Which of these problems do you notice most often?",
    options: [
      {
        label: "Brittle or easily broken nails",
        tags: [
          "brittle-nails",
          "nutrition-support"
        ]
      },
      {
        label: "Weak or thinning hair",
        tags: [
          "weak-hair",
          "thinning",
          "nutrition-support"
        ]
      },
      {
        label: "Excessive hair shedding",
        tags: [
          "hair-fall",
          "nutrition-support"
        ]
      },
      {
        label: "Dry and dull skin",
        tags: [
          "dry-skin",
          "dull-skin",
          "nutrition-support"
        ]
      },
      {
        label:
          "Poor overall hair, skin, and nail quality",
        tags: ["nutrition-support"]
      },
      {
        label: "None of these",
        tags: ["no-nutrition-concern"]
      }
    ]
  },

  {
    id: "helpWith",
    question:
      "What would you like help with the most?",
    weight: 2,
    options: [
      {
        label: "A skincare routine only",
        tags: ["skin-routine"]
      },
      {
        label: "Acne and pore care",
        tags: ["acne-care", "pore-care"]
      },
      {
        label: "Brightening / de-tan care",
        tags: ["brightening", "detan"]
      },
      {
        label: "Dry or sensitive skin care",
        tags: [
          "dry-skin",
          "sensitive-skin",
          "hydration",
          "soothing"
        ]
      },
      {
        label:
          "Hair, skin, and nail nutritional support",
        tags: ["nutrition-support"]
      },
      {
        label:
          "Both skincare products and nutritional support",
        tags: [
          "skin-routine",
          "nutrition-support"
        ]
      }
    ]
  }

];


export const tagLabels = {

  "hair-fall": "Hair Fall Care",

  "hair-strengthening":
    "Hair Strengthening",

  dandruff:
    "Dandruff Control",

  "scalp-care":
    "Scalp Care",

  frizz:
    "Frizz Control",

  smoothing:
    "Smoothing",

  "dry-hair":
    "Dry Hair Care",

  "very-dry-hair":
    "Intensive Moisture",

  moisturizing:
    "Moisturizing",

  "weak-hair":
    "Weak Hair Support",

  thinning:
    "Thinning Hair Care",

  shine:
    "Shine & Silkiness",

  "curl-care":
    "Curl Care",

  "curly-hair":
    "Curly Hair Care",

  repair:
    "Hair Repair",

  conditioning:
    "Conditioning",

  "oil-balance":
    "Oil Balance",

  "oily-scalp":
    "Oily Scalp Care",

  "dry-scalp":
    "Dry Scalp Care",

  "sensitive-scalp":
    "Sensitive Scalp Care",

  soothing:
    "Soothing Care",

  acne:
    "Acne Care",

  "acne-care":
    "Acne Care",

  comedones:
    "Blackhead & Whitehead Care",

  "pore-care":
    "Pore Care",

  "open-pores":
    "Visible Pore Care",

  "oil-control":
    "Oil Control",

  tanning:
    "Tan Care",

  detan:
    "De-Tan Care",

  brightening:
    "Brightening",

  "uneven-tone":
    "Uneven Tone Care",

  pigmentation:
    "Pigmentation Care",

  "dry-skin":
    "Dry Skin Care",

  "very-dry-skin":
    "Intensive Hydration",

  hydration:
    "Hydration",

  "sensitive-skin":
    "Sensitive Skin Care",

  "barrier-care":
    "Barrier Support",

  "dark-circles":
    "Dark Circle Care",

  "under-eye":
    "Under-Eye Care",

  "dull-skin":
    "Dull Skin Care",

  "nutrition-support":
    "Hair–Skin–Nail Nutritional Support"
};
