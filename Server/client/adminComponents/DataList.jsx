import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, List } from '@material-ui/core'

import KarunaIcon from '../clientComponents/KarunaIcon.jsx'

import DataListNavBar from './DataListNavBar.jsx'
import DataListItem from './DataListItem.jsx'

import UserEditDialog from './UserEditDialog.jsx'
import UnitEditDialog from './UnitEditDialog.jsx'
import TeamEditDialog from './TeamEditDialog.jsx'

import ItemDeleteDialog from './ItemDeleteDialog.jsx'
import PromoteUserDialog from './PromoteUserDialog.jsx'

import { retrieveList } from './dataHelper.js'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pagerStyle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  dataTable: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

export default function DataList (props) {
  const { dataType, sortByOptions, filterByOptions } = props
  const classes = useStyles()

  // Paging and filtering state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [filterBy, setFilterBy] = useState('')

  // Data Dialogs State
  const [editorOpen, setEditorOpen] = useState(false)
  const [altDialogOpen, setAltDialogOpen] = useState(false)
  const [promotedCount, setPromotedCount] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletedCount, setDeletedCount] = useState(0)

  // Data state
  const [listData, setListData] = useState([])
  const [activeItemId, setActiveItemId] = useState('')
  const [activeItemName, setActiveItemName] = useState('')
  const [activeItemIndex, setActiveItemIndex] = useState(0)

  // Callbacks for editing data
  const onEditItem = (dataItem, index) => {
    setActiveItemId(dataItem._id)
    setActiveItemIndex(index)
    setEditorOpen(true)
  }

  const onDeleteItem = (dataItem, index) => {
    setActiveItemId(dataItem._id)
    if (dataType === 'user') {
      setDeleteConfirmText(dataItem.email)
    } else {
      setDeleteConfirmText(dataItem.name)
    }
    setDeleteDialogOpen(true)
  }

  const onItemAltAction = (dataItem, index) => {
    setActiveItemId(dataItem._id)
    setActiveItemName(dataItem.name)
    setAltDialogOpen(true)
  }

  const onEditorClose = (newData) => {
    if (newData && activeItemIndex >= 0 && activeItemIndex < listData.length) {
      listData[activeItemIndex] = { ...listData[activeItemIndex], ...newData }
    }
    setEditorOpen(false)
  }

  const onDeleteDialogClose = (deleted) => {
    if (deleted) {
      setDeletedCount(deletedCount + 1)
    }
    setDeleteDialogOpen(false)
  }

  const onAltDialogClose = (promoted) => {
    if (promoted) {
      setPromotedCount(promotedCount + 1)
    }
    setAltDialogOpen(false)
  }

  useEffect(() => {
    (async () => {
      try {
        // Retrieve the latest user data
        const response = await retrieveList(
          dataType, currentPage, itemsPerPage, sortBy, sortOrder, filterBy, filterText
        )

        // Update local state
        setListData(response.data)
        setTotalPages(Math.ceil(response.count / itemsPerPage))
      } catch (err) {
        console.error('Failed to retrieve team data')
        console.error(err)
      }
    })()
  }, [currentPage, dataType, itemsPerPage, deletedCount, promotedCount, sortBy, sortOrder, filterBy, filterText])

  // Control the value of current page
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const listElements = listData.map((dataItem, i) => (
    <DataListItem
      key={dataItem._id}
      dataItem={dataItem}
      dataType={dataType}
      button
      onClick={(e) => { onEditItem(dataItem, i) }}
      onAction={(e) => { onItemAltAction(dataItem, i) }}
      onDelete={(e) => { onDeleteItem(dataItem, i) }}
      selected={dataItem._id === activeItemId}
      isAdmin={dataType === 'user' ? dataItem.userType === 'admin' : false}
    />
  ))

  return (
    <div className={classes.paper}>
      <KarunaIcon />
      <Typography component="h1" variant="h5">
        {dataType === 'user' && 'User Management'}
        {dataType === 'team' && 'Team Management'}
        {dataType === 'unit' && 'Org Unit Management'}
      </Typography>

      <DataListNavBar
        name={'upper-nav'}
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={itemsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        filterBy={filterBy}
        filterText={filterText}
        sortByOptions={sortByOptions}
        filterByOptions={filterByOptions}
        onPageChange={handlePageChange}
        onPerPageChange={(newPerPage) => { setItemsPerPage(newPerPage) }}
        onSortByChange={(newSortBy) => { setSortBy(newSortBy) }}
        onSortOrderChange={(newSortOrder) => { setSortOrder(newSortOrder) }}
        onFilterByChange={(newFilterBy) => { setFilterBy(newFilterBy) }}
        onFilterTextChange={(newFilterText) => { setFilterText(newFilterText) }}
      />
      <div className={classes.dataTable}>
        <List>
          {listElements}
        </List>
      </div>
      <DataListNavBar
        name={'lower-nav'}
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={itemsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        filterBy={filterBy}
        filterText={filterText}
        sortByOptions={sortByOptions}
        filterByOptions={filterByOptions}
        onPageChange={handlePageChange}
        onPerPageChange={(newPerPage) => { setItemsPerPage(newPerPage) }}
        onSortByChange={(newSortBy) => { setSortBy(newSortBy) }}
        onSortOrderChange={(newSortOrder) => { setSortOrder(newSortOrder) }}
        onFilterByChange={(newFilterBy) => { setFilterBy(newFilterBy) }}
        onFilterTextChange={(newFilterText) => { setFilterText(newFilterText) }}
      />

      {dataType === 'user' &&
        <UserEditDialog
          open={editorOpen}
          onDialogClose={onEditorClose}
          userId={activeItemId}
        />}
      {dataType === 'team' &&
        <TeamEditDialog
          open={editorOpen}
          onDialogClose={onEditorClose}
          teamId={activeItemId}
        />}
      {dataType === 'unit' &&
        <UnitEditDialog
          open={editorOpen}
          onDialogClose={onEditorClose}
          unitId={activeItemId}
        />}
      <ItemDeleteDialog
        open={deleteDialogOpen}
        onDialogClose={onDeleteDialogClose}
        itemId={activeItemId}
        dataType={dataType}
        confirmText={deleteConfirmText}
      />
      {dataType === 'user' &&
        <PromoteUserDialog
          open={altDialogOpen}
          onDialogClose={onAltDialogClose}
          userId={activeItemId}
          userName={activeItemName}
        />}
    </div>
  )
}

DataList.propTypes = {
  dataType: PropTypes.string.isRequired,
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
  )
}

DataList.defaultProps = {
  sortByOptions: [],
  filterByOptions: []
}
