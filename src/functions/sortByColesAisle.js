const sortByColesAisle = (product, otherProduct) => {
  if (!product.aisles.coles) {
    return 1
  }

  if (!otherProduct.aisles.coles) {
    return -1
  }

  return product.aisles.coles - otherProduct.aisles.coles
}

export default sortByColesAisle
