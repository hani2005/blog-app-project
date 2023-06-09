import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "./UserContext"
import logo from "/the-blog.png"

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext)
  useEffect(() => {
    fetch("https://blog-app-project.vercel.app/api/profile", {
      credentials: "include"
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo)
      })
    })
  }, [])

  function logout() {
    fetch("https://blog-app-project.vercel.app/api/logout", {
      credentials: "include",
      method: "POST"
    })
    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="" />
      </Link>
      <nav>
        {username && (
          <>
            <span className="username">Hello, {username}</span>
            <div>
              <Link className="add-post" to={"/create"}>
                Add new post
              </Link>
              <a className="logout-btn" onClick={logout}>
                Logout
              </a>
            </div>
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
