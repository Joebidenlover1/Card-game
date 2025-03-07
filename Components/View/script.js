let mana = 0;
let playerHand = [];

const cards = [
    {
        name: "Drakenridder",
        type: "wezen",
        cost: 4,
        attack: 6,
        health: 5,
            image: "../Components/View/images/dragon.jpg"
    },
    {
        name: "Vuurballen",
        type: "spreuk",
        cost: 3,
        damage: 5,
        image: "images/"
    },
    {
        name: "Mana Crystal",
        type: "artefact",
        cost: 2,
        effect: "Verdubbelt de mana per beurt.",
        image: "images/"
    }
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
        cardDiv.className = "card";


        const img = document.createElement("img");
        img.src = card.image;
        img.alt = card.name;
        img.style.width = "80%";
        img.style.height = "auto";


        const textDiv = document.createElement("div");
        textDiv.innerHTML = `<p>${card.name}</p><p>Kosten: ${card.cost}</p>`;


        cardDiv.appendChild(img);
        cardDiv.appendChild(textDiv);

        cardDiv.onclick = () => playCard(index);
        handDiv.appendChild(cardDiv);
    });
}

function playCard(index) {
    const card = playerHand[index];
    if (mana >= card.cost) {
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