(async () => {

    try {

        const response = await fetch("/allUsers");

        if (response.ok) {

            const users = await response.json();
            let rowCount = 0;

            users.forEach(user => {
                const name = user.name;
                const email = user.email;
                const role = user.role;
                const userId = user._id;


                // Adding data to table
                const table = document.getElementById("listing_users");
                const row = table.insertRow(rowCount++);
                row.setAttribute("data-key", userId);

                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4);


                cell1.innerHTML = rowCount;
                cell2.innerHTML = name;
                cell3.innerHTML = email;
                cell4.innerHTML = role;
                cell5.innerHTML = `<button id="deleteUserButton" class="btn btn-danger deleteUser">Remove user</button>`;

            });

        }
        else {
            console.log("Failed to fetch data from server");
        }

        const deleteButtons = document.querySelectorAll(".deleteUser");

        deleteButtons.forEach((deleteButton) => {

            deleteButton.addEventListener('click', async function (event) {

                event.preventDefault();
                console.log("inside");

                const row = this.closest("tr");
                const key = row.getAttribute("data-key");
                console.log("Thekey is: " + key)

                const revokedUser = await fetch(`/removedUsersList`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: key })

                });

                if (revokedUser.ok) {

                    const resp = await fetch(`/adminDeleteUser/${key}`, {
                        method: "DELETE"
                    });

                    console.log("User Removed");
                    row.remove();

                    const table = document.getElementById("listing_users");
                    const rows = table.getElementsByTagName("tr");

                    // Update the serial numbers in the first column
                    for (let i = 0; i < rows.length; i++) {
                        rows[i].getElementsByTagName("td")[0].innerHTML = i + 1;
                    }
                }
            });

        });


    } catch (err) {
        console.log(err);
    }

})();