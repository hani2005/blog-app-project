import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "./UserContext"

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext)
  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      credentials: "include"
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo)
      })
    })
  }, [])

  function logout() {
    fetch("http://localhost:3000/logout", {
      credentials: "include",
      method: "POST"
    })
    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to="/" className="logo">
      <strong>Blog</strong> App
      </Link>
      <nav>
        {username && (
          <>
          <span className="username">Hello, {username}</span>
            <Link className="add-post" to={"/create"}>Add new post</Link>
            <a className="logout-btn" onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link className="login-btn" to={"/login"}>Login</Link>
            <Link className="register-btn" to={"/register"}>Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
