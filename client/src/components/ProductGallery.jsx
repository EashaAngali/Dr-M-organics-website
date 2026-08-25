import { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand
} from "react-icons/fa";

const ProductGallery = ({ product }) => {
  const images = useMemo(() => {
    const all = [
      product.image,
      ...(product.images || [])
    ].filter(Boolean);

    return [...new Set(all)];
  }, [product]);

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const go = (direction) => {
    setActive((current) =>
      (current + direction + images.length) %
      images.length
    );
  };

  const onTouchEnd = (e) => {
    if (
      touchStart === null ||
      images.length < 2
    ) {
      return;
    }

    const diff =
      touchStart -
      e.changedTouches[0].clientX;

    if (Math.abs(diff) > 45) {
      go(diff > 0 ? 1 : -1);
    }

    setTouchStart(null);
  };

  if (!images.length) return null;

  return (
    <>
      <div className="premium-gallery">

        <div
          className="premium-main-image"
          onTouchStart={(e) =>
            setTouchStart(
              e.touches[0].clientX
            )
          }
          onTouchEnd={onTouchEnd}
        >

          <img
            src={images[active]}
            alt={`${product.name} view ${active + 1}`}
            loading="eager"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-nav gallery-prev"
                onClick={() => go(-1)}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                className="gallery-nav gallery-next"
                onClick={() => go(1)}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <button
            type="button"
            className="gallery-expand"
            onClick={() => setLightbox(true)}
            aria-label="Open image"
          >
            <FaExpand />
          </button>

          <span className="gallery-count">
            {active + 1} / {images.length}
          </span>

        </div>

        {images.length > 1 && (
          <div
            className="gallery-thumbnails"
            aria-label="Product image thumbnails"
          >

            {images.map((src, index) => (
              <button
                type="button"
                key={src}
                className={
                  index === active
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActive(index)
                }
              >

                <img
                  src={src}
                  alt={`${product.name} thumbnail ${
                    index + 1
                  }`}
                  loading="lazy"
                />

              </button>
            ))}

          </div>
        )}

      </div>

      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() =>
            setLightbox(false)
          }
        >

          <button
            type="button"
            className="lightbox-close"
            onClick={() =>
              setLightbox(false)
            }
            aria-label="Close"
          >
            ×
          </button>

          <img
            src={images[active]}
            alt={product.name}
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>
      )}
    </>
  );
};

export default ProductGallery;
