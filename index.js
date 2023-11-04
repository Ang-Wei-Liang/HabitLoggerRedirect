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



/*const firebaseConfig = {
    apiKey: "AIzaSyAQANNYfNIn90563GO7Z5VP0ajOwJ_C2_0",
    authDomain: "roastme-c7654.firebaseapp.com",
    projectId: "roastme-c7654",
    storageBucket: "roastme-c7654.appspot.com",
    messagingSenderId: "841573246670",
    appId: "1:841573246670:web:9ba6c3e53ab99fd331529f",
    measurementId: "G-W9DSPKVQ0T" // Note: Added measurementId
};*/

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

/*
const serviceAccount = {
        "type": "service_account",
        "project_id": "roastme-c7654",
        "private_key_id": "68e716b30d11dc7858bc31d795dfc5d5a556e2f0",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5bVCoPVZ5ie3+\n1Om39Q+j6xnfHY+LO6bJh5AySZ6YByxj2+IjdoJoUztv3YnmL+htxG9cinGucUdz\nLhhOBe8xMvppU0jTtUmaG9GyzLTq81uQgY9hOalTZYNF6MQyYimll9UVDiK07Cpa\nJPxBX5ht/Yf43xCAWccYsqG7+PaoUBeNPEgaeUv23GJ2RD0iRrVxkF5KJZFo1VT6\nxuuDyXmysu3WznupdeVMLv+NthM0h5CCeHzzGXa7qDSrJw2NU5UqNWLac9K8Sj9E\nZJklBdUpa7caSjpTdfrYoUzsoTrIwN0mGbpcJYjgxIRHqD5qKBljcOnrenhieGlZ\ndYJZJk2pAgMBAAECggEAAVTKE/MgyE2XslEn/mSZgKVC8cmeCrNabq709490voWq\nqWreND/5DrOuRQ7Tmx3z7rnOzNzHlSeGCksl7IV5YqKJjrEE4FQ4W41gk4aJs/gc\nS6zKcTm/P/SGHT3fDreKsgAljPmlgSQC59PFJdkAWKXN0JkVXr6GQeSiaZ2Pc8Tg\nRGnDaz/h0wlKmzJ9DcNJOmtGZ+ToPY0vBN7Y+K5TmbZJTszu58kZUv/iNuWyvxpS\nJmzZ3ODmErs6bybsWFHjahUW2vRxDj3CEUiRp4F/pdriVaZCIXwAWpVFjTBEPW9F\nbhQrGP+Y3iSxwwcawdPIGfHxGbXe6QPkt3wi2w33owKBgQD9XZY4gY7cS+A2ItEg\nrj2DivbNSck04gb3sLQU6gapo9jS4tu6W+M3iDuswNPRLuSDnjuU53vN/ciHQ1Tl\nIxivpxRlUlugLGM5e83y0k/PGVJJC9tZgJ4dfnQLZQv17Sd5TwJbvD2Ix11138qr\nwHgruFbvk8seJXVQ10bw7Cu8BwKBgQC7WuNdH/YYHKOt1BQHXlvnP0loGgkKY8C5\nNo76xJU6IwublfWittq2auBvfCHW8TJIm98qB2SOAonkJyZ+y39Tb8+uVzxf5Sff\n8iNVe7Uftx8KMgVxJpAhl1Ho3NWDDEpL+zh2vxYMwTlnPtvJHDMYh3B3IZAAQGIv\n+Jqot+OczwKBgG6WM6Q0QGO9Jn7akYb/JlBNDk4qP406fqoL0X4za3cN0eyyIg/k\nXXd2mf1cKNfr7MfZ/82NgAc4Fxea9uoQeIzqk0dqPB3cYe7ML+cljropJjZF25bk\nQZ9D+2ih0SelPI6BQtlBf2Y9BnkVlgODPbBvhFqLmqNs3BjN7ePoYWpvAoGAB1AO\n282pj1te0CQc/ASk1avUs6mAfNVT6mbEwej2YiSICXSa99TnSIN3ayKPN5KGgesD\nlOJg/GIA+9TDXeOXfqw4kPd6tct9+PG8i1OeyDQflAhLyhTVP1pmqg4kj07lf324\nwHnI5IqOMQd1EK53GBgBPcUjl77rli+/6aHz0mUCgYAyuAPzmCKInbB67Z42Uu0J\n1VSl4Q4yyD5JBdiYPDustV3kVFUcOU1wLvTjJieU1dMnNoCdLW0UEuCL2RgZs0G7\nE8G1NZpnWyANomWbeW+dONOThqk6mMHu+FfN9hDAE+LKb/1/rNdBcleRTTKcdbxm\nNL+nC08oMHUsmSUwyQcOKw==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-ow3h3@roastme-c7654.iam.gserviceaccount.com",
        "client_id": "101064460173086839459",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ow3h3%40roastme-c7654.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }*/

//const serviceAccount = require(firebaseCredentials);

//const serviceAccount = require('./roastme-c7654-firebase-adminsdk-ow3h3-68e716b30d.json'); // Your Firebase Admin SDK configuration

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
