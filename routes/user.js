const { render } = require('ejs');
const e = require('express');
const express = require('express');
const User = require('../models/User');
const request = require('request')

const router = express.Router();



router.get('/login', (req,res) => res.render('login'))
router.get('/signup', (req,res) => res.render('signup'))

// Handle Signup
router.post('/signup', (req,res) => {
    const { name, email, address, password, password2}= req.body

    let errors = []

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields!'})
    }

    if(password !=password2){
        errors.push({msg: 'Passwords do not match!'})
    }

    if(password.length <6){
        errors.push({msg: 'Passwords should be atleast 6 characters'})
    }

    if(errors.length >0){
        res.render('signup',{
            errors,
            name,
            email,
            address,
            password,
            password2
        });
    }
    else{
       // Validation passed
       User.findOne( { email: email })
       .then( user =>{
           if(user){
            errors.push({msg: 'Already exits'})
            res.render('signup',{
                errors,
                name,
                email,
                address,
                password,
                password2
            })
           }
           else{
               const newUser = new User({
                   name,
                   email,
                   address,
                   password
               })
               newUser.save()
               .then(user =>{
                   res.redirect('/user/login')
               })
               .catch(err => console.log(err))
           }
       })
    }
} )

// Handle Login
router.post('/login', (req,res) =>{
    const { email , password}= req.body

    let errors = []

    if(!email || !password ){
        errors.push({msg: 'Please fill in all fields!'})
    }

    if(password.length <6){
        errors.push({msg: 'Passwords should be atleast 6 characters'})
    }

    if(errors.length >0){
        res.render('login',{
            errors,
            email,
            password
        })
    }
    else{
       // Validation passed
       
       User.findOne( { email: email })
       .then( user =>{
           if(user){
               if(password == user.password){
                 res.render('welcome',{user})
               }
               else{
                   errors.push({msg: 'Invalid password'})
                   res.render('login',{
                    errors,
                    email,
                    password
                  })
               }
           }
           else{
            errors.push({msg: 'User not found'})
            res.render('login',{
             errors,
             email,
             password
           })
           }
       })
       .catch( err => console.log(err))
    }

} )
module.exports = router