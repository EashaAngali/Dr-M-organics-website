import AnalysisQuiz from "../components/AnalysisQuiz.jsx";
import { hairQuestions } from "../data/analysisQuestions.js";

const HairAnalysis = () => {
  return (
    <AnalysisQuiz
      type="hair"
      title="Hair & Scalp Analysis"
      subtitle="Answer 15 focused questions to understand your hair texture, scalp condition and main hair-care concerns."
      questions={hairQuestions}
    />
  );
};

export default HairAnalysis;
