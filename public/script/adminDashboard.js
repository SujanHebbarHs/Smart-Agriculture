// document.getElementById("productAdd").addEventListener("submit", function (event) {
//   event.preventDefault(); // Prevent the form from submitting

//   // Get the values from the input fields inside the submit event handler
//   const productName = document.getElementById('productName').value;
//   const category = document.getElementById('category').value;
//   const pricePerLb = document.getElementById('pricePerLb').value;

//   console.log("Product Name:", productName);
//   console.log("Category:", category);
//   console.log("Price Per Lb:", pricePerLb);
//   rowCount = 0;
//   if (productName && category && pricePerLb) {
//     const table = document.getElementById("listing_data");
//     const row = table.insertRow(rowCount++);
//     const cell1 = row.insertCell(0);
//     const cell2 = row.insertCell(1);
//     const cell3 = row.insertCell(2);
//     const cell4 = row.insertCell(3); // Add a new cell for the delete button

//     cell1.innerHTML = productName;
//     cell2.innerHTML = category;
//     cell3.innerHTML = pricePerLb;

//     // Create a delete button and attach a click event to delete the row
//     const deleteButton = document.createElement("button");
//     deleteButton.innerHTML = "Delete";
//     deleteButton.className = "btn btn-danger";
//     deleteButton.id = "deleteButton";

//     deleteButton.addEventListener("click", function () {
//       row.remove();
//     });

//     cell4.appendChild(deleteButton);

//     // Clear the form inputs after adding the product
//     document.getElementById('productName').value = '';
//     document.getElementById('category').value = '';
//     document.getElementById('pricePerLb').value = '';
//   }
// });

(async () => {
  const myProducts = await fetch("/mylistings");
  console.log(products);


  myProducts.forEach(product => {

    const productName = product.name;
    const category = product.category;
    const pricePerLb = product.price;
    const imgSrc = `/CSS/${product.img}`;

    // Continue code

  });
 
})();

$(document).ready(function () {
  // When the button with id "insertTableData" is clicked, open the modal with id "productModal"
  $('#insertTableData').click(function () {
    $('#productModal').modal('show');
  });
});
