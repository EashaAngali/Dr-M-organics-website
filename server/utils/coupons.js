export const COUPONS = {
  DRM5: 5,
  DRM10: 10
};


export const getCoupon = (
  rawCode = ""
) => {

  const code =
    String(rawCode)
      .trim()
      .toUpperCase();


  const discountPercent =
    COUPONS[code];


  if (!discountPercent) {
    return null;
  }


  return {
    code,
    discountPercent
  };
};
