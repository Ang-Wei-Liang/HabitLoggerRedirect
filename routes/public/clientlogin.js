// Import the necessary Firebase modules
//import  firebase  from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-SERVICE.js'


/*import firebase from 'firebase/app';
import 'firebase/auth';*/

//const firebase = require('firebase/app');
//require('firebase/auth');

document.addEventListener('DOMContentLoaded', () => {


    /*if (true) {
        console.log = function () {};
    }*/



    const habitLogDate = document.getElementById("habitLogDate");

    function updateDateTime() {
        const currentTime = new Date();
        const formattedDateTime = `${currentTime.toISOString().slice(0, 10)} ${currentTime.toTimeString().slice(0, 8)}`;

        if (document.getElementById('dateTimeDisplay') != null) {
            document.getElementById('dateTimeDisplay').textContent = "Today: " + formattedDateTime;
        }
    }

    // Call the updateDateTime function to initially display the date and time

    updateDateTime();


    // Set an interval to update the date and time every second
    if (document.getElementById('dateTimeDisplay') != null) {
        setInterval(updateDateTime, 1000);
    }

    //sessionStorage.getItem("dateSelect")

    if (sessionStorage.getItem("dateSelect") != getTodayDate()) {
        var dateSelect = sessionStorage.getItem("dateSelect")

    } else {
        var dateSelect = getTodayDate()
    }

    console.log("===================================DATE IS" + dateSelect + " ===================")

    $('#applyDate').on('click', function () {
        // Get the selected date value from the date input
        const selectedDate = $('#updatePublicationDate').val();

        // Do something with the selectedDate, e.g., log it to the console
        console.log('Selected Date:', selectedDate);

        dateSelect = selectedDate;

        // Close the modal if needed
        $('#datePickerModal').modal('hide');

        sessionStorage.setItem("dateSelect", dateSelect);

        window.location.href = '/loggedin'

        //retrieveCurrentTable(token, dateSelect, true)
    });

    var dateInText = convertDateToText(dateSelect);

    function convertDateToText(dateString) {

        // Parse the date string
        const date = new Date(dateString);

        // Format the date as text
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate
    }



    if (habitLogDate != null) {
        habitLogDate.textContent = "of " + dateInText
    }

    console.log("firebase loaded");

    //require('dotenv').config(); // Load environment variables from .env file

    /*const firebaseConfig = {
        apiKey: "AIzaSyAQANNYfNIn90563GO7Z5VP0ajOwJ_C2_0",
        authDomain: "roastme-c7654.firebaseapp.com",
        projectId: "roastme-c7654",
        storageBucket: "roastme-c7654.appspot.com",
        messagingSenderId: "841573246670",
        appId: "1:841573246670:web:9ba6c3e53ab99fd331529f",
        measurementId: "G-W9DSPKVQ0T" // Note: Added measurementId
    };*/

    // Initialize Firebase
    /*const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID // Note: Added measurementId
    };*/

    // Define the Firebase configuration directly in JavaScript
    //const firebaseConfig = JSON.parse('<%= firebaseConfig %>'); // Parse the JSON string


    //============================================================

    console.log("fetching configurations")

    var firebaseConfig = null
    var auth = null

    async function fetchFirebaseConfig() {
        try {
          const response = await fetch('/clientsideCreds');
          if (response.ok) {
            const data = await response.json();
            firebaseConfig = JSON.parse(data.firebaseConfig);
      
            console.log("Completed...");
      
            firebase.initializeApp(firebaseConfig);
      
            auth = firebase.auth();

            console.log("initalisingApp, auth is now " + auth)
      
            // Now you can use the firebaseConfig to initialize Firebase
            // firebase.initializeApp(firebaseConfig);
      
            // console.log('Firebase initialized with configuration:', firebaseConfig);
          } else {
            console.error('Failed to fetch Firebase configuration');
          }
        } catch (error) {
          console.error('An error occurred while fetching Firebase configuration:', error);
        }
      }

    // Call the function to fetch Firebase configuration
    fetchFirebaseConfig();




    //===========================================================
    

    console.log("initalisingApp, auth is now " + auth)
    //firebase.initializeApp(firebaseConfig);

    //const auth = firebase.auth();



    var token = localStorage.getItem('token');
    var emailAuth = localStorage.getItem('email');
    var totalPoints = parseInt(localStorage.getItem('pointsTotal')) || 0;

    if (token && emailAuth) {


        if (window.location.href.includes('loggedin')) {

            console.log("Logged in second page and RETRIEVING... Points: " + totalPoints);

            retrieveCurrentTable(token, dateSelect, false);

            if (document.getElementById("top-right-text")) {
                var textElement = document.getElementById("top-right-text");
                textElement.textContent = "Coins: " + totalPoints;
            }

        } else {


            window.location.href = "/loggedin";



        }
    } else {
        if (window.location.href.includes('loggedin')){
        window.location.href = "/";
        }
    }

    console.log("Logged in Status: " + !!token);
    console.log("Logged in Status 2: " + !!emailAuth);

    const errorMessage = document.getElementById('error-message');
    const loginInfo = document.getElementById("loginInfo");
    const userEmail = document.getElementById("userEmail");
    const logoutButton = document.getElementById("logoutButton");

    if (token && emailAuth) {
        loginInfo.style.display = "block";
        userEmail.textContent = "Logged in as " + emailAuth;

        logoutButton.style.display = "block";
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem('pointsTotal');
            window.location.href = '/';
        });
    } else {
        loginInfo.style.display = "none";
        logoutButton.style.display = "none";
    }

















    if (document.getElementById("loginButtonConfirm")) {
        document.getElementById("loginButtonConfirm").addEventListener("click", async (e) => {

            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            console.log("email is " + email + "and password is " + password)

            // Sign in the user
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // User signed in successfully

                    const user = userCredential.user;

                    console.log("userCredential.user is" + user)

                    // Get the ID token
                    user.getIdToken(/* forceRefresh */ true)
                        .then((idToken) => {
                            // Send the ID token to your backend via HTTPS

                            console.log("The idToken created is " + idToken)

                            //const date = getTodayDate()

                            var tableAddArr = []

                            retrieveCurrentTable(idToken, dateSelect, true)

                        })
                        .catch((error) => {
                            alert("error 1")
                        });
                })
                .catch((error) => {
                    // Handle error
                    alert("error 2: incorrect email/password")
                });

        });

    }


    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are 0-indexed, so add 1
        const day = today.getDate();

        // Create a string in the format "YYYY-MM-DD"
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return formattedDate;

    }

    function getTodayTime() {
        const currentTime = new Date();

        // Format the current time without the date
        const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false });
        return formattedTime;

    }

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

        const deleteButtonCell = document.createElement("td");

        // Create a delete button element
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            // Add code here to handle the delete operation, e.g., remove the row.
            const timeValue = timeCell.textContent;
            const distractionValue = distractionCell.textContent;
            const difficultyValue = difficultyCell.textContent;

            deleteTableRow(token, dateSelect, [], timeValue, distractionValue, difficultyValue);


            newRow.remove();
        });

        // Append the delete button to its cell
        deleteButtonCell.appendChild(deleteButton);

        // Append the delete button cell to the row
        newRow.appendChild(deleteButtonCell);

        // Append the new row to the table body
        tableBody.appendChild(newRow);
    }

    function autoRetrieveCurrentTable() {

    }

    function retrieveCurrentTable(idToken, date, refreshStatus) {

        console.log("Retrieving...")

        fetch("/signinwithfirebase", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + idToken, // Include the token here
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                console.log("points retrieved is " + data.pointsTotal)
                console.log("table retrieved is " + data.tableData)
                //console.log(data.tableData[0])
                //console.log(data.tableData[1])

                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.emailVerify);
                localStorage.setItem('pointsTotal', data.pointsTotal);

                var retrievedTableArr = data.tableData;

                //for (i = 0; i < retrievedTableArr[i].length ; )

                //retrievedTableArr = [["hello world", "john", "c", "d", "f"]["hello world", "john", "c", "d", "f"]["hello world", "john", "c", "d", "f"]]

                //sessionStorage.setItem("dateSelect", date);


                if (refreshStatus) {
                    window.location.href = "/loggedin";
                }

                const tableBody = document.getElementById("tableBody");

                // Clear the table by removing all existing rows
                /*while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }*/

                


                for (const element of retrievedTableArr) {
                    var concatenatedString = element;
                    var tableAddArr = concatenatedString.split('#@');

                    //for (const item of tableAddArr) {
                    const [time, distraction, feeling, action, difficulty] = tableAddArr;





                    addTableRow(time, distraction, feeling, action, difficulty);
                    //}
                }
                
                console.log("Current points should be " + data.pointsTotal)

                if (document.getElementById("top-right-text")) {
                    var textElement = document.getElementById("top-right-text");
                    textElement.textContent = "Coins: " + data.pointsTotal;
                }



                // Redirect to the logged-in page after successful login

                console.log("Retrieved")



                // Handle the response, if needed
            })
            .catch((error) => {
                console.error("Error:", error);


                /*if (window.location.href != '/') {


                    alert("You session has timed out. Please login again")

                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                    localStorage.removeItem('pointsTotal');

                    window.location.href = '/';

                }*/





            });
    }


    function updateCurrentTable(idToken, date, tableAddArrStr, difficulty) {
        fetch("/updateTable", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + idToken, // Include the token here
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, tableAddArrStr, difficulty }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                //console.log("points retrieved is " + data.pointsTotal)
                //console.log("table retrieved is " + data.tableData)

                console.log("New points should be " + data.pointsTotalUpdated)

                if (document.getElementById("top-right-text")) {
                    var textElement = document.getElementById("top-right-text");
                    textElement.textContent = "Coins: " + data.pointsTotalUpdated;
                }

                alert("Update successful")



                // Handle the response, if needed
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    function deleteTableRow(idToken, date, tableAddArrStr, time, distraction, difficulty) {
        // Add a flag for delete operation
        const isDeleteOperation = true;

        fetch("/updateTable", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + idToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, tableAddArrStr, time, distraction, isDeleteOperation, difficulty }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                alert("Delete successful");
                // Handle the response, if needed

                console.log("New points should be " + data.pointsTotalUpdated)

                if (document.getElementById("top-right-text")) {
                    var textElement = document.getElementById("top-right-text");
                    textElement.textContent = "Coins: " + data.pointsTotalUpdated;
                }

            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }


    if (document.getElementById("submitTableFields")) {
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

            //const date = getTodayDate();

            // Format the current time
            const formattedTime = getTodayTime();

            console.log("UPDATE TIME is " + formattedTime)

            var tableAddArr = [formattedTime, distraction, feeling, action, difficulty]

            var tableAddArrStr = tableAddArr.join("#@");

            // Send a POST request to the server-side endpoint

            updateCurrentTable(token, dateSelect, tableAddArrStr, difficulty)

            /*fetch("/updateData", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + tokenForTable, // Include the token here
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ tableAddArr }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    // Handle the response, if needed
                })
                .catch((error) => {
                    console.error("Error:", error);
                });*/

            // Clear the form inputs

            // Add a new row to the table
            addTableRow(formattedTime, distraction, feeling, action, difficulty);

            var tableAddArr = [formattedTime, distraction, feeling, action, difficulty]

            document.getElementById("distractionInput").value = "";
            document.getElementById("feelingInput").value = "";
            document.getElementById("actionInput").value = "";

            $("#recordModal").modal("hide");
        });

    }





















    //const firebase = require('firebase/app');
    // firebase = require('https://www.gstatic.com/firebasejs/10.5.2/firebase-SERVICE.js')
    //require('firebase/auth');

    // Initialize Firebase

    /*if (idToken != null){
    
    } else {
        idToken = "Not defined"
    }*/

});