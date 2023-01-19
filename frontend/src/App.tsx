import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {LoginPage, SignupPage, DashboardPage, ProfilePage} from "./pages"
import {ERouteNames} from "./enums"
import {useSelector} from "react-redux"
import {RootState} from "./redux"
import {ProtectedLayout} from "./pages/protected"

function App() {
  const isLoggedIn: boolean = useSelector((state: RootState): boolean => state.session.loggedIn)

  return (
    <>
      <div className="w-screen min-h-full h-screen">
        <div className="w-full w-full space-y-8">
          <BrowserRouter>
            {
              isLoggedIn ? (
                <ProtectedLayout>
                  <Routes>
                    <Route path={ERouteNames.DASHBOARD_PAGE} element={<DashboardPage/>} />
                    <Route path={ERouteNames.PROFILE_PAGE} element={<ProfilePage/>} />
                  </Routes>
                </ProtectedLayout>
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
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
