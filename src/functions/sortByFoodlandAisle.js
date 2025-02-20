const sortByFoodlandAisle = (product, otherProduct) => {
  if (!product.aisles.foodland) {
    return 1
  }

  if (!otherProduct.aisles.foodland) {
    return -1
  }

  return product.aisles.foodland - otherProduct.aisles.foodland
}

export default sortByFoodlandAisle
