// document.getElementById("productAdd").addEventListener("submit", function (event) {
//   event.preventDefault(); // Prevent the form from submitting

// const { response } = require("express");

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
  try {
    const response = await fetch("/myListings");
    if (response.ok) {
      const myProductsData = await response.json(); // Parse the response as JSON

      myProductsData.forEach(product => {
        const productN = product.name;
        const productName = productN.charAt(0).toUpperCase() + productN.slice(1);
        const category = product.category;
        const pricePerLb = product.price;
        const imgSrc = `/CSS/${product.img}`;
        
        
        let rowCount = 0;
        // Adding data to table
        const table = document.getElementById("listing_data");
        const row = table.insertRow(rowCount++);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2); 
        const cell4 = row.insertCell(3); // Add a new cell for the delete button

        cell1.innerHTML = productName;
        cell2.innerHTML = category;
        cell3.innerHTML = pricePerLb;
        row.setAttribute("data-key", product._id)
        // Delete button functionality
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.id = "deleteButton";
        deleteButton.addEventListener("click",async function () {
          
          const respone = await fetch(`/myListings/${product._id}`, {
            method: "DELETE",
          });
          if (respone.ok) {
            console.log("Deleted");
          } else {
            console.error("Failed to delete");
          }

          row.remove();


        });

        //Appending Cell 4 to the table(delete button)

        cell4.appendChild(deleteButton);

      });
    } else {
      console.error("Failed to fetch data from the server");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

$(document).ready(function () {
  // When the button with id "insertTableData" is clicked, open the modal with id "productModal"
  $('#insertTableData').click(function () {
    $('#productModal').modal('show');
  });
});

document.getElementById("dataSubmit").addEventListener("submit", function (event) {
  // Add your form submission logic here
});
