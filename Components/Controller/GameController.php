<?php
session_start();
require_once '../Model/Card.php';
require_once '../Model/Player.php';
require_once '../Model/Game.php';

class GameController {
    public function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            if (!isset($_SESSION['game'])) {
                $this->startNewGame();
            } else {
                $this->playCard();
            }
        }
    }

    private function startNewGame() {
        $game = new Game();
        $player1 = new Player("Player 1");
        $player2 = new Player("Player 2");
        $game->addPlayer($player1);
        $game->addPlayer($player2);
        $_SESSION['game'] = $game->startGame();
        echo json_encode($_SESSION['game']);
    }

    private function playCard() {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $playerIndex = $requestData['playerIndex'];
        $cardIndex = $requestData['cardIndex'];
        $opponentIndex = ($playerIndex + 1) % 2;

        $player = $_SESSION['game'][$playerIndex];
        $opponent = $_SESSION['game'][$opponentIndex];

        $damage = $player->playCard($player->hand[$cardIndex], $opponent);
        if ($opponent->health <= 0) {
            echo json_encode(["status" => "Game Over", "winner" => $player->name]);
        } else {
            echo json_encode(["damage" => $damage, "opponentHealth" => $opponent->health]);
        }
    }
}

$controller = new GameController();
$controller->handleRequest();