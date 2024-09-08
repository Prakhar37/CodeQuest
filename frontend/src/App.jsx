import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import AddProblem from './components/AddProblem';
import AdminLogin from './pages/AdminLogin';

function App() {

  return (
   <BrowserRouter>
     <Routes>
       <Route path = "/" element={<Home />}></Route>
       <Route path = "/signup" element={<Signup />}></Route>
       <Route path = "/login" element={<Login />}></Route>
       <Route path = "/forgotPassword" element={<ForgotPassword />}></Route>
       <Route path = "/resetPassword/:token" element={<ResetPassword />}></Route>
       <Route path = "/dashboard" element={<Dashboard/>}></Route>
       <Route path = "/problemlist" element={<ProblemList />}></Route>
       <Route path = "/problems/:id" element={<ProblemDetail />}></Route>
       <Route path = "/add-problem" element={<AddProblem />}></Route>
       <Route path="/admin-login" element={<AdminLogin />}></Route>
     </Routes>
   </BrowserRouter>
  )
}

export default App
