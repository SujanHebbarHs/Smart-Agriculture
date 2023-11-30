const dateTime = () => {
    // Create a new Date object representing the current date and time
    const currentDate = new Date();

    // Get the current time components
    const hr = currentDate.getHours(); // Get the current hour (0 to 23)
    const min = currentDate.getMinutes(); // Get the current minutes (0 to 59)


    // Create a formatted time string
    const currentTime = `${hr}:${min}`;
    timeNow.innerHTML = currentTime;
    console.log(currentTime); // Output the current time in HH:MM:SS format
}

const timeNow = document.getElementById('dateTime');
const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
const paymentButton = document.getElementById("paymentButton");

paymentButton.addEventListener("submit", async function(e) {

    e.preventDefault();

    let pass = false

        // Get current year and month
        let currentYearFull = new Date().getFullYear();
        let currentMonth = new Date().getMonth() + 1;

        let currentYear = currentYearFull % 100;

        // Get entered expiration year and month
        let enteredYear = parseInt(document.getElementById('expirationYear').value);
        let enteredMonth = parseInt(document.getElementById('expirationMonth').value);

        // Get the expiration error element
        let expirationError = document.getElementById('expirationError');

        // Check if the entered year is less than the current year
        if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
            expirationError.textContent = "Card is expired. Please use another card.";
            pass= false;
        } else {
            expirationError.textContent = ""; // Clear the error message if the year is valid
            pass = true;
        }

        // If everything is valid, you can proceed with form submission or other actions

        if(pass === true){

            const response = await fetch("/payment", {
                method:"POST"
            });
        
            if(response.ok){
        
                dateTime();
                liveToast.show();
        
                setTimeout(()=>{
                    window.location.href = "/home";
                },2000);
        
            }

        }
        
})
