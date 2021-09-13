import fs from 'fs'

const rawData = fs.readFileSync('./testTeams.json', { encoding: 'utf8' })
const teamArray = JSON.parse(rawData)

teamArray.forEach((teamObj) => {
  console.log(`<li>${teamObj.name}</li>`)
})
