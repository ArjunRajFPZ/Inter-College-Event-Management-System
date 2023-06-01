import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { initializeApp } from "firebase/app";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Details = React.lazy(() => import('./views/pages/details/Details'))
const SubDetails = React.lazy(() => import('./views/pages/details/SubDetails'))
const StudentAdd = React.lazy(() => import('./views/pages/student/Studentadd'))
const Home = React.lazy(() => import('./views/pages/home/Home'))


const Userid = sessionStorage.getItem("id");

const firebaseConfig = {
//   PUT YOUR FIREBASE CONFIGRATION HERE
};

const app = initializeApp(firebaseConfig);

class App extends Component {
  
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/home" name="Home Page" element={<Home />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path='/:EventID/details' name="Details Page" element={<Details />} />
            <Route exact path='/:EventID/subdetails' name="Details Page" element={<SubDetails />} />
            <Route exact path='/:EventID/registration' name="Register Page" element={<StudentAdd />} />
            {Userid ==='' ?
            <Route exact path="/home" name="Home Page" element={<Home />} />
            :
            <Route path="*" name="Dashboard" element={<DefaultLayout />} />
            }
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
