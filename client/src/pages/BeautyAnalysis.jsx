import { Link } from "react-router-dom";

const BeautyAnalysis = () => {
  return (
    <section className="section page-section analysis-landing">

      <div className="section-heading">

        <span className="section-tag">
          Personalized Product Finder
        </span>

        <h2>
          Find The Right Care For You
        </h2>

        <p>
          Answer a few questions about your skin or hair.
          We will analyze your concerns and recommend suitable
          Dr M Organics products.
        </p>

      </div>

      <div className="analysis-choice-grid">

        {/* SKIN */}
        <Link
          to="/analysis/skin"
          className="analysis-choice-card skin-choice"
        >
          <span>Skin</span>

          <h3>
            Skin & Nutrition Analysis
          </h3>

          <p>
            Identify your skin type and understand concerns such
            as acne, blackheads, pores, tanning, dryness,
            sensitivity, dark circles and nutritional support.
          </p>

          <strong>
            Start 12 Questions →
          </strong>
        </Link>


        {/* HAIR */}
        <Link
          to="/analysis/hair"
          className="analysis-choice-card hair-choice"
        >
          <span>Hair</span>

          <h3>
            Hair & Scalp Analysis
          </h3>

          <p>
            Analyze hair fall, dandruff, scalp condition,
            dryness, frizz, thinning, hair damage and
            natural curl pattern.
          </p>

          <strong>
            Start 15 Questions →
          </strong>
        </Link>

      </div>
    </section>
  );
};

export default BeautyAnalysis;
