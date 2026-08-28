import AnalysisQuiz from "../components/AnalysisQuiz.jsx";
import { skinQuestions } from "../data/analysisQuestions.js";

const SkinAnalysis = () => {
  return (
    <AnalysisQuiz
      type="skin"
      title="Skin & Nutrition Analysis"
      subtitle="Answer 12 focused questions to identify your skin type, strongest concerns and suitable Dr M Organics products."
      questions={skinQuestions}
    />
  );
};

export default SkinAnalysis;
