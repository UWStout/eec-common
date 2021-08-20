import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, MenuItem, TextField, InputAdornment, IconButton, Select } from '@material-ui/core'
import { Sort as SortIcon } from '@material-ui/icons'
import { Pagination } from '@material-ui/lab'

// Values for the per-page select
const PER_PAGE_OPTIONS = [
  25, 50, 100, 250
]

const useStyles = makeStyles((theme) => ({
  pagerStyle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderTop: '1px solid lightgray',
    borderBottom: '1px solid lightgray'
  },
  flipped: {
    transform: 'scaleY(-1);'
  }
}))

export default function DataListNavBar (props) {
  const {
    name,
    currentPage,
    totalPages,
    perPage,

    sortByOptions,
    sortBy,
    sortOrder,

    filterByOptions,
    filterBy,
    filterText,

    onPageChange,
    onPerPageChange,
    onSortByChange,
    onSortOrderChange,
    onFilterByChange,
    onFilterTextChange
  } = props
  const classes = useStyles()

  const toggleSortOrder = (e) => {
    if (sortOrder === 1) {
      onSortOrderChange(-1)
    } else {
      onSortOrderChange(1)
    }
  }

  return (
    <Grid container spacing={3} className={classes.pagerStyle}>
      <Grid item xs={12} sm={10} lg={5}>
        <Pagination count={totalPages} page={currentPage} onChange={onPageChange} />
      </Grid>
      <Grid item xs={12} sm={2} lg={2}>
        <TextField
          id={`${name ? name + '-' : ''}itemsPerPage`}
          name={`${name ? name + '-' : ''}itemsPerPage`}
          label="Items Per-Page"
          fullWidth
          select
          value={perPage}
          onChange={(e) => { onPerPageChange(parseInt(e.target.value)) }}
        >
          {PER_PAGE_OPTIONS.map((perPageOption, i) => (
            <MenuItem key={i} value={perPageOption}>{perPageOption}</MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={5} lg={2}>
        {Array.isArray(sortByOptions) && sortByOptions.length > 0 &&
          <TextField
            id={`${name ? name + '-' : ''}sortBy`}
            name={`${name ? name + '-' : ''}sortBy`}
            label="Sort By"
            fullWidth
            select
            value={sortBy}
            onChange={(e) => { onSortByChange(e.target.value) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={toggleSortOrder}
                  >
                    <SortIcon className={sortOrder < 0 ? classes.flipped : ''} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          >
            {sortByOptions.map((sortByOption, i) => (
              <MenuItem key={i} value={sortByOption.value}>{sortByOption.text}</MenuItem>
            ))}
          </TextField>}
      </Grid>

      <Grid item xs={12} sm={7} lg={3}>
        {Array.isArray(filterByOptions) && filterByOptions.length > 0 &&
          <TextField
            id={`${name ? name + '-' : ''}filterByText`}
            name={`${name ? name + '-' : ''}filterByText`}
            label="Filter List Items"
            fullWidth
            value={filterText}
            onChange={(e) => { onFilterTextChange(e.target.value) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Select
                    id={`${name ? name + '-' : ''}filterBy`}
                    name={`${name ? name + '-' : ''}filterBy`}
                    value={filterBy}
                    onChange={(e) => { onFilterByChange(e.target.value) }}
                    aria-label={'Field to filter by'}
                    disableUnderline
                  >
                    {filterByOptions.map((filterByOption, i) => (
                      <MenuItem key={i} value={filterByOption.value}>{filterByOption.text}</MenuItem>
                    ))}
                  </Select>
                </InputAdornment>
              )
            }}
          />}
      </Grid>
    </Grid>
  )
}

DataListNavBar.propTypes = {
  name: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  perPage: PropTypes.number,

  onPageChange: PropTypes.func,
  onPerPageChange: PropTypes.func,
  onSortByChange: PropTypes.func,
  onSortOrderChange: PropTypes.func,
  onFilterByChange: PropTypes.func,
  onFilterTextChange: PropTypes.func,

  sortByOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  filterByOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),

  sortBy: PropTypes.string,
  sortOrder: PropTypes.number,
  filterBy: PropTypes.string,
  filterText: PropTypes.string
}

DataListNavBar.defaultProps = {
  name: '',
  perPage: 50,
  sortBy: '',
  sortOrder: 1,
  filterBy: '',
  filterText: '',

  sortByOptions: [],
  filterByOptions: [],

  onPageChange: null,
  onPerPageChange: null,
  onSortByChange: null,
  onSortOrderChange: null,
  onFilterByChange: null,
  onFilterTextChange: null
}
