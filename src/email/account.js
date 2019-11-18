const sgMail=require('@sendgrid/mail')

// const sendgridAPIkey='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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
  sgMail.send(
    {
      to:email,
      from:'abiakhil69@gmail.com',
      subject:'This is my email',
      text:`i got job ${name} full stack developer`
    }
  )
}
const sendLastEmail=(email,name)=>{
  sgMail.send({
    to:email,
    from:'abiakhil69@gmail.com',
    subject:'why me',
    text:`Pls ${name} review for service`
  })
}
module.exports={
  sendWelcomeEmail,
  sendLastEmail
}