let mana = 2;
let playerHand = [];
let playerHealth = 20;
let aiHealth = 20;
let shieldActive = false;
let temporaryHealth = 0;
let fireImmunityRounds = 0; 

class Card {
    constructor(name, type, cost, rarity, image) {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.rarity = rarity;
        this.image = image;
    }
}

class CreatureCard extends Card {
    constructor(name, cost, attack, health, rarity, image) {
        super(name, "wezen", cost, rarity, image);
        this.attack = attack;
        this.health = health;
    }
}

class SpellCard extends Card {
    constructor(name, cost, damage, rarity, image) {
        super(name, "spreuk", cost, rarity, image);
        this.damage = damage;
    }
}

class ArtifactCard extends Card {
    constructor(name, cost, effect, rarity, image) {
        super(name, "artefact", cost, rarity, image);
        this.effect = effect;
    }
}

const cards = [
    new CreatureCard("Drakenridder", 5, 6, 5, "Legendary", "6.jpg"),
    new SpellCard("Vuurbal", 3, 4, "Rare", "2.jpg"),
    new ArtifactCard("Green Elixer", 2, "Verdubbelt de mana per beurt.", "Common", "3.jpg"),
    new CreatureCard("Hog Rider", 3, 2, 2, "Epic", "1.jpg"),
    new ArtifactCard("Shield", 2, "Geeft 5 tijdelijke gezondheid en biedt immuniteit.", "Common", "4.jpg"),
    new ArtifactCard("Chicken Wing", 1, "Geeft +2 schade aan Hog Rider als deze wordt gespeeld.", "Common", "7.jpg"),
    new ArtifactCard("Anti Fire Potion", 2, "Geeft immuniteit tegen Vuurbal en Drakenridder voor 2 rondes.", "Rare", "8.jpg")
];

function updateManaDisplay() {
    document.getElementById("mana-count").innerText = mana;
}

function updateHealthDisplay() {
    document.getElementById("player-health-count").innerText = playerHealth + temporaryHealth;
    document.getElementById("ai-health-count").innerText = aiHealth;
    document.getElementById("player-health").style.width = ((playerHealth + temporaryHealth) / 20) * 100 + "%";
    document.getElementById("ai-health").style.width = (aiHealth / 20) * 100 + "%";
}

function drawCards() {
    playerHand = [...cards];
    displayHand();
}

function displayHand() {
    const handDiv = document.getElementById("player-hand");
    handDiv.innerHTML = "";
    playerHand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `card ${card.rarity.toLowerCase()}`;
        cardDiv.onclick = () => playCard(index);

        const img = document.createElement("img");
        img.src = card.image;
        img.alt = card.name;
        img.style.width = "100%";
        img.style.height = "auto";

        const textDiv = document.createElement("div");
        textDiv.innerHTML = `
            <p class="${card.rarity.toLowerCase()}">${card.name}</p>
            <p class="${card.rarity.toLowerCase()}">${card.rarity}</p>
            <p class="${card.rarity.toLowerCase()}">${card.cost}</p>
        `;

        cardDiv.appendChild(img);
        cardDiv.appendChild(textDiv);
        handDiv.appendChild(cardDiv);
    });
}

function playCard(index) {
    const card = playerHand[index];

    if (card instanceof ArtifactCard && card.name === "Green Elixer") {
        mana += 2;
        alert(card.name + " gebruikt! Je krijgt 2 mana.");
    } else if (card instanceof ArtifactCard && card.name === "Shield") {
        if (mana >= card.cost) {
            mana -= card.cost;
            shieldActive = true;
            temporaryHealth += 5;
            alert(card.name + " gespeeld! Je krijgt 5 tijdelijke gezondheid en biedt immuniteit.");
        } else {
            alert("Niet genoeg mana om Shield te spelen!");
            return;
        }
    } else if (card instanceof ArtifactCard && card.name === "Chicken Wing") {
        const hogRider = playerHand.find(c => c.name === "Hog Rider");
        if (hogRider) {
            hogRider.attack += 2;
            alert(`${card.name} gespeeld! Hog Rider krijgt +2 schade.`);
        }
    } else if (card instanceof ArtifactCard && card.name === "Anti Fire Potion") {
        if (mana >= card.cost) {
            mana -= card.cost;
            fireImmunityRounds = 2;
            alert(`${card.name} gespeeld! Je hebt immuniteit tegen Vuurbal en Drakenridder voor 2 rondes.`);
        } else {
            alert("Niet genoeg mana om Anti Fire Potion te spelen!");
            return;
        }
    } else if (mana >= card.cost) {
        mana -= card.cost;
        alert(card.name + " gespeeld!");

        if (card instanceof CreatureCard) {
            aiHealth -= card.attack;
            alert(`${card.name} doet ${card.attack} schade aan de AI!`);
        } else if (card instanceof SpellCard) {
            aiHealth -= card.damage;
            alert(`${card.name} doet ${card.damage} schade aan de AI!`);
        }

        if (aiHealth <= 0) {
            alert("De AI is verslagen!");
            resetGame();
            return;
        }
    } else {
        alert("Niet genoeg mana!");
        return;
    }

    playerHand.splice(index, 1);
    updateManaDisplay();
    updateHealthDisplay();
    displayHand();
}

function applyDamageToPlayer(damage) {
    if (shieldActive) {
        alert("De shield absorbeert de schade!");
        shieldActive = false;
    } else if (fireImmunityRounds > 0) {
        alert("Je hebt immuniteit tegen deze aanval!");
        fireImmunityRounds--; // Decrease immunity rounds
    } else {
        playerHealth -= damage;
    }
    updateHealthDisplay();
}

function resetGame() {
    mana = 2;
    playerHealth = 20;
    aiHealth = 20;
    shieldActive = false;
    temporaryHealth = 0;
    fireImmunityRounds = 0;
    drawCards();
    updateManaDisplay();
    updateHealthDisplay();
}

document.getElementById("end-turn").addEventListener("click", endTurn);

function endTurn() {
    shieldActive = false;
    temporaryHealth = 0;
    mana += 2;
    updateManaDisplay();
    aiTurn();
    updateHealthDisplay();
}

function aiTurn() {
    if (aiHealth > 0) {
        const damage = 3;
        applyDamageToPlayer(damage);
        alert(`De AI doet ${damage} schade aan jou!`);
    }
}

updateManaDisplay();
drawCards();
updateHealthDisplay();