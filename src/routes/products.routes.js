const { Router } = require("express");

const ProductController = require("../controllers/ProductController");

const productsRoutes = new Router();

productsRoutes.post(
  "/",
  ProductController.createProduct.bind(ProductController)
);
productsRoutes.get("/", ProductController.listProducts.bind(ProductController));
productsRoutes.put(
  "/:id",
  ProductController.updateProduct.bind(ProductController)
);
productsRoutes.delete(
  "/:id",
  ProductController.deleteProduct.bind(ProductController)
);

module.exports = productsRoutes;
