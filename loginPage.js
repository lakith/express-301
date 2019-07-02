// https://github.com/coreybutler/nvm-windows/releases
const path = require('path');
const cookieParser = require('cookie-parser');

const express = require("express");
const app = express();


const helmet = require('helmet');
app.use(helmet());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));

let validateUser = (req,res,next) => {
    res.locals.validated = true;
    next();
};

app.use(validateUser);

app.use((req,res,next) => {
    if(req.query.msg === 'fail') {
        res.locals.msg = `Sorry This Username Password Combination does not exist.`
    } else {
        res.locals.msg=``;
    }
    next();
});


app.get("/",(req,res,next)=> {
    res.json("Test");
});

app.get("/login",(req,res,next)=> {
    res.render("login");
});

app.param('storyId',(req,res,next,id) => {
    //validation can be done here.
    console.log("params called - "+id);
    next();
});

app.get("/story/:storyId",(req,res,next)=> {
        res.send(`<h1>Story ${req.params.storyId}</h1>`)
});


app.post("/process_login",(req,res,next)=>{
    const password = req.body.password;
    const username = req.body.username

    if(password === "password"){
        res.cookie("username",username);
        res.redirect("/welcome")
    } else {
        res.redirect("/login?msg=fail&test=hello")
    }
});

app.get('/statement',(req,res,next) => {
    //res.sendFile() - This will display the file if the browser can view it. 
    //re.download() - THis will force the browser to download the file.


    // hand off the file to the right user
    // res.download - takes 3 args:
    // 1. path
    // 2. what you want to call the file when the user gets it (optional)
    // 3. callback (which accepts an error)

    res.download(path.join(__dirname,"userStatement/bank-statement-translation.jpg"),'My-Statement.png',(err)=>{
        if(err) console.log(err);
    });

    // sendFile will load in the browser!
    // res.sendFile(path.join(__dirname, 'userStatements/bank-statement-translation.jpg'),'My-Statement.png.png')
    // res.attachment takes 1 arg:
    // 1. filename.
    // all attachment does it set up the headers. It wont actually send the file.
    // res.attachment(path.join(__dirname, 'userStatements/BankStatementChequing.png'))

})


app.get("/welcome",(req,res,next) =>{
    res.render("welcome",{
        username: req.cookies.username
    });
});

app.get('/logout',(req,res,next) => {
    res.clearCookie('username');
    res.redirect("/login");
});

app.listen(3000,()=>{
    console.log("Server Started On Port 3000")
});


