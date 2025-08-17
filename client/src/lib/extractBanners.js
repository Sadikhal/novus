export const extractBanners = (products = [], categories = []) => {
  const activeProducts = products.filter(banner => banner.isActive);
  const activeCategories = categories.filter(banner => banner.isActive);

  return {
    primaryProducts: activeProducts.filter(b => b.type === "primary"),
    primaryCategories: activeCategories.filter(b => b.type === "primary"),
    secondaryProducts: activeProducts.filter(b => b.type === "secondary"),
    secondaryCategories: activeCategories.filter(b => b.type === "secondary"),
    tertiaryCategories: activeCategories.filter(b => b.type === "tertiary")

  };
};

export const transformCategoryData = (category) => ({
  ...category,
  name: category.title,
  title: category.title2,
  url: category.url,
  image: [category.image]
});