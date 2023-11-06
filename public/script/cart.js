const minus = document.getElementById('minusButton');
const plus = document.getElementById('plusButton');
const timeNow = document.getElementById('dateTime');
console.log(minus);
console.log(timeNow);
const dateTime =()=>{
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

minus.addEventListener('click', function() {
    console.log('minus button clicked');
    const quantity = document.getElementById('quantity');
    let currentQuantity = parseInt(quantity.value);
    if (currentQuantity > 0) {
        currentQuantity--;
    }
    quantity.value = currentQuantity;
    });

plus.addEventListener('click', function() {
    console.log('plus button clicked');
    const quantity = document.getElementById('quantity');
    let currentQuantity = parseInt(quantity.value);
    currentQuantity++;
    quantity.value = currentQuantity;
    });

    const checkout = document.getElementById('checkout');
    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
    
    checkout.addEventListener('click', function() {
      console.log('checkout button clicked');
      dateTime();
      liveToast.show();
    });
    
