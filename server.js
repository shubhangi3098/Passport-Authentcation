const express = require('express')
const ejs=require('ejs')
const passport = require('passport')
const session =require('express-session')
const app=express();

const {connectMongoose, User} =require("./database.js");
const {initializingPassport} =require('./passportConfig.js')


connectMongoose();

initializingPassport(passport);


app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine",'ejs');


app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",async (req,res)=>{
 const user = await User.findOne({username : req.body.username});
 if(user) return res.status(400).send("User already Exist");

 const newUser = await User.create(req.body);

res.status(201).render("login")
})

app.post("/login",
passport.authenticate("local",{ failureRedirect:"/register"}) ,(req,res)=>{
    
        res.render("Welcome");
        
    
})



app.listen(3000,()=>{
    console.log("listening on port 3000");
})