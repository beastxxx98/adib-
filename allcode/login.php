<?php
session_start();

// Database connection details
$servername = "localhost";
$username = "root"; // Replace with your actual database username
$password = ""; // Replace with your actual database password
$dbname = "fittracker360user"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $username = $_POST['login-username'];
    $password = $_POST['login-password'];

    // Query to check if the username and password match
    $sql = "SELECT username,password FROM user WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        // Authentication successful
        $_SESSION['username'] = $username; // Store username in session for future use
        header("Location: afterLogin.html"); // Redirect to the home page after successful login
        exit();
    } else {
        // Authentication failed
        echo "Invalid username or password";
    }
}

// Close database connection
$conn->close();
?>
