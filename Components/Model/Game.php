<?php
class Game {
    public $players = [];

    public function addPlayer($player) {
        $this->players[] = $player;
    }

    public function startGame() {
        $cards = [
            new ElementalCard("Fireball", 5, "Fire"),
            new ElementalCard("Tsunami", 4, "Water"),
            new ElementalCard("Rock Slide", 6, "Earth"),
            new ElementalCard("Wind Gust", 3, "Air")
        ];

        foreach ($this->players as $player) {
            $player->drawCard($cards[array_rand($cards)]);
            $player->drawCard($cards[array_rand($cards)]);
        }

        return $this->players;
    }
}