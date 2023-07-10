const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const port = 3000;

mongoose.connect(MONGO_URL);

const expenseSchema = new mongoose.Schema({
    monto: Number,
    fecha: Date,
    categoria: String,
    moneda: String,
    nota: String
})

const expense = mongoose.model("expense",expenseSchema);


app.route("/")
.get((req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})
.post((req,res)=>{

    saveExpense(req.body);
    res.redirect('/')
    
})

//Functions

//Save the new expense to the DB
const saveExpense = async (expenseBody) =>{

    const newExpense = await new expense({
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
    
    let results = await expense.find({
        fecha: {$gte: fromDate, $lte: toDate}
    })

}


app.listen(port,()=>{
    console.log(`App Listening on port ${port}`);
})