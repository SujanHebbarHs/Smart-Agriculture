let cardCount = 0;  // Keep track of the number of cards

(async () => {
    const products = await fetch("/listings");
    console.log(products);

    products.forEach(product => {
        
        const productName = product.name;
        const category = product.category;
        const pricePerLb = product.price;
        const imgSrc = `/CSS/${product.img}`;

        //Continue code

    });
   
})();

function createCard(name, price) {
    const cardTemplate = `
        <div class=" col-md-4 mt-3">
            <div class="product-box">
                <img class="card-img-top" src="/images/fruits.jpg" alt="Fruits">
                <strong>${name}</strong>
                <span class="card-text">1lb</span>
                <span class="card-text text-end">$${price}</span>
                <a href="Shopping Cart HTML.html" class="btn btn-success">
                    <i class="bi bi-cart-fill"></i> Add to Cart
                </a>
            </div>
        </div>
    `;

    const cardContainer = document.getElementById("cardContainer");

    // Check if we need to start a new row
    if (cardCount % 3 === 0) {
        // Create a new row container
        const newRow = document.createElement("div");
        newRow.className = "row justify-content-center";
        cardContainer.appendChild(newRow);
    }

    // Append the card to the last row in the container
    const lastRow = cardContainer.lastChild;
    lastRow.innerHTML += cardTemplate;

    cardCount++;  // Increment the card count
}
