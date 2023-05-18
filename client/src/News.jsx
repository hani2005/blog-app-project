import React from "react"
import { HiOutlineMail } from "react-icons/hi"

function News() {
  return (
    <div className="news">
      <h1>
        Subscribe to our newsletter to get the
        <br /> latest blogs and updates
      </h1>
      <div className="news-container">
        <div className="news-input">
          <HiOutlineMail className="news-icon" />
          <input type="email" placeholder="Enter your email" />
        </div>
        <button>Subscribe</button>
      </div>
      <span>You will be able to unsubscribe at any time</span>
    </div>
  )
}

export default News
