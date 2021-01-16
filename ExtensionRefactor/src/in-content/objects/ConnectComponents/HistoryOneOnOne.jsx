import React from 'react'

import { Table, TableContainer, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'
import Emoji from './Emoji.jsx'

const columns = [
  { id: 'selfMood', label: 'You', minWidth: 10 },
  { id: 'date', label: 'Date', minWidth: 20 },
  { id: 'partnerMood', label: 'them', minWidth: 10 }
]

const rows = [
  { 
    rowid: '1',
    selfMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/20/20',
    partnerMood: <Emoji symbol='😀' label='Grinning Face' />
  },  
  { 
    rowid: '2',
    selfMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/20/20',
    partnerMood: <Emoji symbol='😀' label='Grinning Face' />
  },
  { 
    rowid: '3',
    selfMood: <Emoji symbol='😐' label='Neutral Face' />,
    date: '12/21/20',
    partnerMood: <Emoji symbol='😀' label='Grinning Face' />
  },
  { 
    rowid: '4',
    selfMood: <Emoji symbol='😐' label='Neutral Face' />,
    date: '12/21/20',
    partnerMood: <Emoji symbol='🙁' label='Slightly Frowning Face' />
  },
  { 
    rowid: '5',
    selfMood: <Emoji symbol='😀' label='Grinning Face' />,
    date: '12/22/20',
    partnerMood: <Emoji symbol='😐' label='Neutral Face' />
  },
]

export default function HistoryOneOnOne (props) {


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
