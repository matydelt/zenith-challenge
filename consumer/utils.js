exports.productsValidator = (products) => {
  return products.every((product) => product.productId && product.quantity);
}