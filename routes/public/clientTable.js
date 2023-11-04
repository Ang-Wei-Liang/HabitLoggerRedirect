
document.addEventListener('DOMContentLoaded', () => {

    var token = localStorage.getItem('token');
    var emailAuth = localStorage.getItem('email');
    var totalPoints = localStorage.getItem('pointsTotal');

    var tokenForTable = token;


    function addTableRow(time, distraction, feeling, action, difficulty) {
        const tableBody = document.getElementById("tableBody");
    
        // Create a new row
        const newRow = document.createElement("tr");
    
        // Create and append table data cells for each column
        const timeCell = document.createElement("td");
        timeCell.textContent = time;
        newRow.appendChild(timeCell);
    
        const distractionCell = document.createElement("td");
        distractionCell.textContent = distraction;
        newRow.appendChild(distractionCell);
    
        const feelingCell = document.createElement("td");
        feelingCell.textContent = feeling;
        newRow.appendChild(feelingCell);
    
        const actionCell = document.createElement("td");
        actionCell.textContent = action;
        newRow.appendChild(actionCell);
    
        const difficultyCell = document.createElement("td");
        difficultyCell.textContent = difficulty;
        newRow.appendChild(difficultyCell);
    
        // Create a delete button cell

        
        const deleteButtonCell = document.createElement("td");
    
        // Create a delete button element
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            // Add code here to handle the delete operation, e.g., remove the row.
            newRow.remove();
        });
    
        // Append the delete button to its cell
        deleteButtonCell.appendChild(deleteButton);
    
        // Append the delete button cell to the row
        newRow.appendChild(deleteButtonCell);
    
        // Append the new row to the table body
        tableBody.appendChild(newRow);
    }

    var tableFields = document.getElementById("submitTableFields");

    // Event listener for form submission
    tableFields.addEventListener("click", async (e) => {
        e.preventDefault();

        console.log("Submitted fields!")

        // Retrieve input values
        const distraction = document.getElementById("distractionInput").value;
        const feeling = document.getElementById("feelingInput").value;
        const action = document.getElementById("actionInput").value;
        const difficulty = document.getElementById("difficultyInput").value;
        const currentTime = new Date(); // Get current time

        // Format the current time
        const formattedTime = `${currentTime.toISOString().slice(0, 10)} ${currentTime.toTimeString().slice(0, 8)}`;

        // Add a new row to the table
        addTableRow(formattedTime, distraction, feeling, action, difficulty);

        var tableAddArr = [formattedTime, distraction, feeling, action, difficulty]

        var tableAddArrStr = tableAddArr.join('#');



        // Send a POST request to the server-side endpoint
        fetch("/updateData", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + tokenForTable, // Include the token here
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({ tableAddArrStr }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle the response, if needed
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        // Clear the form inputs
        document.getElementById("distractionInput").value = "";
        document.getElementById("feelingInput").value = "";
        document.getElementById("actionInput").value = "";
        $("#recordModal").modal("hide");
    });


});