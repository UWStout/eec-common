import React from 'react'

import { Table, TableContainer, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'
import Emoji from './Emoji.jsx'

const columns = [
  { id: 'teamMood', label: 'Team' },
  { id: 'date', label: 'Date' }
]

const rows = [
  {
    rowid: '1',
    teamMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/20/20'
  },
  {
    rowid: '2',
    teamMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/21/20'
  },
  {
    rowid: '3',
    teamMood: <Emoji symbol='😐' label='Neutral Face' />,
    date: '12/22/20'
  },
  {
    rowid: '4',
    teamMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/23/20'
  },
]

// Display team average mood history
export default function HistoryTeam (props) {
  return(
    <div>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table' size='small' >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{  minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow key={row.rowid}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
