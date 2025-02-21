const sortByAisle = (aisle, otherAisle) => {
  if (!aisle) {
    return 1
  }

  if (!otherAisle) {
    return -1
  }

  return aisle - otherAisle
}

export default sortByAisle
