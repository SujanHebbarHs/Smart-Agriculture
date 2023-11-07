(async () => {
    try {
        const response = await fetch("/listings");
        if (response.ok) {
            const products = await response.json(); // Parse the response as JSON

            // if(products.length == 0){
            //     document.getElementById("fruitsCardContainer").innerHTML = "<h3 class='text-center lead'>No products to show</h3>";
            //     document.getElementById("vegetablesCardContainer").innerHTML = "<h3 class='text-center lead'>No products to show</h3>";
            // }

            products.forEach(product => {
                const productN = product.name;
                const productName = productN.charAt(0).toUpperCase() + productN.slice(1);
                const category = product.category;
                const pricePerLb = product.price;
                const imgSrc = `/Images/${product.img}`;
                const productId = product._id;

                // Continue with your code here
                createCard(productName, pricePerLb, imgSrc, category, productId);
                console.log("Product Name:", productName);
            });
        } else {
            console.error("Failed to fetch data from the server");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();

function createCard(name, price, imgSrc, category, productId) {
    const cardTemplate = `
    <div class="col-md-4 mt-3">
        <div class="product-box" data-key="${productId}">
            <img class="card-img-top" src="${imgSrc}" alt="${name}">
            <strong>${name}</strong>
            <span class="card-text">1lb</span>
            <span class="card-text">${category}</span>
            <span class="card-text text-end text">$${price}</span>
            
                <a href="#" class="btn btn-success add-to-cart">
                    <i class="bi bi-cart-fill"></i> Add to Cart
                </a>
            
        </div>
    </div>
`;


    const cardContainerId = category === "Fruits" ? "fruitsCardContainer" : "vegetablesCardContainer";
    const cardContainer = document.getElementById(cardContainerId);

    // Append the card to the appropriate section
    cardContainer.innerHTML += cardTemplate;

    const addButtons = cardContainer.querySelectorAll('.add-to-cart');

    addButtons.forEach((button) => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();

            console.log('add button clicked');
            const toggle = button.innerText.trim();

            if (toggle == "Add to Cart") {

                console.log('inside add button');
                button.classList.remove('btn-success'); // Remove the success class
                button.classList.add('btn-white-background'); // Add a custom class for white background
                button.innerHTML = "Added to Cart";
                let productBox = this.closest(".product-box");
                let productID = productBox.getAttribute("data-key");
                console.log("The id is now: "+productID);

                const resp = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: productID,

                    })
                });
            }

            else if (button.innerHTML === "Added to Cart") {
                button.classList.remove('btn-white-background'); // Remove the success class
                button.classList.add('btn-success'); // Add a custom class for white background
                button.innerHTML = "Add to Cart";
                let productBox = this.closest(".product-box");
                let productID = productBox.getAttribute("data-key");

                const respone = await fetch(`/orders/${productID}`, {
                    method: "DELETE",
                });
            }



        });
    });
}

const searchBar = document.getElementById('search');
searchBar.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("innnside");
    const searchValue = searchBar.querySelector('.search-input').value;
    console.log("The word is: " + searchValue);
    const searchWord = searchValue.trim().toLowerCase();
    const response = await fetch(`/search/${searchWord}`);
    // console.log(response);

    if (response.ok) {
        const products = await response.json();
        console.log(products);

        document.getElementById("fruitsCardContainer").innerHTML = '';
        document.getElementById("vegetablesCardContainer").innerHTML = '';


        products.forEach(product => {
            const productName = product.name;
            const category = product.category;
            const pricePerLb = product.price;
            const imgSrc = `/Images/${product.img}`;
            const productId = product._id;

            // Continue with your code here
            createCard(productName, pricePerLb, imgSrc, category, productId);
            console.log("Product Name:", productName);
        });
    } else {
        console.error("Failed to fetch data from the server");
    }
});