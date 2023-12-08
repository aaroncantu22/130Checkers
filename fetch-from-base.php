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
    $stmt = $conn->prepare("SELECT * FROM users WHERE userName = ? AND userPwd = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username and password found, redirect to index_Page.html
        header("Location: index_Page.html");
        exit();
    } else {
        // Username or password not found
    
    }

    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Result</title>
    <link rel="stylesheet" href="loginResult.css" />
    <style>
        body {
            background-color: #000000; /* Black background */
            color: #000080; /* Navy blue text color */
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .result-container {
            text-align: center;
            padding: 20px;
            background-color: #a90000; /* Red background */
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .error-message {
            color: #ffffff; /* White text color */
            font-size: 18px;
            margin-bottom: 20px;
        }

        .back-to-login {
            text-decoration: none;
            color: #ffffff; /* White text color */
            font-size: 16px;
            display: inline-block;
            padding: 10px 20px;
            background-color: #000080; /* Navy blue background color */
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .back-to-login:hover {
            background-color: #000066; /* Darker navy blue on hover */
        }
    </style>
</head>
<body>

<div class="result-container">
    <p class="error-message">Username or Password does not exist. Try Again</p>
    <a class="back-to-login" href="login_Page.html">Back to Login</a>
</div>

</body>
</html>
