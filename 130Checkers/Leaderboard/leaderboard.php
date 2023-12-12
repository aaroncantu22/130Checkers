<?php
// Replace these values with your actual database connection details
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "checkersleaderboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect user input from the form
    $userName = $_POST["userName"];
    $wins = $_POST["wins"];

    // Insert data into the leaderboard table
    $sql = "INSERT INTO leaderboard (userName, wins) VALUES ('$userName', '$wins')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close the database connection
$conn->close();
?>

