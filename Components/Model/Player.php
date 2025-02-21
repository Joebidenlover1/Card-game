<?php
class Player {
    public $name;
    public $hand = [];
    public $health = 20;

    public function __construct($name) {
        $this->name = $name;
    }

    public function drawCard($card) {
        $this->hand[] = $card;
    }

    public function playCard($card, $opponent) {
        if (in_array($card, $this->hand)) {
            $this->hand = array_diff($this->hand, [$card]);
            $damage = $card->damage; // Simplified for now
            $opponent->health -= $damage;
            return $damage;
        }
        return 0;
    }
}