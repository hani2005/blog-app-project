import React, { useEffect, useState } from "react"
import Post from "../Post"

function HomePage() {
  const [posts, setPosts] = useState([])
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    fetch("https://blog-app-k9kb.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts)
      })
    })
  }, [])

  const showMorePosts = () => {
    setVisible((prev) => prev + 3)
  }

  return (
    <div className="homepage">
      <div className="homepage-banner">
        <div className="homepage-banner-img">
          <img
            src="https://images.unsplash.com/photo-1493497029755-f49c8e9a8bbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
        </div>
        <div className="homepage-text">
          <h1>Writings from our team</h1>
          <h5>
            The latest industry news, interviews, technologies, and resources.
          </h5>
        </div>
      </div>
      <h4>Recent blog posts</h4>
      <div className="post-container">
        {posts.length > 0 &&
          posts
            .slice(0, visible)
            .map((post) => <Post {...post} key={post._id} />)}
      </div>
      <button onClick={showMorePosts}>Show More</button>
    </div>
  )
}

export default HomePage
