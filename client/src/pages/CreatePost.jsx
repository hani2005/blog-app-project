import React, { useState } from "react"
import "react-quill/dist/quill.snow.css"
import { Navigate } from "react-router-dom"
import Editor from "../Editor"

function CreatePost() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState("")
  const [redirect, setRedirect] = useState(false)

  async function createNewPost(e) {
    e.preventDefault()
    try {
      if (!title || !summary || !content || !files) {
        alert("Required fields cant be empty")
      } else {
        const data = new FormData()
        data.set("title", title)
        data.set("summary", summary)
        data.set("content", content)
        data.set("file", files[0])
        const response = await fetch("http://localhost:3000/api/post", {
          method: "POST",
          body: data,
          credentials: "include"
        })
        if (response.ok) {
          setRedirect(true)
          alert("Post created successfully")
        }
      }
    } catch (e) {
      console.log(e)
      alert("Error : please try again later")
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />
  }

  return (
    <form className="create-post" onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Create post</button>
    </form>
  )
}

export default CreatePost
