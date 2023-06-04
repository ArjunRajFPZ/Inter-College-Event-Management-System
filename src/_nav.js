import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilNewspaper,
  cilLocationPin,
  cilSchool,cilUser,cilCalendarCheck
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Dashboard',
  },
  {
    component: CNavGroup,
    name: 'Event',
    to: '/event',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Event Add',
        to: '/Eventadd',
      },
      {
        component: CNavItem,
        name: 'Event View',
        to: '/Eventview',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Venue',
    to: '/venue',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Venue Add',
        to: '/Venueadd',
      },
      {
        component: CNavItem,
        name: 'Venue View',
        to: '/Venueview',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'College',
    to: '/college',
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'College Add',
        to: '/Collegeadd',
      },
      {
        component: CNavItem,
        name: 'College View',
        to: '/Collegeview',
      },
      {
        component: CNavItem,
        name: 'College Approval',
        to: '/Collegeapprove',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Event Participation',
    to: '/Eventparticipation',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Student Participation',
    to: '/Studentparticipation',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon customClassName="nav-icon" />,
  },
]

export default _nav
