import { db } from "..";
import axios from "axios";
import { CookieOptions } from "express";

const testServer = (req: any, res: any) => {
  return res.status(200).send(req.user);
};

const registerUser = async (req: any, res: any) => {
  const usersCollection = db.collection("users");

  try {
    const querySnapshot = await usersCollection
      .where("email", "==", req.body.email)
      .get();
    if (querySnapshot.empty) {
      console.log("No user found with this email.");
    } else {
      console.log("User exists with this email.");
      return res.status(400).send("USER ALREADY EXISTS");
    }
  } catch (error) {
    console.error("Error checking user by email:", error);
    return res.status(500).send("ERROR" + error); // In case of any errors
  }

  try {
    // Use the correct sign-up endpoint for Firebase
    const registerResponse = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBULcEW64tKAYxYXkLNcznKDW8zsaYaKCQ",
      {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true, // Ensure this is true if you want a secure token back
      }
    );

    let idToken = registerResponse.data.idToken;
    let refreshToken = registerResponse.data.refreshToken;

    await db.collection("users").doc(registerResponse.data.localId).set({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      refreshToken: refreshToken,
      notes: [],
    });

    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "none", // Necessary for cross-origin requests
    };

    // Send the response data back to the client
    return res
      .status(200)
      .cookie("__session", idToken, options)
      .send({ message: "User registered successfully." });
  } catch (err: any) {
    // Log the error in more detail for better debugging
    console.error(
      "Error during registration:",
      err.response ? err.response.data : err.message
    );
    return res
      .status(500)
      .send(
        `Error during registration: ${
          err.response ? err.response.data : err.message
        }`
      );
  }
};

const loginUser = async (req: any, res: any) => {
  const usersCollection = db.collection("users");

  try {
    const querySnapshot = await usersCollection
      .where("email", "==", req.body.email)
      .get();
    if (querySnapshot.empty) {
      console.log("No user found with this email.");
      return res.status(404).send("NO USER FOUND");
    }
  } catch (error) {
    console.error("Error checking user by email:", error);
    return res.status(500).send("ERROR" + error); // In case of any errors
  }

  try {
    const loginResponse = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBULcEW64tKAYxYXkLNcznKDW8zsaYaKCQ",
      {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true,
      }
    );

    let idToken = loginResponse.data.idToken;
    console.log(idToken);

    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "none", // Necessary for cross-origin requests
    };

    // Send the response data back to the client
    return res
      .status(200)
      .cookie("__session", idToken, options)
      .send({ message: "User Logged In Successfully" });
  } catch (error) {
    console.error("Error checking user by email:", error);
    return res.status(500).send("ERROR" + error); // In case of any errors
  }
};

const logoutUser = async (req: any, res: any) => {
  if (!req.user) {
    res.status(404).send("No User Logged In");
  }

  const options: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "none", // Necessary for cross-origin requests
  };

  res.status(200).clearCookie("__session", options).send("User Logged Out");
};

const editUser = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(400).send("User not logged in.");
  }

  const userId = req.user.uid;
  try {
    // Reference to the user document in Firestore
    const userRef = db.collection("users").doc(userId);

    // Update the name field in Firestore
    await userRef.update({
      name: req.body.newName,
    });

    return res.status(200).send({ message: "User name updated successfully!" });
  } catch (error) {
    console.error("Error updating user name:", error);
    return res.status(500).send("Error updating user name.");
  }
};

const deleteUser = async (req: any, res: any) => {
  // Check if the user is logged in (either by `user` or `idToken`)
  if (!req.user || !req.idToken) {
    return res.status(400).send("User not logged in.");
  }

  try {
    // Call Firebase API to delete the user
    const deleteResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBULcEW64tKAYxYXkLNcznKDW8zsaYaKCQ`,
      { idToken: req.idToken }
    );

    // Check if the response was successful and return an appropriate message
    if (deleteResponse.status === 200) {
      await db
        .collection("users")
        .doc(req.user.uid)
        .delete()
        .then(() => {
          console.log(
            `Document with ID ${req.user.uid} and ${req.user.email} deleted successfully.`
          );
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });

      const options: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "none", // Necessary for cross-origin requests
      };

      return res
        .status(200)
        .clearCookie("__session", options)
        .send({ message: "User deleted successfully." });
    } else {
      return res.status(500).send("Failed to delete user.");
    }
  } catch (error: any) {
    // Log the error and send a proper response
    console.error("Error deleting user:", error.message); // Log only the error message

    // Handle the error safely
    if (error.response) {
      // If the error has a response (i.e., API error), return that status and message
      return res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // Handle network errors (request was made but no response received)
      return res.status(500).send("Network error: Failed to reach the server.");
    } else {
      // Handle other types of errors (e.g., invalid idToken format)
      return res.status(500).send("Failed to delete user.");
    }
  }
};

const saveNewNote = async (req: any, res: any) => {
  const { title, content, tags } = req.body;
  if (!req.user) {
    return res.status(400).send("User not logged in.");
  }

  const userRef = db.collection("users").doc(req.user.uid);

  try {
    // Attempt to get the user's document
    const doc = await userRef.get();

    if (doc.exists) {
      // Extract notes from the document data
      const data = doc.data();
      let notes = data?.notes || []; // Default to an empty array if no notes field exists

      notes.push({
        title,
        content,
        createdAt: new Date().toISOString(),
        tags,
      });

      await userRef.update({
        notes: notes,
      });

      // Respond with the user's notes
      return res.status(200).json({ notes });
    } else {
      console.log("No such document!");
      return res.status(404).send("User data not found.");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return res
      .status(500)
      .send("An error occurred while fetching the user's notes.");
  }
};

const getAllNotes = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(400).send("User not logged in.");
  }

  const userRef = db.collection("users").doc(req.user.uid);

  try {
    // Attempt to get the user's document
    const doc = await userRef.get();

    if (doc.exists) {
      // Extract notes from the document data
      const data = doc.data();
      let notes = data?.notes || []; // Default to an empty array if no notes field exists

      // Respond with the user's notes
      return res.status(200).json({ notes });
    } else {
      console.log("No such document!");
      return res.status(404).send("User data not found.");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return res
      .status(500)
      .send("An error occurred while fetching the user's notes.");
  }
};

export {
  testServer,
  registerUser,
  loginUser,
  logoutUser,
  editUser,
  deleteUser,
  saveNewNote,
  getAllNotes,
};
