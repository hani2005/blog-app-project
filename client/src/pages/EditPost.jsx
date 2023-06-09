import React, { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import Editor from "../Editor"
import { Toaster, toast } from "react-hot-toast"

function EditPost() {
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState("")
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    fetch("https://blog-app-project.vercel.app/api/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title)
        setSummary(postInfo.summary)
        setContent(postInfo.content)
      })
    })
  }, [])

  async function updatePost(e) {
    e.preventDefault()
    const data = new FormData()
    data.set("title", title)
    data.set("summary", summary)
    data.set("content", content)
    data.set("id", id)
    if (files?.[0]) {
      data.set("file", files?.[0])
    }
    const response = await fetch("https://blog-app-project.vercel.app/api/post", {
      method: "PUT",
      body: data,
      credentials: "include"
    })
    if (response.ok) {
      setRedirect(true)
      alert("Post edited successfully")
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />
  }

  return (
    <form className="edit-post-page" onSubmit={updatePost}>
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
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  )
}

export default EditPost
