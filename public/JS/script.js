
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


 // Report btn scripts
 document.querySelector('.report-btn').addEventListener('click', function() {
  const reportContainer = document.querySelector('.report-container');
  reportContainer.classList.add('show');
});

document.querySelector('.close-btn').addEventListener('click', function() {
  const reportContainer = document.querySelector('.report-container');
  reportContainer.classList.remove('show');
});




