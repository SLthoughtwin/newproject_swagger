const express = require('express');
const route =  express.Router();
const postmodule = require('../controller/controller');
const {mailsystem} = require('../sendmail/sendmail')
const { signUpValidation, loginValidation ,accesstokenvarify,uploadfile,accesstokenvarify2} = require("../Validation");

/**
 * @swagger
 *  /crud:
 *    get:
 *       summary: this is home page 
 *       tags: [CRUD_API]
 *       responses:
 *         200:
 *           description: this is first route 
 * 
 */


route.get('/',(req,res)=>{
    res.render('index.hbs');
}),
route.get('/signup',(req,res)=>{
    res.render('signup.hbs');
}),
route.get('/userlogin',(req,res)=>{
    res.render('login.hbs');
}),

route.get('/forgot-password',(req,res,next)=>{
    res.render('forgot-password')
});

/**
 * @swagger
 * /crud/signUp:
 *   post:
 *     summary: create a new user
 *     tags: [user_signup]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - name
 *                   - lastname
 *                   - phone
 *                   - email
 *                   - password
 *                   - cpassword
 *                properties:
 *                   name:
 *                      type:string
 *                   lastname:
 *                      type: string
 *                   phone:
 *                      type: integer
 *                   email:
 *                      type: email
 *                   password:
 *                      type:password
 *                   cpassword:
 *                      type: password
 *                example:
 *                   name: sourabh
 *                   lastname: lodhi
 *                   phone: 2345678901
 *                   email: sourabh@gmail.com
 *                   password: "1234"
 *                   cpassword: "1234"
 *            
 *     responses:
 *       200:
 *         description: signup successfully 
 *     
 * 
 * 
 */
route.post('/signUp',signUpValidation,postmodule.signUP);

/**
 * @swagger
 *  /crud/login:
 *    post:
 *      summary: login user
 *      tags: [user_login]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *                required:
 *                   - email
 *                   - password
 *                properties:
 *                   email:
 *                     type: email
 *                   password: 
 *                     type: password
 *      responses:
 *           200:
 *              description: login successfully
 *                
 * 
 */
route.post('/login',loginValidation,postmodule.login,mailsystem)


/**
 * @swagger
 *   /crud/show/{token}:
 *      get:
 *        summary: get all users
 *        tags: [all_user]
 *        parameters:
 *           - in: path
 *             name: token
 *             schema:
 *               type: string
 *             required: true
 *        responses:
 *            200:
 *              description: get all users
 * 
 */

route.get('/show/:token',accesstokenvarify2,postmodule.getUserdata);

/**
 * @swagger
 *    /crud/update/{id}:
 *       post:
 *          summary: update user profile
 *          tags: [update_user_profile]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                id: 
 *                  type: string
 *          requestBody:
 *            required: true
 *            content: 
 *               application/json:
 *                   schema:
 *                       - name
 *                       - lastname
 *                       - phone
 *                       - email
 *                   required:
 *                       - token
 *                   properties:
 *                      name:
 *                         type: string
 *                      lastname: 
 *                         type: string
 *                      phone:
 *                         type: integer
 *                      email:
 *                          type: email
 *                      token:
 *                          type: string
 *                   example:
 *                      name: sourabh
 *                      lastname: lodhi
 *                      phone: 5757563753
 *                      email: "sourabh@gmail" 
 *      
 *          responses:
 *             200: 
 *                description: update profile successfully 
 */

route.post('/edit/:id',accesstokenvarify,postmodule.edituser);
route.post('/update/:id',accesstokenvarify,postmodule.updateUser);

/**
 * @swagger
 *    /crud/delete/{id}/{token}:
 *       get:
 *          summary: delete user profile
 *          tags: [delete_user_profile]
 *          parameters:
 *             - in: path
 *               name: id
 *             - in: path
 *               name: token
 *               schema:
 *                 id:
 *                   type: string
 *                 token:
 *                   type: string
 *          responses:
 *             200: 
 *                description: delete successfully
 *           
 */
route.get('/delete/:id/:token',accesstokenvarify2,postmodule.deleteUser);
route.post('/forgot-password',postmodule.forgotpassword)
route.get('/reset-password/:id/:token',postmodule.resetfunction);
route.post('/reset-password/:id/:token',postmodule.resetpassword)




module.exports = route;