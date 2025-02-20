const sortByWoolworthsAisle = (product, otherProduct) => {
  if (!product.aisles.woolworths) {
    return 1
  }

  if (!otherProduct.aisles.woolworths) {
    return -1
  }

  return product.aisles.woolworths - otherProduct.aisles.woolworths
}

export default sortByWoolworthsAisle
