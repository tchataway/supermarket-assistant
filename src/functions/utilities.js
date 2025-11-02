export const defaultSortDirectionSettingIsDescending = (sortDirectionValue) => {
  switch (sortDirectionValue) {
    case 'sortDescendingByDefault':
      return true
    case 'sortAscendingByDefault':
      return false
  }

  return false
}

export const booleanToDefaultSortDirectionSetting = (shouldSortDescending) => {
  if (shouldSortDescending) {
    return 'sortDescendingByDefault'
  }

  return 'sortAscendingByDefault'
}
