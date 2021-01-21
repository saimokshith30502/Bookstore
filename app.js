const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express();
var cookieParser = require('cookie-parser')
var session = require('express-session')
var sessionChecker = require('./models/sesssionChecker')
var morgan = require('morgan')
const User = require('./models/User');

const books = require('./models/books');

const Books = require('./models/books');

const carts = require('./models/carts');

const Carts = require('./models/carts');

const Orders = require('./models/orders');


// Mongoose
const db = require('./config/keys').MongoURI

//Connection
mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('Connected to mongodb'))
.catch(err =>console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Parser
app.use(express.urlencoded({extended:false}))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${PORT}`));

// session
app.use(
    session({
        name : 'user_sid',
        secret : "bstore",
        resave : false,
        saveUninitialized : false,
        cookie : {
            expires: 700000
        }
    })
)

app.use((req,res,next) =>{
    if(!req.session.user){
        res.clearCookie('user_sid')
    }   
    next()
})

app.get('/',sessionChecker,(req,res) =>{
    res.redirect('/login')
})

// route to login
app.route('/login')
.get(sessionChecker,(req,res)=>{
    res.render('login')
})
.post(sessionChecker, (req,res) =>{
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
                req.session.user = user
                if(user.email == 'admin@bstore.com'){
                   res.redirect('admin')
                }
                else{
                res.redirect('welcome')
                }
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

// route to signup
app.route('/signup')
.get(sessionChecker,(req,res)=>{
    res.render('signup')
})
.post((req,res) => {
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
               newUser.save((err,docs) => {
                   if(err){
                       res.redirect('signup')
                   }
                   else{
                       req.session.user = docs ;
                       res.redirect('welcome')
                   }
               })
               
           }
       })
    }
} )

// route to welcome
app.route('/welcome')
.get((req,res)=>{
  res.render('welcome')  
})

// route to admin panel
app.route('/admin')
.get((req,res)=>{
    res.render('admin')
})

// route to admin panel
app.route('/user-orders')
.get((req,res)=>{
  
    Orders.find({}, function (err, allDetails){
        if(err) 
         {console.log(err)}
             else
              { res.render("user-orders", { details: allDetails })
         }
    

    })
})

// route for user logout
app.route("/logout")
.get((req, res) => {
    res.clearCookie("user_sid");
    res.redirect("/login")
  })

// route to adventure-books
app.route('/adventure-books')
.get((req,res)=>{
    res.render('adventure-books')
})
.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    var added= 'Item Added'
    if(booktitle == 'harry potter')
     price=768
     else
     price=425
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
            var added= 'Already exits'
            res.render('adventure-books',{added})
          }
          else{
              const newCart = new Carts({
                  title: booktitle,
                  genre: "adventure",
                  price: price
              })
              newCart.save()
              .then(() => res.render('adventure-books',{added}))
              .catch(err => console.log(err))
          }
      })
    })




// route to comedy-books
app.route('/comedy-books')
.get((req,res)=>{
    res.render('comedy-books')
})

// add to cart

.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    if(booktitle == 'the comedy of errors')
     price=464
     else
     price=345
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
           var added= 'Already exits'
           res.render('comedy-books',{added})
          }
          else{
            var added= 'Item added'
              const newCart = new Carts({
                  title: booktitle,
                  genre: "comedy",
                  price: price
              })
              newCart.save()
              .then(() => res.render('comedy-books',{added}))
              .catch(err => console.log(err))
          }
      })
    })












// route to fiction-books
app.route('/fiction-books')
.get((req,res)=>{
    res.render('fiction-books')
})

// add to cart

.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    if(booktitle == 'one indian girl')
     price=536
     else
     price=231
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
            var added= 'Already exits'
            res.render('fiction-books',{added})
          }
          else{
            var added= 'Item added'
              const newCart = new Carts({
                  title: booktitle,
                  genre: "fiction",
                  price: price
              })
              newCart.save()
              .then(() => res.render('fiction-books',{added}))
              .catch(err => console.log(err))
          }
      })
    })




// route to ordered
app.route('/ordered')
.post((req,res)=>{
    res.render('ordered')
    Carts.find({})
    .then(data => {
        data.forEach(function(item){
            const order = new Orders({
                title: item.title,
                price: item.price,
                user_id : req.session.user._id,
                user_name : req.session.user.name
            })
            order.save()
            .then(() => {console.log('ADDED')})
            .catch((err) => {console.log(err)})
        })
    })
    .catch(err => {console.log(err)})
})

// route to horror-books
app.route('/horror-books')
.get((req,res)=>{
    res.render('horror-books')
})
.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    if(booktitle == 'the outsider')
     price=422
     else
     price=453
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
            var added= 'Already exits'
            res.render('horror-books',{added})
          }
          else{
            var added= 'Item added'
              const newCart = new Carts({
                  title: booktitle,
                  genre: "horror",
                  price: price
              })
              newCart.save()
              .then(() => res.render('horror-books',{added}))
              .catch(err => console.log(err))
          }
      })
    })




// route to technology-books
app.route('/technology-books')
.get((req,res)=>{
    res.render('technology-books')
})


// add to cart

.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    if(booktitle == 'science and technology')
     price=453
     else
     price=243
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
            var added= 'Already exits'
            res.render('technology-books',{added})
          }
          else{
            var added= 'Item added'
              const newCart = new Carts({
                  title: booktitle,
                  genre: "technology",
                  price: price
              })
              newCart.save()
              .then(() =>  res.render('technology-books',{added}))
              .catch(err => console.log(err))
          }
      })
    })

// route to romance-books
app.route('/romance-books')
.get((req,res)=>{
    res.render('romance-books')
})


// add to cart

.post( (req,res) => {

    const booktitle = req.body.booktitle;
    var price=0
    if(booktitle == 'every breath')
     price=645
     else
     price=647
    
    console.log(booktitle)
    console.log(price)

        Carts.findOne( { title: booktitle })
      .then( valid =>{
          if(valid){
           res.send('Already exits')
          }
          else{
              const newCart = new Carts({
                  title: booktitle,
                  genre: "romance",
                  price: price
              })
              newCart.save()
              .then(() => console.log('saved'))
              .catch(err => console.log(err))
          }
      })
    })

// route to cart

app.route('/cart')
.get((req,res)=>{

    var count=0
    var total=0
   

    Carts.find({}, function (err, allDetails){
        if(err) 
         {console.log(err)}
             else
              { res.render("cart", { details: allDetails,count,total })
         }
    

    })
})






app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/lib', express.static(__dirname + 'public/lib'))

// Routes

//




