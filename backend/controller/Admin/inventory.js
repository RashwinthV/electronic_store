const productModel = require("../../models/productModel");

exports.inventoyproducts = async (req, res) => {
  const products = await productModel.find();
  res.json(products);
};

exports.UpdateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};
