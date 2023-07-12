
const urlParams = new URLSearchParams(window.location.search);
const successParam = urlParams.get('success');

if(successParam === 'true'){
    // alert('Expense saved successfully!');
    Swal.fire({
        title: 'Expense Saved! :)',
        text: 'Your expense has been saved successfully',
        icon: 'success',
        confirmButtonText: 'Cool'
      })
}