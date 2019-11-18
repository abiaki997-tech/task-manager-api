const express=require('express')
const User=require('../models/user')
const auth=require('../middle-ware/auth')
const router=new express.Router()
const multer=require('multer')
const {sendLastEmail,sendWelcomeEmail}=require('../email/account')

//create users
router.post('/users',async(req,res) =>{

  const user=new User(req.body)
 
  try{
       await user.save()
       sendWelcomeEmail(user.email,user.name)
       //generate token
       const token= await user.generateAuthToken()
       res.status(201).send({user,token})
      }
 catch(e){
      res.status(400).send(e)
     }
  
})
//(login user) reusable function access creditnals
router.post('/users/login',async(req,res)=>{
  try{
     
    const user=await User.findByCredtinals(req.body.email,req.body.password)
    //token return (specific user above)
    const token=await user.generateAuthToken()

    res.send({user,token})//return properties
  }
  catch(e){
   res.status(400).send()
  }
}) 
//post image
const upload=multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb (new Error ('Please upload a image'))
    }
    cb(undefined,true)
  }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
 
  const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar=buffer
  // req.user.avatar=req.file.buffer
  await req.user.save()
  res.status(200).send()
},(error,req,res,next)=>{ 

  res.status(400).send({error:error.message})

})

//logout
router.post('/users/logout',auth,async(req,res)=>{

  //(filter out figure parctiular auth token)
  try{
   
    req.user.tokens=req.user.tokens.filter((token)=>{
     return token.token !==req.token

    })
    await req.user.save()
    res.send()
  }catch(e){
   res.status(500).send()
  }
})
// Log out ALL
router.post('/users/logoutAll',auth,async(req,res)=>{
 try{
  req.user.tokens=[]
  await req.user.save()
  res.send()

 }catch(e){
   res.status(500).send()
 }
})
// REad users know me not id
router.get('/users/me',auth,async(req,res)=>{
 //(get userprofile only)
    res.send(req.user)
})
//read one user by id
   // // 
//update user by id
router.patch('/users/me',auth,async(req,res)=>{
  
  const updates=Object.keys(req.body)
  const allowedUpdates=['name','email','age','password']
  const isvaildUpdate=updates.every((update)=>{
   return allowedUpdates.includes(update)
  })

 if(!isvaildUpdate){
  return res.status(400).send({error:'is invaild update'})
 }

  try{
    updates.forEach((update)=>{
    
      user[update]=req.body[update]           
        })
        await user.save()//call middleware 
        res.send(req.user) 
  }
  catch(e){
       res.status(500).send(e)
  }
})
// delete user
router.delete('/users/me',auth,async(req,res)=>{
  try{
     await req.user.remove()
     sendLastEmail(req.user.email,req.user.name)
     res.send(req.user)
  }
  catch(e){
    res.status(500).send()
  }
})
//delete image
router.delete('/users/me/avatar',auth,async (req,res)=>{
  req.user.avatar=undefined,
  await req.user.save(),
  res.status(200).send()

})
//get image
router.get('/users/:id/avatar',auth,async(req,res)=>{

  try{
     const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
          return new Error()
        }
      res.set('Content-type','image/png') 
      res.send(user.avatar) 
  }
  catch(e){    
        res.status(400).send()
  }
})
module.exports=router