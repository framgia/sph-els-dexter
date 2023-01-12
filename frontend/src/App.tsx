import React from 'react';
import './App.css';
import {RootState} from "./redux"
import {useSelector} from "react-redux"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {LoginPage, SignupPage, DashboardPage} from "./pages"
import {ERouteNames} from "./enums"

function App() {
  const isLoggedIn: boolean = useSelector((state: RootState) => state.user.loggedIn)

  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <BrowserRouter>
          {
            isLoggedIn ? (
              <Routes>
                <Route path={ERouteNames.DASHBOARD_PAGE} element={<DashboardPage/>} />
              </Routes>
            ) : (
              <Routes>
                <Route path={ERouteNames.ROOT_PAGE} element={<LoginPage/>} />
                <Route path={ERouteNames.SIGNUP_PAGE} element={<SignupPage/>} />
              </Routes>
            )
          }
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
