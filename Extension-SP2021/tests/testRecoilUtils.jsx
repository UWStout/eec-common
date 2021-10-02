import fs from 'fs'

import React from 'react'
import PropTypes from 'prop-types'

import { RecoilRoot } from 'recoil'
import { render, fireEvent, waitFor } from '@testing-library/react'

// Material-UI provider utilities
import { create as JSSCreate } from 'jss'
import { StylesProvider, jssPreset } from '@material-ui/core/styles'

// Import state to set
import { LoggedInUserState, PrivacyPrefsState, LastSelectedAffectIDState } from '../src/in-content/unifiedComponents/data/globalSate/appState.js'
import { UserStatusState, AffectHistoryListState, UserAffectIDState } from '../src/in-content/unifiedComponents/data/globalSate/userState.js'
import { AffectListState } from '../src/in-content/unifiedComponents/data/globalSate/teamState.js'

/** Function to set initial recoil state for testing */
function initializeState (snapshot) {
  const rawUserData = fs.readFileSync('./tests/mockData/User.json', { encoding: 'utf8' })
  const UserData = JSON.parse(rawUserData)
  snapshot.set(UserStatusState, UserData.status)

  const rawAffectList = fs.readFileSync('./tests/mockData/Affects.json', { encoding: 'utf8' })
  const AffectList = JSON.parse(rawAffectList)
  snapshot.set(AffectListState, AffectList)

  const MoodList =
  ['6008928508baff43187a74f9',
    '6008928508baff43187a7502',
    '6008928508baff43187a7509']
  snapshot.set(AffectHistoryListState, MoodList)

  const privacyPrefs = {
    private: true,
    noPrompt: false
  }
  snapshot.set(PrivacyPrefsState, privacyPrefs)

  const currentAffect = '6008928508baff43187a74f9'
  snapshot.set(UserAffectIDState, currentAffect)

  const selectedAffect = '6008928508baff43187a74f9'
  snapshot.set(LastSelectedAffectIDState, selectedAffect)

  snapshot.set(LoggedInUserState, {
    id: UserData._id,
    email: UserData.email,
    firstName: UserData.firstName,
    lastName: UserData.lastName,
    userType: UserData.userType
  })
}

/** Special component that wraps with RecoilRoot and initializes state */
function RecoilProviders ({ children }) {
  // Create a comment node for injection of Material-UI styles
  const insertionNode = (<noscript id='jss-insertion-point' />)

  // Create our own instance of JSS that will use our custom insertion point
  const jss = JSSCreate({
    ...jssPreset(),
    insertionPoint: insertionNode
  })

  return (
    <div>
      {insertionNode}
      <StylesProvider jss={jss}>
        <RecoilRoot initializeState={initializeState}>
          {children}
        </RecoilRoot>
      </StylesProvider>
    </div>
  )
}

RecoilProviders.propTypes = {
  children: PropTypes.node.isRequired
}

/** Custom render function for all recoil objects */
const customRender = (ui, options) =>
  render(ui, { wrapper: RecoilProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

/* Other utility functions */

export function presentVisibleAndContained (expect, parent, child) {
  // Ensure they are in the document and visible
  expect(parent).toBeInTheDocument()
  expect(child).toBeInTheDocument()

  expect(parent).toBeVisible()
  expect(child).toBeVisible()

  // Ensure the child is a descendent of the parent
  expect(parent).toContainElement(child)
}
