import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState } from 'recoil'
import { PaginationState, SortingState, FilteringState, AdvancedNavigationState } from './globalNavState'

import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { Grid, Collapse, MenuItem, Divider, TextField, InputAdornment, IconButton, Select, Tooltip } from '@material-ui/core'
import { Sort as SortIcon, Settings as SettingsIcon, Cancel as CancelIcon } from '@material-ui/icons'
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
    borderBottom: '1px solid lightgray',
    width: '100%'
  },
  upperGridStyle: {
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  lowerGridStyle: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2)
  },
  justified: {
    justifyContent: 'center'
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
  const [showAdvanced, setShowAdvanced] = useRecoilState(AdvancedNavigationState)

  // Ensure the filterBy option is set to something initially
  useEffect(() => {
    if (Array.isArray(filterByOptions) && filterByOptions.length > 0 && filtering.filterBy === '') {
      setFiltering({ ...filtering, filterBy: filterByOptions[0].value })
    }
  }, [])

  // Check for which breakpoints are active
  const isMinSM = useMediaQuery(theme => theme.breakpoints.up('sm'))
  const isMinMD = useMediaQuery(theme => theme.breakpoints.up('md'))
  const isMinLG = useMediaQuery(theme => theme.breakpoints.up('lg'))

  // Derive pagination boundary and sibling count from breakpoints
  let boundaryCount = (isMinSM ? 1 /* sm */ : 2 /* xs */)
  let siblingCount = 1
  if (isMinMD) { boundaryCount += 1; siblingCount += 1 } /* md+sm */
  if (isMinLG) { boundaryCount += 1; siblingCount += 1 } /* lg+md+sm */

  const toggleSortOrder = (e) => {
    if (sorting.sortOrder === 1) {
      setSorting({ ...sorting, sortOrder: -1 })
    } else {
      setSorting({ ...sorting, sortOrder: 1 })
    }
  }

  return (
    <div className={classes.pagerStyle}>
      <Grid container spacing={3} className={classes.upperGridStyle}>
        <Grid item xs={12} sm={9}>
          <Pagination
            count={totalPages}
            page={pagination.currentPage}
            boundaryCount={boundaryCount}
            siblingCount={siblingCount}
            onChange={(e, value) => {
              setPagination({ ...pagination, currentPage: value })
            }}
            classes={{ ul: classes.justified }}
          />
        </Grid>
        <Grid item xs={10} sm={2}>
          <TextField
            id={`${name ? name + '-' : ''}itemsPerPage`}
            name={`${name ? name + '-' : ''}itemsPerPage`}
            label="Per-Page"
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
        </Grid>
        <Grid item xs={2} sm={1}>
          <Tooltip title="Show Advanced Options">
            <IconButton
              onClick={(e) => { setShowAdvanced(!showAdvanced) }}
              aria-expanded={showAdvanced}
              aria-label="Show Advanced Options"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
        <Grid container spacing={3} className={classes.lowerGridStyle}>
          <Grid item xs={12} sm={5}>
            {Array.isArray(sortByOptions) && sortByOptions.length > 0 &&
              <TextField
                id={`${name ? name + '-' : ''}sortBy`}
                name={`${name ? name + '-' : ''}sortBy`}
                label="Sort By"
                variant="outlined"
                fullWidth
                select
                value={sorting.sortBy}
                onChange={(e) => {
                  setSorting({ ...sorting, sortBy: e.target.value })
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Reverse Sort Order">
                        <IconButton size="small" onClick={toggleSortOrder}>
                          <SortIcon className={sorting.sortOrder < 0 ? classes.flipped : ''} />
                        </IconButton>
                      </Tooltip>
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
                variant="outlined"
                fullWidth
                value={filtering.filterText}
                placeholder="filter text"
                onChange={(e) => {
                  setFiltering({ ...filtering, filterText: e.target.value })
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        fullWidth
                        id={`${name ? name + '-' : ''}filterBy`}
                        name={`${name ? name + '-' : ''}filterBy`}
                        value={filtering.filterBy}
                        onChange={(e) => {
                          setFiltering({ ...filtering, filterBy: e.target.value })
                        }}
                        aria-label={'Field to filter by'}
                        disableUnderline
                      >
                        <MenuItem disabled value={''}>{'Filter By'}</MenuItem>
                        <Divider />
                        {filterByOptions.map((filterByOption, i) => (
                          <MenuItem key={i} value={filterByOption.value}>{filterByOption.text}</MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {filtering.filterText !== '' &&
                        <Tooltip title="Clear Filter Text">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setFiltering({ ...filtering, filterText: '' })
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>}
                    </InputAdornment>
                  )
                }}
              />}
          </Grid>
        </Grid>
      </Collapse>
    </div>
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
