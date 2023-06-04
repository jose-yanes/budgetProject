const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/budget");

const expenseSchema = new mongoose.Schema({
    monto: Number,
    fecha: Date,
    formaPago: String,
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
    res.sendFile(`${__dirname}/savedexpense.html`);
    
})

app.route("/budget")
.get((req,res)=>{
    res.sendFile(`${__dirname}/budget.html`);
})
.post((req,res)=>{
    console.log(`From Date ${req.body.fromDate}`);
    console.log(`To Date ${req.body.toDate}`);

    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;

    monthlyView(fromDate,toDate);

    res.send('Done :)');
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

    console.log(newExpense.fecha.getDate());
    console.log(newExpense.fecha.getMonth());
    console.log(newExpense.fecha.getFullYear());

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