let mana = 0;
let playerHand = [];

const cards = [
    {
        name: "Drakenridder",
        type: "wezen",
        cost: 4,
        attack: 6,
        health: 5,
        image: "dragon.jpg",
        rarity: "Legendary"
    },
    {
        name: "Vuurballen",
        type: "spreuk",
        cost: 3,
        damage: 5,
        image: "2.jpg",
        rarity: "Rare"
    },
    {
        name: "Green Elixer",
        type: "artefact",
        cost: 2,
        effect: "Verdubbelt de mana per beurt.",
        image: "3.jpg",
        rarity: "Common"
    },
    {
        name: "Hog Rider",
        type: "wezen",
        cost: 2,
        attack: 3,
        image: "1.jpg",
        rarity: "Epic"
    },
];

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
        cardDiv.onclick = () => playCard(index);
        handDiv.appendChild(cardDiv);
    });
}

function playCard(index) {
    const card = playerHand[index];
    if (card.name === "Green Elixer") {
        mana += 2;
        document.getElementById("mana-count").innerText = mana;
        alert(card.name + " gebruikt! Je krijgt 2 mana.");
        playerHand.splice(index, 1);
        displayHand();
    } else if (mana >= card.cost) {
        mana -= card.cost;
        document.getElementById("mana-count").innerText = mana;
        alert(card.name + " gespeeld!");
        playerHand.splice(index, 1);
        displayHand();
    } else {
        alert("Niet genoeg mana!");
    }
}

document.getElementById("end-turn").onclick = function() {
    mana += 3;
    document.getElementById("mana-count").innerText = mana;
};

drawCards();