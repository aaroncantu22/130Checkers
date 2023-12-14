<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // Redirect to the login page if not logged in
    header("Location: /mysite/130Checkers/Login/login_Page.html");
    exit();
}

$host = 'localhost';
$db   = 'leaderboard';
$user = 'root';
$pass = '';

// Get the username from the session
$username = $_SESSION['username'];

// Database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check for database connection errors
if ($conn->connect_error) {
    die('Connection Failed: ' . $conn->connect_error);
}

// Check if the username already exists in the leaderboard
$checkQuery = "SELECT COUNT(*) as userCount FROM leaderboard WHERE userName = ?";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bind_param("s", $username);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$userCount = $checkResult->fetch_assoc()['userCount'];
$checkStmt->close();

// Insert or update the username in the leaderboard table
if ($userCount == 0) {
    // Username does not exist, insert it into the leaderboard table
    $insertQuery = "INSERT INTO leaderboard (userName) VALUES (?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("s", $username);
    
    // Execute the prepared statement
    if ($insertStmt->execute()) {
        echo "Username inserted into the leaderboard table successfully.";
    } else {
        // Check for execution errors
        die('Error executing the query: ' . $insertStmt->error);
    }

    $insertStmt->close();
} else {
    // Username already exists, update if needed or notify the user
    echo "Username already exists in the leaderboard.";
}

// Query to fetch leaderboard data
$query = "SELECT userName, numWins, timePlayed, userScore, gamesPlayed FROM leaderboard ORDER BY numWins DESC LIMIT 10";
$result = $conn->query($query);

// Close the database connection
$conn->close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkers Leaderboard</title>
    <!-- External CSS -->
    <link rel="stylesheet" href="checkers.css">
    <link rel="stylesheet" href="leaderboard.css">
    <button class="backPage" type="button" onclick="location.href = '/mysite/130Checkers/Game/index_Page.html'">GO BACK</button>
</head>
<body>
    <!-- Leaderboard Table -->
    <table id="leaderboardTable">
        <thead>
            <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Wins</th>
                <th>Time Stamps</th>
                <th>User Score</th>
                <th>Games Played</th>
            </tr>
        </thead>
        <tbody>
            <?php
            // Counter for rank
            $rank = 1;

            // Fetch and display leaderboard data
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>{$rank}</td>
                        <td>{$row['userName']}</td>
                        <td>{$row['numWins']}</td>
                        <td>{$row['timePlayed']}</td>
                        <td>{$row['userScore']}</td>
                        <td>{$row['gamesPlayed']}</td>
                      </tr>";
                $rank++;
            }
            ?>
        </tbody>
    </table>
</body>
</html>
