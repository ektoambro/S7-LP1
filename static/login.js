document.getElementById('LoginForm')?.addEventListener('submit', (event) => {
        event.preventDefault(); // this prevents the standard action that is taken when certain things happen. 
                                // Forms automatically send stuff to the server when submitted, and redirect to a new page.
                                // We don't want that.

        let form = document.getElementById('LoginForm');
        let formData = new FormData(form);                   // find the form, and transform the data inside of it.

        fetch('/Confirmed', {
            method: 'POST',
            body: formData,
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
              console.log(data.status);
            }
            else {
              console.error(data.message);
            }
        })
        .catch(error => {
            console.error(error);
        })
    });