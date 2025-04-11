let mana = 3;
let aiMana = 3;
let playerHand = [];
let playerHealth = 20;
let aiHealth = 20;
let aiHand = [];
let shieldActive = false;
let temporaryHealth = 0;
let fireImmunityRounds = 0;
let score = 0;

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

function enhanceRandomCreature() {
    const creatureCards = playerHand.filter(card => card instanceof CreatureCard);
    if (creatureCards.length > 0) {
        const randomCard = creatureCards[Math.floor(Math.random() * creatureCards.length)];
        randomCard.attack += 1;
        const cardDiv = document.querySelector(`.card.${randomCard.rarity.toLowerCase()}`);
        if (cardDiv) {
            cardDiv.classList.add('glow');
            setTimeout(() => {
                cardDiv.classList.remove('glow');
            }, 2000);
        }
        alert(`${randomCard.name} heeft nu +1 schade!`);
    }
}

const cards = [
    new CreatureCard("Drakenridder", 5, 7, 5, "Legendary", "6.jpg"),
    new SpellCard("Vuurbal", 3, 4, "Rare", "2.jpg"),
    new ArtifactCard("Green Elixer", 1, "Verdubbelt de mana per beurt.", "Common", "3.jpg"),
    new CreatureCard("Hog Rider", 3, 4, 2, "Epic", "1.jpg"),
    new ArtifactCard("Shield", 2, "Geeft 5 tijdelijke gezondheid en biedt immuniteit.", "Common", "4.jpg"),
    new ArtifactCard("Chicken Wing", 1, "Geeft +2 schade aan Hog Rider als deze wordt gespeeld.", "Common", "7.jpg"),
    new ArtifactCard("Anti Fire Potion", 2, "Geeft immuniteit tegen Vuurbal en Drakenridder voor 2 rondes.", "Rare", "8.jpg"),
    new CreatureCard("Knight", 2, 3, 4, "Common", "9.jpg"),
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

function updateScoreDisplay() {
    document.getElementById("score-count").innerText = score;
}

function drawCards() {
    playerHand = [...cards];
    displayHand();
}

function toggleNav() {
    const navMenu = document.getElementById("nav-menu");
    if (navMenu.style.display === "none" || navMenu.style.display === "") {
        navMenu.style.display = "block";
    } else {
        navMenu.style.display = "none";
    }
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
            score += card.attack;
            alert(`${card.name} doet ${card.attack} schade aan de AI!`);
        } else if (card instanceof SpellCard) {
            aiHealth -= card.damage;
            score += card.damage;
            alert(`${card.name} doet ${card.damage} schade aan de AI!`);
        }

        if (aiHealth <= 0) {
            score += 50;
            alert("De AI is verslagen! Je krijgt 50 punten.");
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
    updateScoreDisplay();
    displayHand();
}

function applyDamageToPlayer(damage) {
    if (shieldActive) {
        alert("De shield absorbeert de schade!");
        shieldActive = false;
    } else if (fireImmunityRounds > 0) {
        alert("Je hebt immuniteit tegen deze aanval!");
        fireImmunityRounds--;
    } else {
        playerHealth -= damage;
        score -= damage;
    }
    updateHealthDisplay();
    updateScoreDisplay();
}

function resetGame() {
    mana = 2;
    aiMana = 3;
    playerHealth = 20;
    aiHealth = 20;
    shieldActive = false;
    temporaryHealth = 0;
    fireImmunityRounds = 0;
    drawCards();
    drawAiCards();
    updateManaDisplay();
    updateHealthDisplay();
    updateScoreDisplay();
}

document.getElementById("end-turn").addEventListener("click", endTurn);

function endTurn() {
    shieldActive = false;
    temporaryHealth = 0;
    mana += 2;
    aiMana += 2;
    updateManaDisplay();
    drawCards();
    aiTurn();
    enhanceRandomCreature();
    updateHealthDisplay();
}

function aiTurn() {
    if (aiHealth > 0) {
        const playableCards = aiHand.filter(card => aiMana >= card.cost);
        if (playableCards.length > 0) {
            const cardToPlay = playableCards.reduce((prev, current) => {
                return (prev instanceof CreatureCard && current instanceof CreatureCard && prev.attack > current.attack) ? prev : current;
            });

            aiMana -= cardToPlay.cost;
            alert(`De AI speelt ${cardToPlay.name}!`);

            if (cardToPlay instanceof CreatureCard) {
                applyDamageToPlayer(cardToPlay.attack);
            } else if (cardToPlay instanceof SpellCard) {
                applyDamageToPlayer(cardToPlay.damage);
            }

            aiHand.splice(aiHand.indexOf(cardToPlay), 1);
        } else {
            alert("De AI heeft geen kaarten om te spelen!");
        }

        if (playerHealth <= 0) {
            alert("Je bent verslagen door de AI!");
            resetGame();
            return;
        }
    }
}

function drawAiCards() {
    aiHand = [...cards];
}

updateManaDisplay();
drawCards();
drawAiCards();
updateHealthDisplay();
updateScoreDisplay();