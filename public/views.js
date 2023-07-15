const ctx = document.getElementById('myChart');
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
        }else {
            throw new Error('Response not OK');
        }
    } catch (error){
        console.log(error);
    }
})


/**
 * Crear una función a la cual pasarle la data y que cree un chart, necesitaría pasar las categorías al valor labels y los resultados despues
 * De la data debería primero recorrer el array para ver cuantas categorías hubieron ese tiempo para asi crear las labels
 * Luego sumar el valor de cada gasto con X label y pasar como resultado final las sumas al chart
 */