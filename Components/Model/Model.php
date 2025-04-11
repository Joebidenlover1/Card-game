<?php
class Model {
    private $pdo;

    public function __construct() {
        $host = 'localhost';
        $db = 'card_game';
        $user = 'root';
        $pass = '';

        try {
            $this->pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            exit;
        }
    }

    public function fetchQuestions() {
        $stmt = $this->pdo->query("SELECT * FROM questions");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function recordVote($id, $choice) {
        if ($choice === '1') {
            $stmt = $this->pdo->prepare("UPDATE questions SET votes1 = votes1 + 1 WHERE id = ?");
        } else {
            $stmt = $this->pdo->prepare("UPDATE questions SET votes2 = votes2 + 1 WHERE id = ?");
        }
        $stmt->execute([$id]);
    }
}
?>