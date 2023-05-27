const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/**
 * If (Categoria === "Super" || "Auto"){
 *      Sub dividir gasto para saber en que especificamente
 *         [alcohol,comida,limpieza],[peaje,nafta,mecanico,patente]
 * } 
 */

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
    moneda: String
})

const expense = mongoose.model("expense",expenseSchema);




app.route("/")
.get((req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

.post((req,res)=>{

    saveExpense(req.body);
    res.send("Expense saved");
    
})

const saveExpense = async (expenseBody) =>{

    const newExpense = await new expense({
        monto: parseFloat(expenseBody.monto),
        fecha: expenseBody.fecha,
        formaPago: expenseBody.formaPago,
        categoria: expenseBody.categoria,
        moneda: expenseBody.moneda
    });

    await newExpense.save();
}



app.listen(port,()=>{
    console.log(`App Listening on port ${port}`);
})