import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {LoginPage, SignupPage} from "./pages"
import {ERouteNames} from "./enums"

function App() {
  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <BrowserRouter>
            <Routes>
              <Route path={ERouteNames.ROOT_PAGE} element={<LoginPage/>} />
              <Route path={ERouteNames.SIGNUP_PAGE} element={<SignupPage/>} />
            </Routes>
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
