import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({ value = 0, size = "sm" }) => {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className={`rating-stars rating-stars-${size}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rounded ? <FaStar key={star} /> : <FaRegStar key={star} />
      )}
    </span>
  );
};

export default RatingStars;
