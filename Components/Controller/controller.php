<?php
require '../Model/model.php';

class Controller {
    private $model;

    public function __construct() {
        $this->model = new Model();
    }

    public function getQuestions() {
        return $this->model->fetchQuestions();
    }

    public function submitVote($id, $choice) {
        return $this->model->recordVote($id, $choice);
    }
}

$controller = new Controller();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($controller->getQuestions());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id']) && isset($data['choice'])) {
        $id = $data['id'];
        $choice = $data['choice'];

        $controller->submitVote($id, $choice);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
    exit;
}
?>