// importing dependencies
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const User = require("./models/User")
const Post = require("./models/Post")
const app = express()
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const multer = require("multer")
const fs = require("fs")

// bcrypt password
const salt = bcrypt.genSaltSync(10)

// jwt secret
const secret = "sasofasfo43ogoeg5546p45kpojhuu21y8e3"

const bucket = 'hani-booking-app'

// middlewares
app.use(cors({ credentials: true, origin: "http://localhost:5173" }))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"))
const uploadMiddleware = multer({ dest: "/tmp" , limits:{fieldSize: 25 * 1024 * 1024} })

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  })
  const parts = originalFilename.split(".")
  const ext = parts[parts.length - 1]
  const newFilename = Date.now() + "." + ext
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read"
    })
  )
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`
}

app.get("/api/", (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  res.send("Here")
})

// to register
app.post("/api/register", async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  const { username, password } = req.body
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt)
    })
    res.json(userDoc)
  } catch (e) {
    res.status(400).json(e)
  }
})

// to login
app.post("/api/login", async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  const { username, password } = req.body
  const userDoc = await User.findOne({ username })
  const passOk = bcrypt.compareSync(password, userDoc.password)
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err
      res.cookie("token", token).json({
        id: userDoc._id,
        username
      })
    })
  } else {
    res.status(400).json("wrong credentials")
  }
})

// to get user profile
app.get("/api/profile", (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  const { token } = req.cookies
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err
    res.json(info)
  })
})

// logout
app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json("ok")
})

// create new post
app.post("/api/post", uploadMiddleware.single("file"), async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  // files upload
  const { originalname, path, mimetype } = req.file
  const coverData = await uploadToS3(path, originalname, mimetype)

  // get information
  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err
    // create the post
    const { title, summary, content } = req.body
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: coverData,
      author: info.id
    })
    res.json(postDoc)
  })
})

// update post
app.put("/api/post", uploadMiddleware.single("file"), async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  let coverDataUpdate = null
  if (req.file) {
    const { originalname, path, mimetype } = req.file
    coverDataUpdate = await uploadToS3(path, originalname, mimetype)
  }
  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err
    const { id, title, summary, content } = req.body
    const postDoc = await Post.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
    if (!isAuthor) {
      return res.status(400).json("you are not the author.")
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: coverDataUpdate ? coverDataUpdate : postDoc.cover
    })
    res.json(postDoc)
  })
})

// get posts
app.get("/api/post", async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  )
})

// get single post page
app.get("/api/post/:id", async (req, res) => {
  mongoose.connect(process.env.DATABASE_URL)
  const { id } = req.params
  const postDoc = await Post.findById(id).populate("author", ["username"])
  res.json(postDoc)
})

app.listen(3000)
