//console.log("dude2")


document.addEventListener('DOMContentLoaded', () => {



  const loginInfo = document.getElementById("loginInfo");
  const userEmail = document.getElementById("userEmail");
  const logoutButton = document.getElementById("logoutButton");

  /*var token = "NoToken"
  var emailAuth = "NoEmail"

  if (localStorage.getItem('token') != null && localStorage.getItem('email') != null) {
    token = localStorage.getItem('token'); // Retrieve the token from local storage
    emailAuth = localStorage.getItem('email');

  }

  console.log("Logged in Status: " + (token != "NoToken"))
  console.log("Logged in Status 2: " + (emailAuth != "NoEmail"))


  const errorMessage = document.getElementById('error-message');

  if (token != "NoToken" && emailAuth != "NoEmail") {
    // If the UID and email are present, the user is logged in, so show the "Logged in as" text
    loginInfo.style.display = "block";
    userEmail.textContent = "Logged in as " + emailAuth;

    // Show the Logout button
    logoutButton.style.display = "block";

    // Add a click event to the Logout button to clear the session storage
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("email");

        window.location.href = '/';
        // Redirect or perform any other actions you need when logging out
        // Example: window.location.href = '/logout'; 
    });
} else {
    // If the UID and email are not present, hide both the text and the Logout button
    loginInfo.style.display = "none";
    logoutButton.style.display = "none";
}*/


  // Function to handle sign-up

  if (document.getElementById("signupButtonConfirm")) {
    document.getElementById("signupButtonConfirm").addEventListener("click", async (e) => {

      e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      console.log("sign up: " + email + password)

      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();

          alert("Sign up successful")

          alert(data.message);
          // Redirect to /home after successful sign-up
          window.location.href = "/";
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      } catch (error) {
        console.error("Error during sign-up:", error);
        alert(errorData.error);
      }
    });

  }

  // Function to handle login

  /*if (document.getElementById("loginButtonConfirm")) {
    document.getElementById("loginButtonConfirm").addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      console.log("login: email and password are " + email + password)

      try {
        console.log("before signin")
        const response = await fetch("/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        console.log("response======================================")

        console.log(response)

        if (response.ok) {
          console.log("it is ok!")
          const data = await response.json();

          console.log("Data is " + data)


          alert(data.message);

          // Retrieve the token from the response
          var token = data.token;

          var emailLogged = data.emailVerify;

          console.log("token is" + token)

          // Save the token in local storage
          localStorage.setItem('token', token);
          localStorage.setItem('email', emailLogged);

          // Redirect to the logged-in page after successful login
          window.location.href = "/loggedin";

        } else {
          alert("Unfortunately an error occurred");
          const errorData = await response.json();
          //alert(errorData.error);
        }
      } catch (error) {
        alert("Unfortunately, a major error occurred");
        //console.error("Error during login:", error);
      }
    });
  }*/

  // Check if a user is signed in
  /*
if (firebase.auth().currentUser) {
  // Get the ID token for the signed-in user
  firebase.auth().currentUser.getIdToken()
    .then(function(idToken) {
      // You can use the idToken for authentication or send it to your backend
      // For example, you can make an HTTP request to your server and include the ID token
      // in the request headers to authenticate the user on your backend.
      // Here's an example of how to send it to your server via an HTTP POST request using the Fetch API:
      fetch('/your-backend-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + idToken // Include the ID token in the Authorization header
        },
        body: JSON.stringify({  })
      })
      .then(function(response) {
        // Handle the response from your server
      })
      .catch(function(error) {
        // Handle any errors
      });
    })
    .catch(function(error) {
      // Handle the error
    });
} else {
  // User is not signed in, handle this case as needed
}*/




  /*if (document.getElementById("loginButtonConfirm")){
    document.getElementById("loginButtonConfirm").addEventListener("click", async () => {

  e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Sign in with email and password
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in successfully
            const user = userCredential.user;
            console.log('Signed in as:', user.email);
            errorMessage.textContent = '';
        })
        .catch((error) => {
            // Handle sign-in errors
            errorMessage.textContent = error.message;
        });

      });

   
  }*/

  if (document.getElementById("loginButtonConfirm")) {

    document.getElementById("loginButtonConfirm").addEventListener("click", async (e) => {

        e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

        // Sign in the user
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User signed in successfully

                const user = userCredential.user;

                console.log("userCredential.user is" + user)

                // Get the ID token
                user.getIdToken(/* forceRefresh */ true)
                    .then((idToken) => {
                        // Send the ID token to your backend via HTTPS
                        // ...

                        console.log("The idToken created is " + idToken)

                        var tableAddArr = []

                        fetch("/signinwithfirebase", {
                            method: "POST",
                            headers: {
                                'Authorization': 'Bearer ' + idToken, // Include the token here
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
                            });


                    })
                    .catch((error) => {
                        // Handle error
                    });
            })
            .catch((error) => {
                // Handle error
            });

    });


}


});