const minus = document.getElementById('minusButton');
const plus = document.getElementById('plusButton');
const timeNow = document.getElementById('dateTime');
console.log(minus);
console.log(timeNow);

(async () => {
    try {
        const response = await fetch("/orders");
        if (response.ok) {
            const orders = await response.json(); // Parse the response as JSON

            orders.forEach(order => {
                if(product.status === "Pending"){
                    const productId = order.productId;
                    const productName = order.pName;
                    const category = order.category;
                    const pricePerLb = order.price;
                    const imgSrc = `/Images/${product.img}`;
                    
    
                    // Continue with your code here
                    createCard(productName, pricePerLb, imgSrc, category, productId);
                    console.log("Product Name:", productName);
                }

                

            });
        } else {
            console.error("Failed to fetch data from the server");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();

const cardTemplate = `
                <tr>
                    <th scope="row" class="border-0">
                      <div class="p-2">
                        <img src="" alt="" width="70"
                          class="img-fluid rounded shadow-sm">
                        <div class="ml-3 d-inline-block align-middle">
                          <h5 class="mb-0"> <a href="#" class="text-dark d-inline-block align-middle" id="productName"
                              name="productName">${{productName}}</a></h5>
                              <span class="text-muted font-weight-normal font-italic d-block" id="category" name="category">Category: ${{category}}</span>
                        </div>
                      </div>
                    </th>
                    <td class="border-0 align-middle" id="price" name="price"><strong>$${{price}}</strong></td>
                    <td class="border-0 align-middle">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          
                           <button class="btn btn-light" id="minusButton"><i class="bi bi-dash"></i></button>
                          
                        </div>
                        <input type="text" class="numeric-input px-2" id="quantity" value="0" placeholder="0" pattern="[0-9]*"
                          style="width: 50px; border: 1px solid black; border-radius: 4px;">
                        <div class="input-group-append">
                          
                            <button class="btn btn-light" id="plusButton"><i class="bi bi-plus"></i></button>
                    </td>
                    <td class="border-0 align-middle"><button href="#" class="btn btn-danger"><i
                          class="bi bi-trash "></i></button></td>
                  </tr>
`;


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
    