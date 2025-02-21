document.getElementById('startGame').onclick = function() {
    fetch('Controller/GameController.php', {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayPlayers(data);
        })
        .catch(error => console.error('Error:', error));
};

function displayPlayers(players) {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    players.forEach((player, index) => {
        let playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.innerHTML = `<h2>${player.name} (Health: ${player.health})</h2>`;
        player.hand.forEach((card, cardIndex) => {
            let cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = `${card.name} (Damage: ${card.damage})`;
            cardDiv.onclick = function() {
                playCard(index, cardIndex);
            };
            playerDiv.appendChild(cardDiv);
        });
        playersDiv.appendChild(playerDiv);
    });
}

function playCard(playerIndex, cardIndex) {
    fetch('Controller/GameController.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIndex, cardIndex })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                alert(data.status + ": " + data.winner);
            } else {
                alert(`Damage dealt: ${data.damage}. Opponent's health: ${data.opponentHealth}`);
            }
            // Update the players' display with the latest game state
            displayPlayers(data); // Use the data returned from the server
        })
        .catch(error => console.error('Error:', error));
}