import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes'


const serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(express.json()); 
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))


app.use('', userRouter)

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
export {app, db}


