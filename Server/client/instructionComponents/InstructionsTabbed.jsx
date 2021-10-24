import React, { useEffect, useCallback } from 'react'

import SwipeableViews from 'react-swipeable-views'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import TabPanel from '../sharedComponents/TabPanel.jsx'

import BasicInstallation from './instructionTabs/BasicInstallation.jsx'
import BasicUsage from './instructionTabs/BasicUsage.jsx'
import AccountCreation from './instructionTabs/AccountCreation.jsx'
import OtherPages from './instructionTabs/OtherPages.jsx'
// import AdvancedInstallation from './instructionTabs/AdvancedInstallation.jsx'

export function a11yPropsTab (name) {
  return {
    id: `action-tab-${name}`,
    'aria-controls': `action-tabpanel-${name}`
  }
}

const useStyles = makeStyles((theme) => ({
  headingRoot: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pageRoot: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    minHeight: 200
  }
}))

const TAB_INFO = [
  { name: 'install-basic', label: 'Install Extension' },
  { name: 'account-creation', label: 'Create Account' },
  { name: 'basic-usage', label: 'Basic Usage' },
  { name: 'other-pages', label: 'Other Pages' }
  // { name: 'install-advanced', label: 'Advanced Installation' }
]

export default function InstructionsTabbed () {
  const classes = useStyles()
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleChangeTab = (event, newValue) => {
    setActiveIndex(newValue)
  }

  const handleChangeIndex = (index) => {
    setActiveIndex(index)
  }

  const tabContent = [
    <BasicInstallation key={0} />,
    <AccountCreation key={1} />,
    <BasicUsage key={2} />,
    <OtherPages key={3} />
    // <AdvancedInstallation key={4} />
  ]

  // Hash change listener function
  const hashChangeListener = useCallback(() => {
    switch (window.location.hash) {
      case '#basic-install': setActiveIndex(0); break
      case '#account-creation': setActiveIndex(1); break
      case '#basic-usage': setActiveIndex(2); break
      case '#other-pages': setActiveIndex(3); break
      // case '#advanced-installation': setActiveIndex(4); break
    }
  }, [])

  // Initialize and respond to updated hashes
  useEffect(() => {
    hashChangeListener()
    window.addEventListener('hashchange', hashChangeListener)
    return () => {
      window.removeEventListener('hashchange', hashChangeListener)
    }
  }, [hashChangeListener])

  return (
    <React.Fragment>
      <div className={classes.headingRoot}>
        <KarunaIcon />
        <Typography component="h1" variant="h4">
          {'Welcome to Karuna'}
        </Typography>
      </div>
      <div className={classes.pageRoot}>
        <AppBar position="static" color="default">
          <Tabs
            value={activeIndex}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="Karuna Extension Instructions"
          >
            {TAB_INFO.map((curTab, i) => (
              <Tab
                key={curTab.name}
                label={curTab.label}
                className={classes.tabStyle}
                {...a11yPropsTab(curTab.name)}
              />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeIndex}
          onChangeIndex={handleChangeIndex}
        >
          {TAB_INFO.map((curTab, i) => (
            <TabPanel
              key={curTab.name}
              name={curTab.name}
              active={activeIndex === i}
              dir={theme.direction}
            >
              {tabContent[i]}
            </TabPanel>
          ))}
        </SwipeableViews>
      </div>
    </React.Fragment>
  )
}
