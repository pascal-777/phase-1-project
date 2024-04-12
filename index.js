// index.js
const openFormButton = document.getElementById("open-form");
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close");
const form = document.getElementById("add-game-form");
const gameNameInput = document.getElementById("game-name");
const ownerNameInput = document.getElementById("owner-name");
const ownerNumberInput = document.getElementById("owner-number");
const gamePlatformInput = document.getElementById("game-platform");
const gameUrlInput = document.getElementById("game-url");
const gamesContainer = document.getElementById("games-container");

openFormButton.addEventListener("click", () => {
  modal.style.display = "block";
});

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Fetch games from the server and display them
function fetchAndDisplayGames() {
  fetch("http://localhost:3000/games")
    .then((response) => response.json())
    .then((games) => {
      gamesContainer.innerHTML = ""; // Clear the games container
      games.forEach((game) => {
        const card = createGameCard(game);
        gamesContainer.appendChild(card);
      });
    });
}

// Initial fetch and display of games
fetchAndDisplayGames();

// Add a new game to the server and update the list
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newGame = {
    title: gameNameInput.value,
    owner: ownerNameInput.value,
    ownerNumber: ownerNumberInput.value,
    platform: gamePlatformInput.value,
    image: gameUrlInput.value
  };
  fetch("http://localhost:3000/games", {
    method: "POST",
    body: JSON.stringify(newGame),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((game) => {
      fetchAndDisplayGames(); // Fetch and display updated games list
      gameNameInput.value = "";
      ownerNameInput.value = "";
      ownerNumberInput.value = "";
      gamePlatformInput.value = "";
      gameUrlInput.value = "";
      modal.style.display = "none"; // Close the modal after adding game
    });
});

// Remove a game from the server and update the list
function removeGame(id) {
  fetch(`http://localhost:3000/games/${id}`, { method: "DELETE" })
    .then(() => {
      fetchAndDisplayGames(); // Fetch and display updated games list
    })
    .catch((error) => console.error(error));
}

// Create a game card
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = `game-${game.id}`;

  const title = document.createElement("h3");
  title.textContent = game.title;
  card.appendChild(title);

  const owner = document.createElement("p");
  owner.textContent = `Owner: ${game.owner}`;
  card.appendChild(owner);

  const ownerNumber = document.createElement("p");
  ownerNumber.textContent = `Owner Number: ${game.ownerNumber}`;
  card.appendChild(ownerNumber);

  const platform = document.createElement("p");
  platform.textContent = `Platform: ${game.platform}`;
  card.appendChild(platform);

  if (game.image) {
    const image = document.createElement("img");
    image.src = game.image;
    image.alt = game.title;
    card.appendChild(image);
  }

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    removeGame(game.id);
  });
  card.appendChild(removeButton);

  return card;
}
