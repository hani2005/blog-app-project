import React from "react"
import { formatISO9075 } from "date-fns"
import { Link } from "react-router-dom"
import Image from "./Image"

function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <div className="post" key={_id}>
      <div className="post-img">
        <Link to={`/post/${_id}`}>
          <Image src={cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="summary">{summary}</p>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
      </div>
    </div>
  )
}

export default Post
