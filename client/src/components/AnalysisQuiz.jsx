import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios.js";

import ProductCard from "./ProductCard.jsx";

import {
  tagLabels
} from "../data/analysisQuestions.js";


const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};


const getSelectedOption = (
  question,
  answer
) => {
  return question.options.find(
    (option) => option.label === answer
  );
};


/* =====================================
   PRODUCT KEYWORD MATCHING
===================================== */

const tagKeywords = {

  "hair-fall": [
    "hair fall",
    "hair growth",
    "rosemary",
    "castor",
    "strength",
    "thinning",
    "weak hair"
  ],

  "hair-strengthening": [
    "hair strength",
    "strengthening",
    "weak hair",
    "castor",
    "rosemary",
    "breakage",
    "vitamin e"
  ],

  dandruff: [
    "dandruff",
    "flakes",
    "scalp",
    "neem",
    "rosemary",
    "tea tree"
  ],

  "scalp-care": [
    "scalp",
    "rosemary",
    "neem",
    "tea tree"
  ],

  frizz: [
    "frizz",
    "smooth",
    "silky",
    "conditioner",
    "conditioning"
  ],

  smoothing: [
    "smooth",
    "silky",
    "soft",
    "conditioning"
  ],

  "dry-hair": [
    "dry hair",
    "nourishing",
    "nourish",
    "moisturizing",
    "coconut oil",
    "almond oil"
  ],

  moisturizing: [
    "moisturizing",
    "moisture",
    "hydrating",
    "hydrate",
    "aloe vera",
    "glycerin",
    "oil"
  ],

  repair: [
    "repair",
    "damaged",
    "damage",
    "breakage",
    "vitamin e",
    "castor"
  ],

  "curl-care": [
    "curl",
    "curly",
    "frizz",
    "moisturizing",
    "conditioning"
  ],

  "oil-control": [
    "oily",
    "oil control",
    "neem",
    "tea tree",
    "blemish"
  ],

  "pore-care": [
    "pore",
    "blackhead",
    "whitehead",
    "neem",
    "tea tree"
  ],

  "acne-care": [
    "acne",
    "pimple",
    "blemish",
    "neem",
    "tea tree"
  ],

  acne: [
    "acne",
    "pimple",
    "blemish",
    "neem",
    "tea tree"
  ],

  comedones: [
    "blackhead",
    "whitehead",
    "pore",
    "neem",
    "tea tree"
  ],

  brightening: [
    "bright",
    "brightness",
    "glow",
    "radiant",
    "turmeric",
    "ubtan",
    "licorice"
  ],

  detan: [
    "tan",
    "de tan",
    "detan",
    "bright",
    "turmeric",
    "ubtan",
    "orange peel"
  ],

  "uneven-tone": [
    "uneven",
    "tone",
    "bright",
    "turmeric",
    "ubtan",
    "licorice"
  ],

  pigmentation: [
    "pigmentation",
    "pigment",
    "dark spot",
    "bright",
    "licorice",
    "turmeric"
  ],

  hydration: [
    "hydrate",
    "hydrating",
    "moisturizer",
    "moisturizing",
    "aloe vera",
    "glycerin",
    "cream"
  ],

  "dry-skin": [
    "dry skin",
    "moisturizing",
    "moisturizer",
    "aloe vera",
    "glycerin",
    "cream"
  ],

  "sensitive-skin": [
    "sensitive",
    "gentle",
    "calm",
    "aloe vera",
    "soothing"
  ],

  soothing: [
    "soothing",
    "calm",
    "gentle",
    "aloe vera",
    "cucumber"
  ],

  "barrier-care": [
    "barrier",
    "gentle",
    "moisturizer",
    "moisturizing",
    "aloe vera",
    "cream"
  ],

  "dull-skin": [
    "dull",
    "glow",
    "bright",
    "radiant",
    "turmeric",
    "ubtan"
  ],

  "under-eye": [
    "under eye",
    "dark circle",
    "eye cream"
  ],

  "dark-circles": [
    "dark circle",
    "under eye",
    "eye cream"
  ]
};


/* =====================================
   SKIN / HAIR TYPE RESULT
===================================== */

const getProfile = (
  type,
  answers
) => {

  if (type === "skin") {

    const answer =
      answers.skinFeel || "";

    if (
      answer.includes("Very oily")
    ) {
      return "Oily Skin";
    }

    if (
      answer.includes("forehead") ||
      answer.includes("Dry in some")
    ) {
      return "Combination Skin";
    }

    if (
      answer.includes("Dry and tight")
    ) {
      return "Dry Skin";
    }

    if (
      answer.includes("Sensitive")
    ) {
      return "Sensitive Skin";
    }

    return "Normal Skin";
  }


  /* HAIR */

  const pattern =
    answers.hairPattern ||
    "Hair Pattern Not Specified";

  const dryness =
    answers.hairDryness ||
    answers.hairNow ||
    "";

  const scalp =
    answers.scalpFeel || "";


  let condition =
    "Balanced Hair";

  if (
    /very dry|extremely dry|dry throughout|dry mainly|slightly dry/i.test(
      dryness
    )
  ) {
    condition =
      "Dry Hair";
  }

  if (
    /oily/i.test(
      answers.hairNow || ""
    )
  ) {
    condition =
      "Oily Hair";
  }

  if (
    /frizz/i.test(
      answers.hairNow || ""
    )
  ) {
    condition =
      "Frizz-Prone Hair";
  }


  let scalpType =
    "Normal Scalp";

  if (
    /very oily/i.test(scalp)
  ) {
    scalpType =
      "Very Oily Scalp";
  }

  else if (
    /oily/i.test(scalp)
  ) {
    scalpType =
      "Oily Scalp";
  }

  else if (
    /dry/i.test(scalp)
  ) {
    scalpType =
      "Dry Scalp";
  }

  else if (
    /itchy|flaky|irritated/i.test(scalp)
  ) {
    scalpType =
      "Sensitive Scalp";
  }


  return `${pattern} • ${condition} • ${scalpType}`;
};


/* =====================================
   PRODUCT RECOMMENDATION
===================================== */

const scoreProducts = (
  products,
  topTags,
  type
) => {

  return products
    .map((product) => {

      const basicInfo = normalize(
        [
          product.name,
          product.category,
          product.description,
          product.shortBenefit,
          product.benefits,
          product.ingredients,
          product.suitableFor
        ].join(" ")
      );


      const productIdentity =
        normalize(
          `${product.name} ${product.category}`
        );


      /*
       * Prevent hair analysis from
       * recommending random skin products.
       */

      const hairProduct =
        /hair|shampoo|conditioner|scalp/.test(
          productIdentity
        );


      const skinProduct =
        /face|skin|soap|cream|ubtan|cleanser|herbal/.test(
          productIdentity
        );


      if (
        type === "hair" &&
        !hairProduct
      ) {
        return {
          product,
          score: 0
        };
      }


      if (
        type === "skin" &&
        hairProduct &&
        !skinProduct
      ) {
        return {
          product,
          score: 0
        };
      }


      let score = 0;


      topTags.forEach(
        ({
          tag,
          score: concernScore
        }) => {

          const keywords =
            tagKeywords[tag] || [];


          keywords.forEach(
            (keyword) => {

              if (
                basicInfo.includes(
                  normalize(keyword)
                )
              ) {

                score +=
                  2 +
                  concernScore;
              }

            }
          );

        }
      );


      /*
       * Give small preference to
       * correct category.
       */

      if (
        score > 0 &&
        type === "hair" &&
        hairProduct
      ) {
        score += 4;
      }


      if (
        score > 0 &&
        type === "skin" &&
        skinProduct
      ) {
        score += 4;
      }


      return {
        product,
        score
      };

    })

    .filter(
      ({ score }) => score > 0
    )

    .sort(
      (a, b) => b.score - a.score
    )

    .slice(0, 4)

    .map(
      ({ product }) => product
    );
};



const AnalysisQuiz = ({
  type,
  title,
  subtitle,
  questions
}) => {

  const [step, setStep] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [
    showResult,
    setShowResult
  ] = useState(false);

  const [products, setProducts] =
    useState([]);

  const [
    productError,
    setProductError
  ] = useState("");


  /* LOAD LIVE WEBSITE PRODUCTS */

  useEffect(() => {

    const loadProducts =
      async () => {

        try {

          const { data } =
            await api.get(
              "/api/products"
            );

          setProducts(data);

        }
        catch {

          setProductError(
            "Product recommendations could not be loaded right now."
          );

        }

      };

    loadProducts();

  }, []);


  const currentQuestion =
    questions[step];


  const selectedAnswer =
    answers[
      currentQuestion?.id
    ];


  const progress =
    showResult
      ? 100
      : Math.round(
          ((step + 1) /
            questions.length) *
            100
        );


  /* =====================================
     CALCULATE RESULT
  ===================================== */

  const result =
    useMemo(() => {

      const scoreMap = {};

      let needsProfessionalNotice =
        false;


      questions.forEach(
        (question) => {

          const option =
            getSelectedOption(
              question,
              answers[
                question.id
              ]
            );


          if (!option) return;


          const weight =
            question.weight || 1;


          option.tags?.forEach(
            (tag) => {

              scoreMap[tag] =
                (
                  scoreMap[tag] ||
                  0
                ) +
                weight;

            }
          );


          if (
            option.alert ||
            option.tags?.includes(
              "professional-consult"
            )
          ) {

            needsProfessionalNotice =
              true;

          }

        }
      );


      const ignoredTags =
        new Set([

          "normal-hair",
          "normal-scalp",
          "normal-skin",
          "normal-hydration",
          "normal-pores",

          "no-hair-fall",
          "no-thinning",
          "no-dandruff",
          "no-frizz",
          "no-damage",
          "no-acne",

          "no-dark-circles",
          "no-nutrition-concern",

          "not-sensitive",
          "not-curly",
          "even-tone",

          "straight-hair",
          "wavy-hair",

          "mild-hair-fall",
          "skin-routine"

        ]);


      const topTags =
        Object.entries(
          scoreMap
        )

          .filter(
            ([tag]) =>
              !ignoredTags.has(
                tag
              ) &&
              tag !==
                "professional-consult"
          )

          .map(
            ([tag, score]) => ({
              tag,
              score
            })
          )

          .sort(
            (a, b) =>
              b.score -
              a.score
          )

          .slice(0, 6);


      const recommended =
        scoreProducts(
          products,
          topTags,
          type
        );


      return {

        profile:
          getProfile(
            type,
            answers
          ),

        topTags,

        recommended,

        needsProfessionalNotice,

        nutritionSupport:
          Boolean(
            scoreMap[
              "nutrition-support"
            ]
          )

      };

    }, [
      answers,
      products,
      questions,
      type
    ]);


  /* SELECT ANSWER */

  const choose =
    (label) => {

      setAnswers(
        (current) => ({
          ...current,

          [currentQuestion.id]:
            label
        })
      );

    };


  /* NEXT */

  const next = () => {

    if (
      !selectedAnswer
    ) {
      return;
    }


    if (
      step ===
      questions.length - 1
    ) {

      setShowResult(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

    else {

      setStep(
        (value) =>
          value + 1
      );

    }

  };


  /* BACK */

  const previous = () => {

    if (showResult) {

      setShowResult(false);

      setStep(
        questions.length - 1
      );

      return;
    }


    if (step > 0) {

      setStep(
        (value) =>
          value - 1
      );

    }

  };


  /* RETAKE */

  const restart = () => {

    setAnswers({});

    setStep(0);

    setShowResult(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  return (
    <section className="section page-section analysis-page">

      <div className="analysis-shell">

        {/* HEADER */}

        <div className="analysis-header">

          <span className="section-tag">
            Personalized Beauty Analysis
          </span>

          <h1>
            {title}
          </h1>

          <p>
            {subtitle}
          </p>


          <div
            className="analysis-progress-wrap"
            aria-label={`Progress ${progress}%`}
          >

            <div
              className="analysis-progress"
              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>


          <small>

            {showResult
              ? "Analysis complete"
              : `Question ${step + 1} of ${questions.length}`}

          </small>

        </div>


        {/* QUESTIONS */}

        {!showResult ? (

          <div className="analysis-card">

            <div className="analysis-question-number">

              {String(
                step + 1
              ).padStart(
                2,
                "0"
              )}

            </div>


            <h2>
              {
                currentQuestion.question
              }
            </h2>


            <div className="analysis-options">

              {currentQuestion.options.map(
                (option) => (

                  <button
                    key={
                      option.label
                    }
                    type="button"
                    className={
                      `analysis-option ${
                        selectedAnswer ===
                        option.label
                          ? "selected"
                          : ""
                      }`
                    }
                    onClick={() =>
                      choose(
                        option.label
                      )
                    }
                  >

                    <span className="analysis-radio" />

                    {
                      option.label
                    }

                  </button>

                )
              )}

            </div>


            <div className="analysis-actions">

              <button
                type="button"
                className="btn secondary-btn"
                onClick={previous}
                disabled={
                  step === 0
                }
              >
                Back
              </button>


              <button
                type="button"
                className="btn primary-btn"
                onClick={next}
                disabled={
                  !selectedAnswer
                }
              >

                {
                  step ===
                  questions.length - 1

                    ? "See My Results"

                    : "Next Question"
                }

              </button>

            </div>

          </div>

        ) : (

          /* =============================
             RESULT
          ============================= */

          <div className="analysis-results">


            <div className="analysis-result-hero">

              <span className="section-tag">
                Your Analysis Result
              </span>

              <h2>
                {
                  result.profile
                }
              </h2>

              <p>
                Based on your answers,
                these are your main
                care priorities and the
                Dr M Organics products
                that best match them.
              </p>

            </div>


            <div className="analysis-result-grid">


              <div className="analysis-result-box">

                <h3>
                  Your Main Care Priorities
                </h3>

                <div className="analysis-tags">

                  {result.topTags.length > 0
                    ? result.topTags
                        .slice(0, 5)
                        .map(
                          ({
                            tag
                          }) => (

                            <span
                              key={tag}
                            >

                              {
                                tagLabels[
                                  tag
                                ] ||
                                tag.replace(
                                  /-/g,
                                  " "
                                )
                              }

                            </span>

                          )
                        )

                    : (
                      <span>
                        General Maintenance
                      </span>
                    )}

                </div>

              </div>


              <div className="analysis-result-box">

                <h3>
                  Recommended Routine Focus
                </h3>


                {type === "hair" ? (

                  <p>
                    Start with your scalp
                    condition, then focus
                    on hair fall, moisture,
                    frizz, damage and your
                    natural hair pattern.
                  </p>

                ) : (

                  <p>
                    Build your routine
                    around your skin type
                    first, then target
                    concerns such as acne,
                    pores, tanning,
                    sensitivity and
                    hydration.
                  </p>

                )}


                {result.nutritionSupport && (

                  <p className="analysis-note">

                    Your answers also
                    suggest that hair,
                    skin and nail
                    nutritional support
                    may be worth
                    considering.

                  </p>

                )}

              </div>

            </div>


            {/* PROFESSIONAL NOTICE */}

            {result.needsProfessionalNotice && (

              <div className="analysis-alert">

                <strong>
                  Professional consultation recommended:
                </strong>

                {" "}

                Your answers include
                a severe, sudden or
                persistent concern.
                Consider consultation
                with a qualified
                healthcare professional
                or dermatologist.

              </div>

            )}


            {/* PRODUCTS */}

            <div className="analysis-products-head">

              <span className="section-tag">
                Personalized Recommendations
              </span>

              <h2>
                Recommended For You
              </h2>

              <p>
                These products are
                automatically selected
                from products currently
                available on the
                Dr M Organics website.
              </p>

            </div>


            {productError && (

              <p className="error-text">
                {productError}
              </p>

            )}


            {!productError &&
            result.recommended.length > 0 ? (

              <div className="product-grid analysis-product-grid">

                {result.recommended.map(
                  (product) => (

                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />

                  )
                )}

              </div>

            ) : !productError ? (

              <div className="analysis-empty-products">

                <h3>
                  No Exact Product Match
                </h3>

                <p>
                  We currently do not
                  have an exact website
                  product for this
                  particular concern.
                </p>

                <Link
                  to="/shop"
                  className="btn primary-btn"
                >
                  Browse All Products
                </Link>

              </div>

            ) : null}


            <div className="analysis-result-actions">

              <button
                type="button"
                className="btn secondary-btn"
                onClick={previous}
              >
                Review Last Answer
              </button>


              <button
                type="button"
                className="btn primary-btn"
                onClick={restart}
              >
                Retake Analysis
              </button>

            </div>

          </div>

        )}

      </div>

    </section>
  );
};

export default AnalysisQuiz;
