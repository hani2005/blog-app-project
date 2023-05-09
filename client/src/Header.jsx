import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "./UserContext"
import logo from "../public/the-blog.png"

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext)
  useEffect(() => {
    fetch("https://blog-app-msrz.onrender.com/profile", {
      credentials: "include",
      mode: 'no-cors',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo)
      })
    })
  }, [])

  function logout() {
    fetch("https://blog-app-msrz.onrender.com/logout", {
      credentials: "include",
      mode: 'no-cors',
      method: "POST"
    })
    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="" />
        <span><strong>The</strong> Blog</span>
      </Link>
      <nav>
        {username && (
          <>
            <span className="username">Hello, {username}</span>
            <Link className="add-post" to={"/create"}>
              Add new post
            </Link>
            <a className="logout-btn" onClick={logout}>
              Logout
            </a>
          </>
        )}
        {!username && (
          <>
            <Link className="login-btn" to={"/login"}>
              Login
            </Link>
            <Link className="register-btn" to={"/register"}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
