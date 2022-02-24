const User = require("../model/model");
const jwt = require("jsonwebtoken");
const notifier = require("node-notifier");
const async = require("hbs/lib/async");
const { mailfunction } = require("../sendmail/sendmail");
const { bcryptpassword, bcryptmatch } = require("../Validation/index");
const { render } = require("express/lib/response");

module.exports = {
  signUP: async (req, res) => {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const response = await bcryptpassword(password, cpassword);
    const obj = req.body;
    obj.password = response.pass;
    obj.cpassword = response.cpass;
    // obj.avatar = req.file.filename;
    const result = await new User(obj);
    result
      .save()
      .then((data) => {
        notifier.notify("signUP successfully");
        res.render("login.hbs");
      })
      .catch((error) => {
        res.status(400).json({
          data: error,
          statut: 400,
          success: false,
          message: error.message,
        });
      });
  },

  login: async (req, res, next) => {
    const result = await User.find({ email: req.body.email });
    if (result.length > 0) {
      const db_pass = result[0].password;
      const user_pass = req.body.password;
      const match = await bcryptmatch(user_pass, db_pass);
      if (match === true) {
        const token = jwt.sign(
          { email: req.body.email },
          process.env.SECRET_KEY
        );
      const finalResult = {};
      finalResult.id = result[0].id;
      finalResult.name = result[0].name;
      finalResult.lastname = result[0].lastname;
      finalResult.email = result[0].email;
      finalResult.phone = result[0].phone;
      finalResult.avatar = result[0].avatar;
      finalResult.token = token;

        notifier.notify("Login successfully..");
        res.render("userprofile.hbs", { finalResult });
        // console.log(result)
        // next();
      } else {
        notifier.notify("invalid login details");
        res.redirect("back");
      }
    } else {
      notifier.notify("invalid login details");
      res.redirect("back");
    }
  },

  getUserdata: async (req, res) => {
    try {
      const result = await User.find();
      const token = req.params.token;
      const array = [];
      for(i in result){

        const finalResult = {};
        finalResult.id = result[i].id;
        finalResult.name = result[i].name;
        finalResult.lastname = result[i].lastname;
        finalResult.email = result[i].email;
        finalResult.phone = result[i].phone;
        finalResult.avatar = result[i].avatar;
        finalResult.token = token;
        array.push(finalResult);
        // console.log(finalResult)
      }
      notifier.notify("successfully get all users")
      res.render("index.hbs",  {array} );
    } catch (error) {
      res.status(404).json({
        error: error,
        statut: 400,
        success: false,
        message: "Oop! error",
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const token = req.body.token;
      // console.log(token);
      const update_data = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      notifier.notify(" Profile update successfully..");
      // req.headers.token="sourabh";
      // res.redirect(`http://localhost:8080/show`);
      return res.redirect(`http://localhost:8080/show/${token}`);
      // const finalresult = await User.find();
    //  res.render("",{finalresult})
    } catch (error) {
      res.status(404).json({
        error: error,
        statut: 400,
        success: false,
        message: "Oops! error",
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const delete_data = await User.findByIdAndDelete({
        _id: req.params.id,
      });
      // res.status(200).json({
      //   delete_data: delete_data,
      //   statut: 200,
      //   success: true,
      //   message: "delete data successfully..",
      // });
      notifier.notify("Delete User successfully");
      res.redirect("back");
    } catch (error) {
      res.status(404).json({
        error: error,
        statut: 400,
        success: false,
        message: "Oops! error",
      });
    }
  },

  edituser: async (req, res) => {
    try {
      let = finalResult = {};
      const _id = req.params.id;
      const token = req.body.token;
      const result = await User.findById({ _id });
      
      finalResult.id = result.id;
      finalResult.name = result.name;
      finalResult.lastname = result.lastname;
      finalResult.email = result.email;
      finalResult.phone = result.phone;
      finalResult.token = token;

      // console.log("===============>>>", finalResult);
      res.render("edit.hbs", { finalResult });
    } catch (error) {
      res.status(404).json({
        error: error,
        statut: 400,
        success: false,
        message: "Oops! error",
      });
    }
  },

  forgotpassword: async (req, res) => {
    const email = req.body.email;
    const result = await User.findOne({ email: req.body.email });
    if (!result) {
      res.send("user is not registered");
      return;
    } else {
      // console.log(result[0].id)
      const secret = result.password;
      const payload = {
        id: result.id,
        email: result.email,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "5m" });
      const link = `http://localhost:8080/reset-password/${result.id}/${token}`;
      mailfunction(email, link);
      res.send("password reset link has been sent to your gmail account...");
    }
  },

  resetfunction: async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    const result = await User.findOne({ _id: id });
    if (!result) {
      res.send("invalid user");
    } else {
      const secret = result.password;
      try {
        const payload = jwt.verify(token, secret);
        res.render("reset-password", { email: result.email });
      } catch (error) {
        console.log(error.message);
        res.send(error.message);
      }
    }
  },

  resetpassword: async (req, res, next) => {
    const { id, token } = req.params;
    const result = await User.findOne({ _id: id });
    if (!result) {
      console.log("invalid user");
      res.send("invalid user");
      return;
    }
    const secret = result.password;
    try {
      const payload = jwt.verify(token, secret);
      const password = req.body.password;
      const cpassword = req.body.cpassword;
      const bcryptpass = await bcryptpassword(password, cpassword);
      req.body.password = bcryptpass.pass;
      req.body.cpassword = bcryptpass.cpass;
      const update_data = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      notifier.notify("password update successfully..");
      res.redirect("http://localhost:8080/userlogin");
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  },
};
