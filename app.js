const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
require('dotenv').config();

// const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL = process.env.MONGO_URL_LOCAL;

const app = express();
app.set('view engine','ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect(MONGO_URL);

CATEGORIES = [];

//Expense Schema

const expenseSchema = new mongoose.Schema({
    monto: Number,
    fecha: Date,
    categoria: String,
    moneda: String,
    nota: String
})

const Expense = mongoose.model("expense",expenseSchema);

//User Schema

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    categorias : Array
});

const User = mongoose.model("user",userSchema);


//ROUTES

app.route("/")
.get((req,res)=>{
    ifLogged(req,res,'expenses','/',CATEGORIES);
})
.post(async (req,res)=>{
    const usernameBody = req.body.username;
    const passwordBody = req.body.password;

    const userTrue = await findUser(usernameBody,passwordBody);
    if(userTrue){
        req.session.logged_in = true;
        res.render('expenses',{options:CATEGORIES})
    }else{
        res.redirect('/');
    }
})

app.route("/expenses")
.get((req,res)=>{
    ifLogged(req,res,'expenses','/',CATEGORIES);
})
.post((req,res)=>{
    saveExpense(req.body);
    res.redirect('expenses?success=true');
})

app.route("/views")
.get((req,res)=>{
    ifLogged(req,res,'views','/');
    
})
.post(async (req,res)=>{
    try{
        const fromDate = req.body.fromDate;
        const toDate = req.body.toDate;
        const monthResults = await monthlyView(fromDate,toDate);
        
        res.send(monthResults);

    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }


})

app.route("/register")
.get((req,res)=>{
    res.sendFile(`${__dirname}/public/register.html`);
})
.post((req,res)=>{
    const newUser = new User({
        username : req.body.username,
        password : req.body.password
    })

    newUser.save()
    res.redirect("/");
})

app.route("/settings")
.get((req,res)=>{
    ifLogged(req,res,'settings','/',CATEGORIES);;
})

app.route("/logout")
.get((req,res)=>{
    req.session.destroy((err) => {
        if(err){
            console.error(`Error clearing session: ${err}`);
        }
        return res.render('logout');
    })
})

//FUNCTIONS====================================

//Save the new expense to the DB
const saveExpense = async (expenseBody) =>{

    const newExpense = await new Expense({
        monto: parseFloat(expenseBody.monto),
        fecha: expenseBody.fecha,
        formaPago: expenseBody.formaPago,
        categoria: expenseBody.categoria,
        moneda: expenseBody.moneda,
        nota: expenseBody.nota
    });

    await newExpense.save();
}

//Look for the expenses on a range of time
const monthlyView = async (fromDate, toDate) =>{
    
    let results = await Expense.find({
        fecha: {$gte: fromDate, $lte: toDate}
    })
    return results;

}

const findUser = async (user,pass) =>{
    const userFound = await User.findOne({
        username : user
    })

    if(userFound){
        if(userFound.password === pass){
            CATEGORIES = userFound.categorias;
            console.log(CATEGORIES);
            return true;
        }else{
            return false;
        }
    }else{
        return false
    }
}

const ifLogged = (request,response,route,fallbackRoute,sendOptions) =>{
    if(request.session.logged_in){;
        response.render(route,{options:sendOptions})
    }else{
        if(fallbackRoute === '/'){
            response.render('login');
        }else{
            response.render(fallbackRoute);
        }
        
    }
}


app.listen(port,()=>{
    console.log(`App Listening on port ${port}`);
})

/**
 * TODO LIST =======================
 * 
 * Chance to add payment methods and expense categories on "settings",
 * and save those on the User object in Mongo.
 * 
 * Chance to add a limit on the every category, so if you're close to the limit you will receive an email.
 * 
 * Password security
 * 
 * Add an alert when logging fail like "wrong user/pass"
 * 
 */