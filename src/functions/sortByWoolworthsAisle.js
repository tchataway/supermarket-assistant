import sortByAisle from './sortByAisle'

const sortByWoolworthsAisle = (product, otherProduct) => {
  let aisle = product.aisles.woolworths
  let otherAisle = otherProduct.aisles.woolworths

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

export default sortByWoolworthsAisle
