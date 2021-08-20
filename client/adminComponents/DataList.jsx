import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { PaginationState, SortingState, FilteringState } from './globalNavState'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Typography, List, Fab, Tooltip } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'

import KarunaIcon from '../clientComponents/KarunaIcon.jsx'

import DataListNavBar from './DataListNavBar.jsx'
import DataListItem from './DataListItem.jsx'

import UserEditDialog from './UserEditDialog.jsx'
import UnitEditDialog from './UnitEditDialog.jsx'
import TeamEditDialog from './TeamEditDialog.jsx'

import ItemDeleteDialog from './ItemDeleteDialog.jsx'
import PromoteUserDialog from './PromoteUserDialog.jsx'

import { retrieveList } from './dataHelper.js'

const ButtonTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 16
  }
}))(Tooltip)

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  addItemButton: {
    position: 'fixed',
    bottom: theme.spacing(6),
    right: theme.spacing(6)
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
  const pagination = useRecoilValue(PaginationState)
  const sorting = useRecoilValue(SortingState)
  const filtering = useRecoilValue(FilteringState)
  const [totalPages, setTotalPages] = useState(1)

  // Data Dialogs State
  const [editorOpen, setEditorOpen] = useState(false)
  const [editedCount, setEditedCount] = useState(0)

  const [altDialogOpen, setAltDialogOpen] = useState(false)
  const [promotedCount, setPromotedCount] = useState(0)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletedCount, setDeletedCount] = useState(0)

  // Data state
  const [activeRetrieve, setActiveRetrieve] = useState(false)
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

  const onNewItem = () => {
    setActiveItemId('')
    setActiveItemIndex(-1)
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
    if (newData) {
      if (activeItemIndex >= 0 && activeItemIndex < listData.length) {
        listData[activeItemIndex] = { ...listData[activeItemIndex], ...newData }
      }
    } else {
      setEditedCount(editedCount + 1)
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
    if (activeRetrieve) { return }
    setActiveRetrieve(true);
    (async () => {
      try {
        // Retrieve the latest user data
        const response = await retrieveList(
          dataType,
          pagination.currentPage,
          pagination.perPage,
          sorting.sortBy,
          sorting.sortOrder,
          filtering.filterBy,
          filtering.filterText
        )

        // Update local state
        setListData(response.data)
        setTotalPages(Math.ceil(response.count / pagination.perPage))
      } catch (err) {
        console.error('Failed to retrieve team data')
        console.error(err)
      } finally {
        setActiveRetrieve(false)
      }
    })()
  }, [dataType, deletedCount, promotedCount, editedCount, pagination, sorting, filtering])

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

      {/* Nav bars and main data list */}
      <DataListNavBar name={'upper-nav'} totalPages={totalPages} sortByOptions={sortByOptions} filterByOptions={filterByOptions} />
      <div className={classes.dataTable}>
        <List>{listElements}</List>
      </div>
      <DataListNavBar name={'lower-nav'} totalPages={totalPages} sortByOptions={sortByOptions} filterByOptions={filterByOptions} />

      {/* Dialogs for editing items */}
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

      {/* Special dialogs for deleting or promoting a user */}
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

      {/* Button to add a new item */}
      <ButtonTooltip title={`Create new ${dataType}`} placement="top">
        <Fab
          color="primary"
          aria-label={`Create new ${dataType}`}
          className={classes.addItemButton}
          onClick={(e) => { onNewItem() }}
        >
          <AddIcon />
        </Fab>
      </ButtonTooltip>
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
