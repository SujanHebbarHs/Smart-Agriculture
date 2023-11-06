const button = document.getElementById('insertTableData');

(async () => {
    try {
        const response = await fetch("/orders");
        if (response.ok) {
            const products = await response.json(); // Parse the response as JSON

            products.forEach(product => {
                const buyerName = product.buyerName;
                const productName = product.pName;
                const category = product.category;
                const pricePerLb = product.price;
                const totalPrice =product.totalPrice
                const productId = product._id;

                // Continue with your code here
                
            let rowCount=0;
            // Adding data to table
            const table = document.getElementById("listing_data");
            const row = table.insertRow(rowCount++);
            row.setAttribute("data-key", productId);
            
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3); 
            const cell5 = row.insertCell(4); // Add a new cell to approve and reject the order requests

            cell1.innerHTML = buyerName;
            cell2.innerHTML = productName;
            cell3.innerHTML = pricePerLb;
            cell4.innerHTML = totalPrice;
            cell5.innerHTML = `<button id="approveButton" class="btn btn-success" onclick="approveRequest('${productId}')">Approve</button>
            <button id="rejectButton" class="btn btn-danger" onclick="rejectRequest('${productId}')">Reject</button>`;



            });
        } else {
            console.error("Failed to fetch data from the server");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();