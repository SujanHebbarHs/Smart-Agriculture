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
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            console.log('add button clicked');
            button.classList.remove('btn-success'); // Remove the success class
            button.classList.add('btn-white-background'); // Add a custom class for white background
            button.innerHTML = "Added to Cart";
            button.setAttribute("disabled", "disabled");
        });
    });
}

const searchBar = document.getElementById('search');
searchBar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = searchBar.querySelector('input').value;
    const searchWord =searchValue.trim().toLowerCase();
    console.log(searchValue);
    const response = await fetch(`/search/${searchWord}`);
    
    if (response.ok) {
        const products = await response.json(); // Parse the response as JSON

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
    }});