require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require('express-session');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

//mongoose
mongoose.connect("mongodb://localhost:27017/userLoginDB", {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {console.log("Database connected")})
    .catch( (err) => {console.log(err)});

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    password: {type:String, required:true}
});

const User = mongoose.model("User", userSchema);

//passport
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err){
                console.log(err); 
            } else {
                if(isMatch) {
                    return done(null, user);
                } else{
                    return done(null, false);
                }
            }
        }); 
      });

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });

      });
    }
));

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/success');      
  }


//routes
app.get("/", forwardAuthenticated, (req, res) => {
    res.render("home");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/")
})

app.get("/success", checkAuthentication, (req, res) => {
    res.render("success");
})
    
app.route("/login")
    .get( (req, res) => {
        res.render("login")
    })
    .post( (req, res, next) => {
        passport.authenticate('local', { successRedirect: '/success', failureRedirect: '/login', failureFlash: false })(req, res, next);
    });

app.route("/register")
    .get( (req, res) => {
        res.render("register")
    })
    .post( (req, res) => {
        const {username, password} = req.body;

        //check for empty fields
        if(!username || !password){ 
            res.render("error");
        } else{
            User.findOne({username: username})
                .then(user => {
                    if(user) {
                        res.render("error");
                    } else{
                        //create new user
                        const newUser = new User({
                            username: username,
                            password: password
                        })

                        //hashing
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(!err){
                                    newUser.password = hash;
                                    //save new user
                                    newUser.save()
                                        .then( (user) => {res.redirect("login")})
                                        .catch( (err) => {console.log(err)});
                                }
                            })
                        })
                    }
                })
        }
    })

app.listen(PORT);