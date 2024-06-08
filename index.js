// Import packages
const express = require("express");
const home = require("./routes/home");

const colors = require('colors');

const { google } = require('googleapis');
const { YoutubeTranscript } = require('youtube-transcript');
const path = require('path'); // Import the 'path' module


// Middlewares
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'routes/public')));


// Routes
app.use("/", home);

const API_KEY = process.env.YOUTUBE_API_KEY

// Create a YouTube Data API client
const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
});


// Middleware for parsing POST data (if needed)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//=======================




// This is for client side
require('dotenv').config(); // Load environment variables from .env file

/*if (process.env.NODE_ENV === 'production') {
    console.log = function () {};
  }*/

/*console.log(process.env.FIREBASE_API_KEY)
console.log(process.env.FIREBASE_AUTH_DOMAIN)
console.log(process.env.FIREBASE_PROJECT_ID)
console.log(process.env.FIREBASE_STORAGE_BUCKET)
console.log(process.env.FIREBASE_MESSAGING_SENDER_ID)
console.log(process.env.FIREBASE_APP_ID)
console.log(process.env.FIREBASE_MEASUREMENT_ID)*/

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID // Note: Added measurementId
}



app.get('/clientsideCreds', (req, res) => {
    try {
    res.status(200).json({ firebaseConfig: JSON.stringify(firebaseConfig) });
    //res.status(200).json({ message: 'Sign-in successful', token, emailVerify, pointsTotal });

    } catch (error){
        console.log(error);
    }
});



  



//=======================

const admin = require('firebase-admin');



console.log(process.env.FIREBASE_PROJECT_ID)

// This for the server-side
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};


// Initialize Firebase with the Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Create a Firebase Authentication instance
const auth = admin.auth();

// Initialize Firestore
const db = admin.firestore(); // Add this line to initialize Firestore



function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = today.getDate();

    // Create a string in the format "YYYY-MM-DD"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;

}

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        if (userRecord.uid != null) {

            // Add the user's UID to the "users" collection in Firestore
            const db = admin.firestore();
            const userRef = db.collection('users').doc(userRecord.uid);

            userRef.set({
                email: email,
                password: password,
                totalPoints: 0
            });

            // Create a subcollection called "subcollectionName"
            const subcollectionRef = userRef.collection('dailyRoutePoints');

            // Add a document to the subcollection

            const customDocumentId = getTodayDate();
            await subcollectionRef.doc(customDocumentId).set({
                points: 0,
                tabledata: [
                    

                ]
            });

            /*subcollectionRef.add({
              usernamesub: 'someValue',
            });*/
        }

        res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Endpoint to update Firestore data
/*app.post("/updateData", async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the header

    try {
        const { tableAddArr } = req.body;

        const decodedToken = await admin.auth().verifyCustomToken(token);
        const uid = decodedToken.uid;

        const db = admin.firestore();
        const userRef = db.collection("users").doc(uid);

        const tdydate = getTodayDate();

        // Fetch the existing data array
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingData = userDoc.data().data || [];

        // Find the index of the data item with the specified date
        const index = existingData.findIndex(item => item.date === tdydate);

        if (index !== -1) {
            // Update the "data" field for the specific date
            existingData[index].data.push(tableAddArr);

            // Update the user document with the modified data
            await userRef.update({
                data: existingData,
            });

            res.json({ message: "Data updated successfully" });
        } else {
            res.status(404).json({ error: "Data for the specified date not found" });
        }


        res.json({ message: "Data updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/


// Trial 2, tried to connect client side to backend, but was too into the data updating, might be useful later
/*app.post("/signinwithfirebase", async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the header

    try {
        const { tableAddArr } = req.body;

        const decodedToken = await admin.auth().verifyCustomToken(token);
        const uid = decodedToken.uid;



        const db = admin.firestore();
        const userRef = db.collection("users").doc(uid);

        const tdydate = getTodayDate();

        // Fetch the existing data array
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingData = userDoc.data().data || [];

        // Find the index of the data item with the specified date
        const index = existingData.findIndex(item => item.date === tdydate);

        if (index !== -1) {
            // Update the "data" field for the specific date
            existingData[index].data.push(tableAddArr);

            // Update the user document with the modified data
            await userRef.update({
                data: existingData,
            });

            res.json({ message: "Data updated successfully" });
        } else {
            res.status(404).json({ error: "Data for the specified date not found" });
        }


        res.json({ message: "Data updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/


function autoRetrieveTable() {
    
}



app.post('/signinwithfirebase', async (req, res) => { //Not only verify but retrieve intitial data
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the header

    var dateInsert = req.body.date;

    if (dateInsert == null){
        dateInsert = getTodayDate();
    }

    console.log("================== loop 1" + dateInsert + " ====================")


    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const emailVerify = decodedToken.email;

        console.log("THE GATHERED UID is " + uid)

        //console.log(db.collection('users').doc(uid).get())

        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        console.log("User Doc:", userDoc.data()); // Debugging

        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log(userData)

            const pointsTotal = userData.totalPoints || 0; // Default to 0 if pointsGained field doesn't exist

            //const customDocumentIdDate = getTodayDate();

            const subcollectionQuery = await userDocRef.collection('dailyRoutePoints').get();

            //===============================================

            var tableData = null;

            // Check if the subcollection 'dailyRoutePoints' exists
            if (!subcollectionQuery.empty) {
                // Access the specific subcollection document under 'dailyRoutePoints' using the date
                const subCollectionDoc = await userDocRef.collection('dailyRoutePoints').doc(dateInsert).get();

                if (subCollectionDoc.exists) {
                    const subCollectionData = subCollectionDoc.data();
                    tableData = subCollectionData.tabledata || [];

                    // 'tableData' now contains the array within the 'tabledata' field
                    console.log('tableData:', tableData);

                    res.status(200).json({ message: 'Authentication successful', token, emailVerify, pointsTotal, tableData });
                } else {
                    // Add a document to the subcollection

                    //const customDocumentIdDate2 = getTodayDate();

                    // Subcollection document doesn't exist, so you can initialize it here
                    const initialData = {
                        tabledata: [] // Add your initial data here
                    };
                    await userDocRef.collection('dailyRoutePoints').doc(dateInsert).set(initialData);

                    tableData = [];

                    res.status(200).json({ message: 'Retrieved Table, Authentication successful', token, emailVerify, pointsTotal, tableData });
                }
            } else {
                console.log(error)
                res.status(404).json({ error: 'Subcollection not found' });
            }
            //=================================================

            //res.status(200).json({ message: 'Authentication successful', token, emailVerify, pointsTotal, tableData });
        } else {
            res.status(404).json({ error: 'User document not found' });
        }

        // Optionally, you can check if the user exists in your Firestore database using userRef.get()

        //res.status(200).json({ message: 'Authentication successful' });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Retrieval failed, Authentication failed' });
    }
});


app.post('/updateTable', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const dateInsert = req.body.date;
    const updateInput = req.body.tableAddArrStr;
    const difficultyInput = parseInt(req.body.difficulty, 10);

    console.log("initial difficult input: " + difficultyInput)
    const isDeleteOperation = req.body.isDeleteOperation || false; // Flag for delete operation

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        var pointsTotalUpdated;

        if (userDoc.exists) {
            const userData = userDoc.data();
            const pointsTotal = userData.totalPoints || 0;

            console.log("initial retrieved points: " + pointsTotal)

            //var pointsTotalUpdatedb = pointsTotalUpdated;

            

            if (isDeleteOperation){
               pointsTotalUpdated = pointsTotal - difficultyInput
               console.log("updated points: " + pointsTotalUpdated)
               await userDocRef.update({ totalPoints: pointsTotalUpdated });
            } else {
                pointsTotalUpdated = pointsTotal + difficultyInput
                console.log("updated points: " + pointsTotalUpdated)
                await userDocRef.update({ totalPoints: pointsTotalUpdated });
            }

            const subCollectionRef = userDocRef.collection('dailyRoutePoints').doc(dateInsert);

            const subCollectionDoc = await subCollectionRef.get();
            let tableData = [];

            if (subCollectionDoc.exists) {
                const subCollectionData = subCollectionDoc.data();
                tableData = subCollectionData.tabledata || [];
            } else {
                // Initialize the subcollection document if it doesn't exist
                const initialData = {
                    tabledata: []
                };
                await subCollectionRef.set(initialData);
            }

            if (isDeleteOperation) {
                // Handle delete operation
                const timeToDelete = req.body.time;
                const distractionToDelete = req.body.distraction;

                // Filter the tableData to remove the specified row
                tableData = tableData.filter(row => !(row.includes(timeToDelete) && row.includes(distractionToDelete)));
            } else {
                // Handle add operation
                tableData.push(updateInput);
            }

            // Update the tabledata in the subcollection document
            await subCollectionRef.update({ tabledata: tableData });

            res.status(200).json({
                message: 'Update successful',
                token,
                emailVerify: decodedToken.email,
                pointsTotalUpdated,
                tableData
            });
        } else {
            res.status(404).json({ error: 'User document not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Update failed' });
    }
});







// Endpoint to handle user sign-in and return a JWT token
/*app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRecord = await admin.auth().getUserByEmail(email);
        const token = await admin.auth().createCustomToken(userRecord.uid);
        const emailVerify = userRecord.email;
        const uid = userRecord.uid

        console.log("Token is " + token)
        console.log("uid is " + uid)

        // Fetch the user's Firestore document by uid
        // Initalisation
        const userDoc = await db.collection('users').doc(uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log(userData)
            const pointsTotal = userData.totalPoints || 0; // Default to 0 if pointsGained field doesn't exist

            console.log(pointsTotal)
            console.log("pointsGained is " + pointsTotal);
            res.status(200).json({ message: 'Sign-in successful', token, emailVerify, pointsTotal });
        } else {
            res.status(404).json({ error: 'User document not found' });
        }


    } catch (error) {

        console.log("It failed?")
        res.status(401).json({ error: 'Authentication failed' });
    }
});*/

/*
const currentTime = new Date();
const currentHour = currentTime.getHours();       // 0-23
const currentMinute = currentTime.getMinutes();   // 0-59

// Format the time as a string in 24-hour format
const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
*/




// connection
const port = process.env.PORT || 9002;
app.listen(port, () => console.log(`Listening to port ${port}`));
