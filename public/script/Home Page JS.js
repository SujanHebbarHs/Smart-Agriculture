(async () => {
    try {
        const response = await fetch("/listings");
        if (response.ok) {
            const products = await response.json(); // Parse the response as JSON

            products.forEach(product => {
                const productName = product.name;
                const category = product.category;
                const pricePerLb = product.price;
                const imgSrc = `/Images/${product.img}`;

                // Continue with your code here
                createCard(productName, pricePerLb, imgSrc, category);
                console.log("Product Name:", productName);
            });
        } else {
            console.error("Failed to fetch data from the server");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();

function createCard(name, price, imgSrc, category) {
    const cardTemplate = `
        <div class="col-md-4 mt-3">
            <div class="product-box">
                <img class="card-img-top" src="${imgSrc}" alt="${name}">
                <strong>${name}</strong>
                <span class="card-text">1lb</span>
                <span class="card-text ">${category}</span>
                <span class="card-text text-end text">$${price}</span>
                <a href="Shopping Cart HTML.html" class="btn btn-success">
                    <i class="bi bi-cart-fill"></i> Add to Cart
                </a>
            </div>
        </div>
    `;

    const cardContainerId = category === "Fruits" ? "fruitsCardContainer" : "vegetablesCardContainer";
    const cardContainer = document.getElementById(cardContainerId);

    // Append the card to the appropriate section
    cardContainer.innerHTML += cardTemplate;
}
