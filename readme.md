
```markdown
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

### 1. `POST /createUser`

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

### 2. `GET /getUser/:userId`

Fetches details of a user by their unique ID.

#### Sample Request

```plaintext
GET /getUser/12345
```

---

### 3. `PUT /updateUser/:userId`

Updates user details for a given ID.

#### Sample Request

```json
{
  "email": "john.updated@example.com",
  "password": "newsecurepassword456"
}
```

---

### 4. `DELETE /deleteUser/:userId`

Deletes a user from the system by their ID.

#### Sample Request

```plaintext
DELETE /deleteUser/12345
```

---

## Notes

- Ensure the Firebase CLI is running locally for testing purposes.
- Replace `<your-project-id>` in the Base URL with your Firebase project ID.
- All API calls should be made to the Base URL followed by the respective route.

---
```

Save this content into a file named `README.md` in your repository.