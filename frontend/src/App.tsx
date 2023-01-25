import React, {useEffect} from 'react';
import './App.css';
import {CookiesProvider, Cookies} from "react-cookie"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {LoginPage, SignupPage, DashboardPage, ProfilePage} from "./pages"
import {ERouteNames} from "./enums"
import {useSelector, useDispatch} from "react-redux"
import {RootState} from "./redux"
import {slices} from "./redux/slice-collection"
import {ProtectedLayout} from "./pages/protected"
import {verifyToken} from "./utils"
import {IUserDetails} from './redux/user/user-states';

function App() {
  const isLoggedIn: boolean = useSelector((state: RootState): boolean => state.session.loggedIn)
  const cookies = new Cookies()
  const dispatch = useDispatch()

  const pathName : string = window.location.pathname

  const resetData = () => {
    /**
     * 
     * Send an API call here to remove the sessionToken from the backend
     */
    dispatch(slices.session.logout())
    dispatch(slices.datalog.reset())

    if (pathName !== ERouteNames.ROOT_PAGE && pathName !== ERouteNames.SIGNUP_PAGE) {
      window.location.href = "/"
    }
  }

  useEffect(() => {
    /** 
     * 
     * We are using the refresh token as the reference here
     * as it does not have any expiry so it will always be
     * available from the cookie
     */
    const token = cookies.get("refresh_token")
    
    if (!token) return resetData()

    const userDetails: IUserDetails = verifyToken(token) as IUserDetails

    if (!userDetails) return resetData()

    dispatch(slices.datalog.logData(userDetails))
    dispatch(slices.session.login())
  })

  return (
    <CookiesProvider>
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
    </CookiesProvider>
  );
}

export default App;
