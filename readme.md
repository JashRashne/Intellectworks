

# Firebase Functions Backend

This repository contains the backend logic for your application, implemented using Firebase Functions. Follow the instructions below to set up and use the backend.

---

## Prerequisites

1. **Firebase CLI**: Ensure you have the Firebase CLI installed. If not, you can install it by running:

   ```bash
   npm install -g firebase-tools
   ```

2. **Node.js**: Make sure you have Node.js installed. You can download it [here](https://nodejs.org/).

---

## Installation and Setup

1. Clone this repository to your local machine:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the Firebase Functions emulator:

   ```bash
   npm run serve
   ```

4. Once the emulator is running, you’ll see a **Base URL** in the Firebase CLI logs. Use this URL as the base for all API calls (e.g., `http://localhost:5001/<your-project-id>/us-central1/<function-name>`).

---

## API Routes

### 1. `POST /register`

Creates a new user in the system.

#### Sample Request

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

---

### 2. `POST /login`

Logs the user in.

#### Sample Request

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

---

### 3. `POST /logout`

Logs the user out.

---

### 4. `POST /edit-user-details`

Edits the user details in firestore

#### Sample Request

```json
{
  "name": "John",
}
```

---

### 5. `POST /delete-user`

Edits the user details in firestore

---

### 5. `POST /save-new-note`

Saves a new note in firestore in the logged in user

#### Sample Request

```json
{
    "title" : "Test Title",
    "content" : "This is a new note.",
    "tags" : ["tag1", "tag2"]
}
```

---

### 5. `POST /get-notes`

Gets all notes from firestore from the logged in user

---


## Notes

- Ensure the Firebase CLI is running locally for testing purposes.
- Replace `<your-project-id>` in the Base URL with your Firebase project ID.
- All API calls should be made to the Base URL followed by the respective route.

---
```
