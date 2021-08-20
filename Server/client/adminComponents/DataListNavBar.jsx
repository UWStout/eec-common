import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilState } from 'recoil'
import { PaginationState, SortingState, FilteringState } from './globalNavState'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, MenuItem, TextField, InputAdornment, IconButton, Select } from '@material-ui/core'
import { Sort as SortIcon } from '@material-ui/icons'
import { Pagination } from '@material-ui/lab'

// Values for the per-page select
const PER_PAGE_OPTIONS = [
  10, 25, 50, 100, 250
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
  const { name, totalPages, sortByOptions, filterByOptions } = props
  const classes = useStyles()

  const [pagination, setPagination] = useRecoilState(PaginationState)
  const [sorting, setSorting] = useRecoilState(SortingState)
  const [filtering, setFiltering] = useRecoilState(FilteringState)

  const toggleSortOrder = (e) => {
    if (sorting.sortOrder === 1) {
      setSorting({ ...sorting, sortOrder: -1 })
    } else {
      setSorting({ ...sorting, sortOrder: 1 })
    }
  }

  return (
    <Grid container spacing={3} className={classes.pagerStyle}>
      <Grid item xs={12} sm={10}>
        <Pagination
          count={totalPages}
          page={pagination.currentPage}
          onChange={(e, value) => {
            setPagination({ ...pagination, currentPage: value })
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          id={`${name ? name + '-' : ''}itemsPerPage`}
          name={`${name ? name + '-' : ''}itemsPerPage`}
          label="Items Per-Page"
          fullWidth
          select
          value={pagination.perPage}
          onChange={(e) => {
            setPagination({ ...pagination, perPage: parseInt(e.target.value) })
          }}
        >
          {PER_PAGE_OPTIONS.map((perPageOption, i) => (
            <MenuItem key={i} value={perPageOption}>{perPageOption}</MenuItem>
          ))}
        </TextField>
        {/* <Grid item xs={12} sm={2}>
          <Tooltip title="Show Advanced Options" placement="left">
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={showAdvanced}
              aria-label="Show Advanced Options"
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Grid> */}
      </Grid>

      {/* <Collapse in={showAdvanced} timeout="auto" unmountOnExit> */}
        <Grid item xs={12} sm={5}>
          {Array.isArray(sortByOptions) && sortByOptions.length > 0 &&
            <TextField
              id={`${name ? name + '-' : ''}sortBy`}
              name={`${name ? name + '-' : ''}sortBy`}
              label="Sort By"
              fullWidth
              select
              value={sorting.sortBy}
              onChange={(e) => {
                setSorting({ ...sorting, sortBy: e.target.value })
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      onClick={toggleSortOrder}
                    >
                      <SortIcon className={sorting.sortOrder < 0 ? classes.flipped : ''} />
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

        <Grid item xs={12} sm={7}>
          {Array.isArray(filterByOptions) && filterByOptions.length > 0 &&
            <TextField
              id={`${name ? name + '-' : ''}filterByText`}
              name={`${name ? name + '-' : ''}filterByText`}
              label="Filter List Items"
              fullWidth
              value={filtering.filterText}
              onChange={(e) => {
                setFiltering({ ...filtering, filterText: e.target.value })
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Select
                      id={`${name ? name + '-' : ''}filterBy`}
                      name={`${name ? name + '-' : ''}filterBy`}
                      value={filtering.filterBy}
                      onChange={(e) => {
                        setFiltering({ ...filtering, filterBy: e.target.value })
                      }}
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
      {/* </Collapse> */}
    </Grid>
  )
}

const MenuOptionShape = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

DataListNavBar.propTypes = {
  name: PropTypes.string,
  totalPages: PropTypes.number,
  sortByOptions: PropTypes.arrayOf(
    PropTypes.shape(MenuOptionShape)
  ),
  filterByOptions: PropTypes.arrayOf(
    PropTypes.shape(MenuOptionShape)
  )
}

DataListNavBar.defaultProps = {
  name: '',
  totalPages: 1,
  sortByOptions: [],
  filterByOptions: []
}
