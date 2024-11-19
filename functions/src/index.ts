import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
// import axios from "axios";
// import validateFirebaseIdToken from "./middlewares/auth.middleware";
// import { CookieOptions } from 'express';
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes'


// Ensure correct path for your service account JSON file
const serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json()); // Add this line to parse JSON bodies
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))


app.use('', userRouter)

export const api = functions.https.onRequest(app);
export {app, db}


// Export the Express app as a Firebase Function
