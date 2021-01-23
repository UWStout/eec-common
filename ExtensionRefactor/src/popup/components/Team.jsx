import React, { useState } from 'react'
import { Button, IconButton } from '@material-ui/core'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'

// Team list and adding/removing forms
export default function TeamForm () {
  // Setup state
  const [team, updateTeam] = useState([])
  const [teamName, updateTeamName] = useState('')

  // Add a team to the team list
  const addTeam = (e) => {
    e.preventDefault()
    updateTeam([teamName, ...team])
    updateTeamName('')
  }

  // Remove a team from the list (by index)
  const removeTeam = (index) => {
    const newTeam = team.filter((curTeam, teamIndex) => {
      return teamIndex !== index
    })
    updateTeam(newTeam)
  }

  // Build component
  return (
    <div>
      <form onSubmit={addTeam}>
        <input 
          placeholder='Add Team'
          value={teamName}
          onChange={(e) => updateTeamName(e.target.value)}
        />
        <Button type="submit">Add Team</Button>
      </form>
      <TeamList team={team} removeTeam={removeTeam} />
    </div>
  )
}

// Component to show a list of team names
function TeamList (props) {
  return (
    <ul style={{ listStyleType: 'none' }}>
      { props.team.map((team, index) => {
          return (
            <li key={team}>
              {team}
              <IconButton size='small' onClick={() => props.removeTeam(index)}><DeleteOutlineOutlinedIcon /></IconButton>
            </li>
          )
        })
      }
    </ul>
  )
}
