<?php
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
    $username = $_POST['signup-username'];
    $email = $_POST['signup-email'];
    $gender = $_POST['signup-gender'];
    $dob = date('Y-m-d', strtotime($_POST['signup-dob']));
    $height = $_POST['signup-height'];
    $weight = $_POST['signup-weight'];
    $password = $_POST['signup-password'];

    // SQL to insert data into database
    $sql = "INSERT INTO user (username, gender, email,  height, weight, dob, password)
            VALUES ('$username', '$gender', '$email', '$height', '$weight', $dob,'$password')";

    // Execute SQL query
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
        header("Location: Home.html"); 
        exit();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close database connection
$conn->close();
?>
