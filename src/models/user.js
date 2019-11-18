const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const Task=require('../models/tasks')

const userSchema= new mongoose.Schema({
  name:{
    type: String,
    trim:true,
    required:true
  },
  age: {
    type: Number,
    default:0,
    validate(value){
      if(value < 0){
        throw new Error('age is must positive')
      }
    }
  },
  email:{
       type:String,
       unique:true,
       required:true,
       trim:true,
       lowercase:true,
       validate(value){
         if(!validator.isEmail(value)){
             throw new Error('email is not validate')
         }
       }
  },
  password:{
    type: String,
    required:true,
    trim:true,
    minlength:7,
    validate(value)
 { if(value.toLowerCase().includes('password'))
     {
      throw new Error('password is not "password"')
     }
 }
  },
  //tracking tokens for multiple devices (logout each token)
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }],
  avatar:{
    type:Buffer
  }
},
{
  timestamps:true
})
//relationship not store db.mongoose use it for figure-it
userSchema.virtual('Tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'Owner'

})
//automatically call (toJSON method)(manipulate objects)usable func for delete private data
userSchema.methods.toJSON = function (){ 
  const user =this

  const userObject=user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}
//reusable function tokens of user
userSchema.methods.generateAuthToken=async function(){
  const user=this

  const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
//(add tokens array )
    user.tokens=user.tokens.concat({token})
    await user.save()

  return token

}
//reusable function for login
userSchema.statics.findByCredtinals=async(email,password)=>{
  //find user
  const user = await User.findOne({email})
 
  if(!user){
    throw new Error('Unable to login')
  }
  
  const passwordcheck = await bcrypt.compare(password,user.password)

  if(!passwordcheck){
    throw new Error('Unable to login')
  }

  return user
}
//hash the plain text before saving
userSchema.pre('save',async function(next){
  const user=this
 
  if(user.isModified('password')){ //password hashed once
    user.password= await bcrypt.hash(user.password,8)
  }
  next()

})
//delete user task
userSchema.pre('remove',async function (next){
  const user=this
  await Task.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model('User',userSchema)

module.exports=User