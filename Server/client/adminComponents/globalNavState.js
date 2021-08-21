import { atom } from 'recoil'

export const PaginationState = atom({
  key: 'PaginationState',
  default: {
    currentPage: 1,
    perPage: 25
  }
})

export const SortingState = atom({
  key: 'SortingState',
  default: {
    sortBy: '',
    sortOrder: 1
  }
})

export const FilteringState = atom({
  key: 'FilteringState',
  default: {
    filterBy: '',
    filterText: ''
  }
})

export const AdvancedNavigationState = atom({
  key: 'AdvancedNavigationState',
  default: false
})
