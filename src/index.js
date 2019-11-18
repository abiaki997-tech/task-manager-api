//load express server
const express=require('express')
require('./db/mongoose')
const routerUser=require('./routers/user-router')
const routerTask=require('./routers/task-router')

const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(routerUser)
app.use(routerTask)


app.listen(port, () =>{
  console.log('server up port '+port)
})
// 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



// const Task = require('./models/tasks')

// const main=async()=>{

//   const task=await Task.findById('5dc6afacb971090ca820c456')
//   await task.populate('owner').execPopulate()
//   console.log(task.owner)
// }
// main()

//file upload pdf

// const multer=require('multer')
// const upload=multer({
//   dest:'images',
//   limits:{
//     fileSize:1000000
//   },
//   fileFilter(req,file,cb)
//   {
//     if (!file.originalname.match(/\.(doc|docx)$/)){
//       return cb(new Error('Please Upload a Word document'))
//     }
//     cb(undefined,true)
//   }
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{

//   res.send()
// },(error,req,res,next)=>{

//   res.status(400).send({error: error.message})
// })