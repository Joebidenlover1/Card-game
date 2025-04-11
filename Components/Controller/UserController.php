<?php
require_once '../Model/UserModel.php';

$userModel = new UserModel("localhost", "card_game", "root", "");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = trim($_POST['username']);
    $pass = trim($_POST['password']);

    if ($userModel->userExists($user)) {
        echo "Username already taken. <a href='../View/login.html'>Try again</a>";
    } else {
        if ($userModel->registerUser($user, $pass)) {
            echo "Registration successful. <a href='../View/login.html'>Go back</a>";
        } else {
            echo "Error in registration.";
        }
    }
}
?>
