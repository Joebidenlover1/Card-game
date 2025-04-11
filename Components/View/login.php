<?php
session_start();
$conn = new mysqli('localhost', 'root', '', 'card_game');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();

    if (password_verify($password, $hashedPassword)) {
        $_SESSION['username'] = $username;
        header("Location: index.php"); // Redirect to the game
        exit(); // Ensure no further code is executed
    } else {
        echo "Invalid credentials.";
    }
    $stmt->close();
}
?>