const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const async = require("hbs/lib/async");
const bycrypt = require('bcryptjs');
const { redirect } = require("express/lib/response");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
  },
});
const uploads = multer({ storage: fileStorage }).single("avatar");

module.exports = {
  uploadfile: (req, res, next) => {
    uploads(req, res, (err) => {
      if (!err) {
        next();
        // console.log('========>')
        return req.file.originalname;
      } else {
        res.send(err);
      }
    });
  },

  signUpValidation: (req, res, next) => {
    const validateUser = (user) => {
      const JoiSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        lastname: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(50).required(),
        phone: Joi.number().required(),
        password: Joi.string().required(),
        cpassword: Joi.ref("password"),
      }).options({ abortEarly: false });
      return JoiSchema.validate(user);
    };

    const response = validateUser(req.body);
    if (response.error) {
      res.status(400).json({
        message: response.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      next();
    }
  },

  loginValidation: (req, res, next) => {
    console.log(req.body);
    const loginUser = (user) => {
      const JoiSchema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      }).options({ abortEarly: false });
      return JoiSchema.validate(user);
    };
    const response = loginUser(req.body);
    if (response.error) {
      res.status(400).json({
        message: response.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      next();
    }
  },

  accesstokenvarify: (req, res, next) => {
    // const token = req.headers.authorization;
    const token = req.body.token;
    // console.log(token);
    if (!token) {
      return res.status(400).json({
        message: "A token is required for authentication",
        status: 400,
        success: false,
      });
    } else {
      // const authHeader = req.headers.authorization;
      // const bearerToken = authHeader.split(" ");
      // const token = bearerToken[1];
      const token = req.body.token
      jwt.verify(
        token,
        "secretkeysthepieceof information",
        (error, payload) => {
          if (error) {
            res.status(400).json({
              message: "invalid token",
              status: 400,
              success: false,
            });
          } else {
            next();
          }
        }
      );
    }
  },



  accesstokenvarify2: (req, res, next) => {
    
   const token = req.params.token;
    // console.log(token)
    
    if (!token) {
      return res.status(400).json({
        message: "A token is required for authentication",
        status: 400,
        success: false,
      });
    } else {
      
      const token = req.params.token
      jwt.verify(
        token,
        "secretkeysthepieceof information",
        (error, payload) => {
          if (error) {
            // res.status(400).json({
            //   message: "invalid token",
            //   status: 400,
            //   success: false,
            // });
            res.render("invalid")
          } else {
            next();
          }
        }
      );
    }
  },

  bcryptpassword:async(password,cpassword)=>{
    const pass = await bycrypt.hash(password,10)
    const cpass = await bycrypt.hash(cpassword,10)
    return {pass,cpass};
  },
  bcryptmatch:async(user_pass,db_pass)=>{
    const matchpass = await bycrypt.compare(user_pass,db_pass)
    return matchpass;
  }
};
