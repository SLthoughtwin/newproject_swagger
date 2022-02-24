const nodemailer = require("nodemailer");

module.exports = { 
  mailsystem :(req,res,next)=>{

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user : 'sourabhlodhi.thoughtwin@gmail.com',
        pass : "*********",
      }
    });
    
    console.log(req.body.email)
    const mailOption = {
      from : 'sourabhlodhi.thoughtwin@gmail.com',
      to : req.body.email,
      subject : 'testing and testing',
      text : 'Login successfully'
    }
    
    transporter.sendMail(mailOption)
    .then((res)=>{
      next();
      console.log('mail send successfully')
    }).catch((err)=>{
      console.log('oops! error',err)
    })
  
  
  },



   mailfunction :(email,link)=>{

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user : 'sourabhlodhi.thoughtwin@gmail.com',
        pass : "*********",
      }
    });
    const mailOption = {
      from : 'sourabhlodhi.thoughtwin@gmail.com',
      to : email,
      subject : 'testing and testing',
      text : link
    }
    
    transporter.sendMail(mailOption)
    .then((res)=>{
      // next();
      console.log('mail send successfully')
    }).catch((err)=>{
      console.log('oops! error',err)
    })
  
  
  },

}