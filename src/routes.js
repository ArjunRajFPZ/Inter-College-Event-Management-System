import React from 'react'

// Event
const EventAdd = React.lazy(() => import('./views/event/Eventadd'))
const EventView = React.lazy(() => import('./views/event/Eventview'))
const SubEventView = React.lazy(() => import('./views/event/SubEventView'))

// College
const CollegeAdd = React.lazy(() => import('./views/college/Collegeadd'))
const CollegeView = React.lazy(() => import('./views/college/Collegeview'))
const CollegeApprove = React.lazy(() => import('./views/college/Collegeapprove'))

// Venue
const VenueAdd = React.lazy(() => import('./views/venue/Venueadd'))
const VenueView = React.lazy(() => import('./views/venue/Venueview'))

// Event Participation
const EventParticipation = React.lazy(() => import('./views/eventparticipation/Eventparticipation'))
const SubEventParticipation = React.lazy(() => import('./views/eventparticipation/Subeventparticipation'))
const EventparticipationView = React.lazy(() => import('./views/eventparticipation/Eventparticipationview'))

// Student Participation
const StudentParticipation = React.lazy(() => import('./views/studentparticipation/Studentparticipation'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/event', name: 'Event', exact: true },
  { path: '/Eventadd', name: 'EventAdd', element: EventAdd },
  { path: '/Eventview', name: 'EventView', element: EventView },
  { path: '/:subEventID/sub-events', name: 'SubEvents', element: SubEventView },

  { path: '/venue', name: 'Venue', exact: true },
  { path: '/Venueadd', name: 'VenueAdd', element: VenueAdd },
  { path: '/Venueview', name: 'VenueView', element: VenueView },

  { path: '/college', name: 'College', exact: true },
  { path: '/Collegeadd', name: 'CollegeAdd', element: CollegeAdd },
  { path: '/Collegeview', name: 'CollegeView', element: CollegeView },
  { path: '/Collegeapprove', name: 'CollegeApprove', element: CollegeApprove },
  
  { path: '/Eventparticipation', name: 'Event Participation', element: EventParticipation },
  { path: '/:EventID/SubEventParticipation', name: 'Event Participation', element: SubEventParticipation },
  { path: '/:EventID/EventparticipationView', name: 'Event Participation', element: EventparticipationView },
  
  { path: '/Studentparticipation', name: 'Student Participation', element: StudentParticipation },
]

export default routes
