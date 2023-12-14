<?php
$host = 'localhost';
$db   = 'loginaccounts';
$user = 'root';
$pass = '';

// Corrected superglobal names
$username = $_POST['username'];
$password = $_POST['password'];

// Database connection
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die('Connection Failed: ' . $conn->connect_error);
} else {
    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE userName = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username found, check the password
        $row = $result->fetch_assoc();
        $hashedPasswordFromDB = $row['userPassword'];

        if (password_verify($password, $hashedPasswordFromDB)) {
            // Passwords match, redirect to index_Page.html
            header("Location: /mysite/130Checkers/Game/index_Page.html");
            exit();
        }
    }
    if (password_verify($password, $hashedPasswordFromDB)) {
    // Passwords match, start a session and store user information
    session_start();
    $_SESSION['userID'] = $row['userID'];
    $_SESSION['username'] = $row['userName'];

    // Redirect to the index page
    header("Location: /mysite/130Checkers/Game/index_Page.html");
    exit();
}
    // Username or password not found
    // Display error message
}

if ($result->num_rows > 0) {
    // Username found, check the password
    $row = $result->fetch_assoc();
    $hashedPasswordFromDB = $row['userPassword'];

    if (password_verify($password, $hashedPasswordFromDB)) {
        // Passwords match, start a session and set the username
        session_start();
        $_SESSION['userID'] = $row['userID'];
        $_SESSION['username'] = $row['userName'];

        // Redirect to index page
        header("Location: /mysite/130Checkers/Game/index_Page.html");
        exit();
    }
}
$stmt->close();
$conn->close();
?>

<!-- HTML code for displaying the result to the user -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Result</title>
    <link rel="stylesheet" href="loginResult.css" /> 

</head>

<body>
    <div class="result-container">
        <div class="result">
        <div class="big-x">X</div>
        <h1 class="error-message">Login failed</h1>
        <p class="error-message">Invalid username or password. Try Again</p>
        <a class="back-to-login" href="/mysite/130Checkers/Login/login_Page.html">Back to Login</a>
    </div>
</body>
</html>
