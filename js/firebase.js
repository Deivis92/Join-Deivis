const BASE_URL =
  "https://join-dummy-backend-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Posts data to a specific path in the Firebase database.
 *
 * @param {string} path - The path to post data to.
 * @param {Object} data - The data to post.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function postData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Retrieves user data from the Firebase database.
 *
 * @returns {Promise<Object>} - The JSON data of the user.
 */
async function getUserData() {
  try {
    const response = await fetch(BASE_URL + "users/" + USER_ID + ".json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Deletes data at a specific path in the Firebase database.
 *
 * @param {string} path - The path to delete data from.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function deleteData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
  });
  const responseToJson = await response.json(); // parses JSON response into native JavaScript objects
  return responseToJson;
}

/**
 * Puts (updates) data at a specific path in the Firebase database.
 *
 * @param {string} path - The path to put data to.
 * @param {Object} data - The data to put.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function putData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  return responseJson;
}

/**
 * Updates user information in the Firebase database.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {Array} contacts - The contacts of the user.
 * @param {Array} tasks - The tasks of the user.
 */
function updateUser(name, email, password, contacts, tasks) {
  putData(`/users/${USER_ID}`, {
    name: name,
    email: email,
    password: password,
    contacts: contacts,
    tasks: tasks,
  });
}
