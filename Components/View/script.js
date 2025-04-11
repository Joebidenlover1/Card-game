let mana = 3;
let aiMana = 3;
let playerHand = [];
let playerHealth = 20;
let aiHealth = 18;
let aiHand = [];
let shieldActive = false;
let temporaryHealth = 0;
let fireImmunityRounds = 0;
let score = parseInt(localStorage.getItem("playerScore")) || 0;
let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;

let levelRequirements = {
    1: 100,
    2: 250,
    3: 400
};

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
    constructor(name, cost, attack, rarity, image) {
        super(name, "wezen", cost, rarity, image);
        this.attack = attack;
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
    new CreatureCard("Drakenridder", 5, 7, "Legendary", "6.jpg"),
    new SpellCard("Vuurbal", 3, 4, "Rare", "2.jpg"),
    new ArtifactCard("Green Elixer", 1, "Verdubbelt de mana per beurt.", "Common", "3.jpg"),
    new CreatureCard("Hog Rider", 3, 4, "Epic", "1.jpg"),
    new ArtifactCard("Shield", 2, "Geeft 5 tijdelijke gezondheid en biedt immuniteit.", "Common", "4.jpg"),
    new ArtifactCard("Chicken Wing", 1, "Geeft +2 schade aan Hog Rider als deze wordt gespeeld.", "Common", "7.jpg"),
    new ArtifactCard("Anti Fire Potion", 2, "Geeft immuniteit tegen Vuurbal en Drakenridder voor 2 rondes.", "Rare", "8.jpg"),
    new CreatureCard("Knight", 2, 3, "Common", "9.jpg"),
];

// Extra kaarten (zoals de draak) terughalen
let savedExtraCards = JSON.parse(localStorage.getItem("extraCards")) || [];
savedExtraCards.forEach(extraCard => cards.push(Object.assign(new CreatureCard(), extraCard)));

function levelUp() {
    const requiredPoints = levelRequirements[playerLevel];
    if (score >= requiredPoints) {
        playerLevel++;
        localStorage.setItem("playerLevel", playerLevel);
        alert(`Gefeliciteerd! Je bent nu niveau ${playerLevel}!`);

        if (playerLevel === 2) {
            score += 100;
            localStorage.setItem("playerScore", score);
            alert("Je hebt 100 extra punten gekregen!");

            const newCard = new CreatureCard("Gouden Draak", 10, 17, "Legendary", "10.jpg");
            cards.push(newCard);

            // Sla nieuwe kaart op in localStorage
            savedExtraCards.push(newCard);
            localStorage.setItem("extraCards", JSON.stringify(savedExtraCards));

            alert("Je hebt een nieuwe kaart ontvangen: Gouden Draak!");
        }

        updateLevelDisplay();
    }
}

function updateLevelDisplay() {
    document.getElementById("level-count").innerText = playerLevel;
}

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
    navMenu.style.display = (navMenu.style.display === "none" || navMenu.style.display === "") ? "block" : "none";
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
            alert(card.name + " gespeeld! Je krijgt 5 tijdelijke gezondheid.");
        } else {
            alert("Niet genoeg mana om Shield te spelen!");
            return;
        }
    } else if (card instanceof ArtifactCard && card.name === "Chicken Wing") {
        if (mana >= card.cost) {
            mana -= card.cost;
            const hogRider = playerHand.find(c => c.name === "Hog Rider");
            if (hogRider) {
                hogRider.attack += 2;
                alert(`${card.name} gespeeld! Hog Rider krijgt +2 schade.`);
            } else {
                alert(`${card.name} gespeeld, maar er is geen Hog Rider in je hand.`);
            }
        } else {
            alert("Niet genoeg mana om Chicken Wing te spelen!");
            return;
        }
    } else if (card instanceof ArtifactCard && card.name === "Anti Fire Potion") {
        if (mana >= card.cost) {
            mana -= card.cost;
            fireImmunityRounds = 2;
            alert(`${card.name} gespeeld! Immuniteit voor 2 rondes.`);
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
            alert(`${card.name} doet ${card.attack} schade!`);
        } else if (card instanceof SpellCard) {
            aiHealth -= card.damage;
            score += card.damage;
            alert(`${card.name} doet ${card.damage} schade!`);
        }

        if (aiHealth <= 0) {
            score += 50;
            alert("De AI is verslagen! +50 punten.");
            levelUp();
            resetGame();
            return;
        }
    } else {
        alert("Niet genoeg mana!");
        return;
    }

    playerHand.splice(index, 1);
    localStorage.setItem("playerScore", score);
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

function hardResetGame() {
    if (confirm("Weet je zeker dat je je spel wilt resetten? Alles gaat verloren.")) {
        mana = 2;
        aiMana = 3;
        playerHealth = 20;
        aiHealth = 20;
        score = 0;
        playerLevel = 1;
        shieldActive = false;
        temporaryHealth = 0;
        fireImmunityRounds = 0;

        localStorage.removeItem("playerScore");
        localStorage.removeItem("playerLevel");
        localStorage.removeItem("extraCards");

        playerHand = [];
        aiHand = [];
        drawCards();
        drawAiCards();

        updateManaDisplay();
        updateHealthDisplay();
        updateScoreDisplay();
        updateLevelDisplay();

        alert("Spel volledig gereset!");
    }
}

function enhanceRandomCreature() {
    const creatureCards = playerHand.filter(card => card instanceof CreatureCard);
    if (creatureCards.length > 0) {
        const randomCard = creatureCards[Math.floor(Math.random() * creatureCards.length)];
        randomCard.attack += 1;
        alert(`${randomCard.name} krijgt +1 schade!`);
    }
}

function aiTurn() {
    if (aiHealth > 0) {
        const playableCards = aiHand.filter(card => aiMana >= card.cost);
        if (playableCards.length > 0) {
            const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
            aiMana -= randomCard.cost;
            alert(`De AI speelt ${randomCard.name}!`);

            if (randomCard instanceof CreatureCard) {
                applyDamageToPlayer(randomCard.attack);
            } else if (randomCard instanceof SpellCard) {
                applyDamageToPlayer(randomCard.damage);
            }

            aiHand.splice(aiHand.indexOf(randomCard), 1);
        } else {
            alert("De AI heeft geen kaarten om te spelen!");
        }

        if (playerHealth <= 0) {
            alert("Je bent verslagen!");
            resetGame();
        }
    }
}

function drawAiCards() {
    aiHand = [...cards];
}

document.getElementById("end-turn").addEventListener("click", () => {
    shieldActive = false;
    temporaryHealth = 0;
    mana += 2;
    aiMana += 2;
    updateManaDisplay();
    drawCards();
    aiTurn();
    enhanceRandomCreature();
    updateHealthDisplay();
});

document.getElementById("reset-game").addEventListener("click", hardResetGame);

// INIT
updateManaDisplay();
drawCards();
drawAiCards();
updateHealthDisplay();
updateScoreDisplay();
updateLevelDisplay();
