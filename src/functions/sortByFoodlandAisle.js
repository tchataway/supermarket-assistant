import sortByAisle from './sortByAisle'

const sortByFoodlandAisle = (product, otherProduct) => {
  let aisle = product.aisles.foodland
  let otherAisle = otherProduct.aisles.foodland

  if (typeof aisle === 'undefined' && typeof otherAisle === 'undefined') {
    // If neither product has an aisle, sort by
    // product name instead.
    if (product.name < otherProduct.name) {
      return -1
    }

    if (product.name > otherProduct.name) {
      return 1
    }

    // Names are the same, which should never happen,
    // because product names are supposed to be
    // unique.
    return 0
  }

  return sortByAisle(aisle, otherAisle)
}

export default sortByFoodlandAisle
