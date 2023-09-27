const express = require('express')
const getConnection= require('./db')
const User= require('./Models/User')
const Movie= require('./Models/Movie')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const fetchuser= require('./Middleware/fetuser')
require("dotenv").config();

getConnection()
const app = express()
const port = 5000
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('nodemon!')
})

app.post('/api/signup',async (req,res)=>{
  const {name,email,password}=req.body
  let user= await User.findOne({email})
  
  if(user){
    return res.status(400).json({err:"user already exist"})
  }
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
  
  user=  new User({name,email,password:hash})
  user.save()
  
  const data={
      user:{
        id:user._id
      }
    }
const  token = jwt.sign(data, process.env.JWT_SEC);
  res.json({token})
})

app.post('/api/login', async(req,res)=>{
  const {email,password}= req.body
  const user= await User.findOne({email})
  if(!user){
    return res.status(400).json({err: "user not found"})
  }
  const cpass= bcrypt.compareSync(password, user.password);
  if(!cpass){
    return res.status(400).json({err: "wrong password"})
  }
  const data={
      user:{
        id:user._id
      }
    }
  const  token = jwt.sign(data, process.env.JWT_SEC);
  res.json({token})
})


app.get('/api/getuser', fetchuser, async(req,res)=>{
  let id=req.user.id
  
    const user= await User.findById(id).select("-password")
    res.json(user)
})

app.post('/api/addmovie', async(req,res)=>{
  const{title,description,videoUrl,thumbnailUrl,genre,duration}=req.body
  const movie =  new Movie({title,description,videoUrl,thumbnailUrl,genre,duration})
  movie.save()
  res.json(movie)
})

app.get('/api/random', async(req,res)=>{
  try{
  const movieCount= await Movie.count()
  const randomIndex = Math.floor(Math.random() * movieCount);
const randonmovie= await Movie.findOne().skip(randomIndex)
  

  res.json(randonmovie)
  }catch(err){
    console.log(err)
  }
})


app.get('/api/getmovies', async(req,res)=>{
  
  const movie =  await Movie.find()
  
  res.json(movie)
})


app.post('/api/favorate', fetchuser, async(req,res)=>{
  const {movieId}= req.body
  
  let userId= req.user.id
  const user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(400).json({err:"user not found"})
  }
  try{
  const movie =  await Movie.findById(movieId)
  if(!movie){
    return res.status(400).json({err:"movie not found"})
  }
 const nuser= await User.findByIdAndUpdate(userId,{$push:{"favoriteIds":movieId }})
res.json(nuser)
    
  }catch(err){
  console.log(err)
}
})

app.delete ('/api/favorate/:id', fetchuser ,async(req,res)=>{
  const movieId= req.params.id
  let userId= req.user.id
  const user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(400).json({err:"user not found"})
  }
  try{
  const movie =  await Movie.findById(movieId)
  if(!movie){
    return res.status(400).json({err:"movie not found"})
  }
  const nuser= await User.findByIdAndUpdate(userId,{$pull:{"favoriteIds":movieId }})
res.json(nuser)
}catch(err){
  console.log(err)
}
})



app.get ('/api/favorate', fetchuser ,async(req,res)=>{
  
  let userId= req.user.id
  const user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(400).json({err:"user not found"})
  }
  try{
   const movies = await Movie.find({ '_id': { $in: user.favoriteIds } });
  if(!movies){
   return res.status(400).json({err:"movie not found"})
  }
  
res.json(movies)
}catch(err){
  console.log(err)
}
})

app.get ('/api/watch/:id', fetchuser ,async(req,res)=>{
  const movieId= req.params.id
  let userId= req.user.id
  const user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(400).json({err:"user not found"})
  }
  try{
  const movie =  await Movie.findById(movieId)
  if(!movie){
    return res.status(400).json({err:"movie not found"})
  }
  
res.json(movie)
}catch(err){
  console.log(err)
}
})






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})