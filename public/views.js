const ctx = document.getElementById('myChart');
const totalAmount = document.getElementById('totalAmount');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const submitDate = document.getElementById('submitDate');

submitDate.addEventListener('click', async (e) => {
    try{
        console.log(fromDate.value);
        console.log(toDate.value);
        const response = await fetch('/views', { 
            method : 'POST',
            body: JSON.stringify({
                'fromDate' : fromDate.value,
                'toDate' : toDate.value
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        });
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            createView(data);
        }else {
            throw new Error('Response not OK');
        }
    } catch (error){
        console.log(error);
    }
})

const createView = (dataDB) => {

    const categories = [];
    const amounts = [];
    let total = 0;

    dataDB.forEach(expense =>{
        if(!categories.includes(expense.categoria)){
            categories.push(expense.categoria);
        }
        total += expense.monto;
    })
    console.log(categories);
    dataDB.forEach(expense =>{
        const index = categories.indexOf(expense.categoria);
        console.log(index);

        if(amounts.length === 0 || amounts[index] === undefined){
            amounts.push(expense.monto);
        }else if(amounts[index] !== undefined){
            amounts[index] = amounts[index] + expense.monto;
        }
    })

    if(categories.length === amounts.length){
        console.log('Los arrays coinciden');
    }else{
        console.error('Los arrays NO coinciden')
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [{
            label: 'Gastos',
            data: amounts,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    totalAmount.innerHTML = `Total ${total}`;
    Object.assign(totalAmount.style,{"font-size": "100px","border-style": "solid","padding-left": "10px","padding-right": "10px"})
    
}

