# Notes from 6/15

## Sibling: Connect Status Panel

This is the drawer that displays the three status icons. Clicking it toggles the Connect Main Panel.

- Paper -> Icons + positioning CSS / OpenArrow
- Transitions (MaterialUI Theme has createTransition())

## Foundation: Connect Main Panel

- Paper -> PanelTitle + Main content

## Main Component

- List -> Expandable
- Items under the list are each clickable to expand and show more lists
  - User's status -> click on current affect -> affect survey

- Root: Accordion
  - User Status Component
  - Team Status Component
  - ...

## User Status Component

- Grid: Avatar, affect, collaboration, TTR
  - AffectSurveyComponent
  - CollaborationComponent
  - TTRComponent

## AffectSurveyComponent

- Collapse Transition (accordion?)
- AffectListComponent
  - Search Bar for filtering
  - List -> Affects
    - AffectItem Component
