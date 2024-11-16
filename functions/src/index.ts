// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import express from 'express';
// import cors from 'cors';

const app = express()

//Routes
app.get('/hello-world' , (req, res) => {
    return res.status(200).send("Hello World");
})


//Create
//post


//Read
//get

//Update
//put

//Delete
//delete




// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
