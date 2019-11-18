const jwt=require('jsonwebtoken')//for verify
const User=require('../models/user')//for look array of token



const auth= async (req,res,next)=>{
  
  try{
    const token= req.header('Authorization').replace('Bearer ', '')
    const decoded =jwt.verify(token,process.env.JWT_SECRET)
    //find user (below code) already check array of tokens or not 
    const user= await User.findOne({_id: decoded._id, 'tokens.token':token })
   
    if(!user){
      throw new Error()
    }
    
    req.token=token //send token to req.token
    req.user=user  // send user for route handlers
    next()
  }
  catch(e){
    res.status(401).send({error:'Pls auth'})
  }
  
  
}

module.exports=auth