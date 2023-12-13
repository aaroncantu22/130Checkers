<?php
$host = 'localhost';
$db   = 'loginaccounts';
$user = 'root';
$pass = '';

// Corrected superglobal name
$username = $_POST['username'];
$password = $_POST['password'];

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Database connection
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die('Connection Failed: ' . $conn->connect_error);
} else {
    // Check if the username or hashed password already exists in the database
    $stmt = $conn->prepare("SELECT * FROM users WHERE userName = ? OR userPassword = ?");
    $stmt->bind_param("ss", $username, $hashedPassword);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username or password already exists
        $existingUserError = "Username or password is already in use!";
    } else {
        // Insert new user into the database with the hashed password
        $stmt = $conn->prepare("INSERT INTO users (userName, userPassword) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashedPassword);
        $stmt->execute();
    }

    $stmt->close();
    $conn->close();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Signup Result</title>
    <link rel="stylesheet" href="signSuccess.css" />
   
</head>
<body>

    <div class="login_form_container">
    <div class="login_form">
    <?php
    if (isset($existingUserError)) {
        // Display beating heart X for fatal error
        echo "<div class='big-x'>X</div>";
        echo "<h2 class='error'>Fatal Error</h2>";
        echo "<p class='error'>$existingUserError</p>";

        // Add a button to go back to the sign-up page
        echo "<form action='signup_page.html' method='get'>";
        echo "<button id='back_to_signup_button' type='submit'>Back to Sign-up</button>";
        echo "</form>";
    } else {
        echo "<div class='big-check'>&#10004;</div>";
        echo "<h2>Signup Successful</h2>";
        echo "<p>User added successfully!</p>";

        // Add the "Go to Login" button inside the text box
        echo "<form action= http://localhost/mysite/130Checkers/Login/login_Page.html method='get'>";
        echo "<button id='create_account_button' type='submit'>Go to Login</button>";
        echo "</form>";
    }
    ?>
</div>


    </div>
    <!-- JavaScript to disable the "Create Account" button -->
    <script>
        <?php
        if (isset($existingUserError)) {
            echo "document.getElementById('create_account_button').disabled = true;";
        }
        ?>
    </script>

</body>
</html>
