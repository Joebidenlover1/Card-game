<?php
class Card {
    public $name;
    public $damage;

    public function __construct($name, $damage) {
        $this->name = $name;
        $this->damage = $damage;
    }
}

class ElementalCard extends Card {
    public $element;

    public function __construct($name, $damage, $element) {
        parent::__construct($name, $damage);
        $this->element = $element;
    }
}