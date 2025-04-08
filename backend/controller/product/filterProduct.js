const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];
    const brandInput = req?.body?.brand || ""; // Single brand string
    const brandList = brandInput ? [brandInput.trim()] : [];

    const categoryQuery = {};
    if (categoryList.length > 0) {
      categoryQuery.category = { $in: categoryList };
    }

    const categoryProducts = await productModel.find(categoryQuery);

    const brandProducts =
      brandList.length > 0
        ? categoryProducts.filter((item) =>
            brandList.includes(item.brandName.trim())
          )
        : [];

    const uniqueBrands = [
      ...new Set(categoryProducts.map((item) => item.brandName.trim())),
    ].sort();

    res.json({
      data: brandProducts.length > 0 ? brandProducts : categoryProducts,
      brand: uniqueBrands,
      message: "Filtered products fetched successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
