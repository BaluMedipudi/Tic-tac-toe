document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("resetButton");
    const resetDataButton = document.getElementById("resetDataButton");
    const message = document.getElementById("message");
    const playerWinsElement = document.getElementById("playerWins");
    const computerWinsElement = document.getElementById("computerWins");
    const tiesElement = document.getElementById("ties");
    const choiceContainer = document.getElementById("choiceContainer");
    const gameContainer = document.getElementById("gameContainer");
    const playerButton = document.getElementById("playerButton");
    const computerButton = document.getElementById("computerButton");
    const playerChoiceContainer = document.getElementById("playerChoiceContainer");
    const xButton = document.getElementById("xButton");
    const oButton = document.getElementById("oButton");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;
    let isPlayingWithComputer = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let playerWins = localStorage.getItem("playerWins") || 0;
    let computerWins = localStorage.getItem("computerWins") || 0;
    let ties = localStorage.getItem("ties") || 0;

    playerWinsElement.textContent = playerWins;
    computerWinsElement.textContent = computerWins;
    tiesElement.textContent = ties;

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            if (isPlayingWithComputer) {
                message.textContent = currentPlayer === "X" ? "Player 1 Wins!" : "Computer Wins!";
                if (currentPlayer === "X") {
                    playerWins++;
                    localStorage.setItem("playerWins", playerWins);
                } else {
                    computerWins++;
                    localStorage.setItem("computerWins", computerWins);
                }
            } else {
                message.textContent = currentPlayer === "X" ? "Player 1 Wins!" : "Player 2 Wins!";
                if (currentPlayer === "X") {
                    playerWins++;
                    localStorage.setItem("playerWins", playerWins);
                } else {
                    computerWins++;
                    localStorage.setItem("computerWins", computerWins);
                }
            }
            updateScoreboard();
            isGameActive = false;
            setTimeout(showChoiceContainer, 2000);
            return;
        }

        if (!board.includes("")) {
            message.textContent = "Tie!";
            ties++;
            localStorage.setItem("ties", ties);
            updateScoreboard();
            isGameActive = false;
            setTimeout(showChoiceContainer, 2000);
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        message.textContent = currentPlayer === "X" ? "Player 1's turn (X)" : (isPlayingWithComputer ? "Computer's turn (O)" : "Player 2's turn (O)");
    }

    function updateScoreboard() {
        playerWinsElement.textContent = playerWins;
        computerWinsElement.textContent = computerWins;
        tiesElement.textContent = ties;
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        if (board[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

        if (isPlayingWithComputer && isGameActive && currentPlayer === "O") {
            setTimeout(computerMove, 500); 
        }
    }

    function computerMove() {
        const availableCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
        const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const computerCell = document.querySelector(`.cell[data-index="${randomCellIndex}"]`);
        handleCellPlayed(computerCell, randomCellIndex);
        handleResultValidation();
    }

    function restartGame() {
        isGameActive = true;
        board = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => cell.textContent = "");
        showPlayerChoice();
    }

    function resetData() {
        playerWins = 0;
        computerWins = 0;
        ties = 0;
        localStorage.setItem("playerWins", playerWins);
        localStorage.setItem("computerWins", computerWins);
        localStorage.setItem("ties", ties);
        updateScoreboard();
    }

    function showChoiceContainer() {
        choiceContainer.style.display = "block";
        gameContainer.style.display = "none";
        restartGame();
    }

    function showPlayerChoice() {
        playerChoiceContainer.style.display = "block";
        gameContainer.style.display = "none";
        choiceContainer.style.display = "none";
    }

    function startGameWithPlayerChoice(playerChoice) {
        currentPlayer = playerChoice;
        playerChoiceContainer.style.display = "none";
        gameContainer.style.display = "flex";
        choiceContainer.style.display = "none";
        message.textContent = currentPlayer === "X" ? "Player 1's turn (X)" : (isPlayingWithComputer ? "Computer's turn (O)" : "Player 2's turn (O)");
    }

    resetButton.addEventListener("click", restartGame);
    resetDataButton.addEventListener("click", resetData);
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));

    playerButton.addEventListener("click", () => {
        isPlayingWithComputer = false;
        showPlayerChoice();
    });

    computerButton.addEventListener("click", () => {
        isPlayingWithComputer = true;
        showPlayerChoice();
    });

    xButton.addEventListener("click", () => {
        startGameWithPlayerChoice("X");
    });

    oButton.addEventListener("click", () => {
        startGameWithPlayerChoice("O");
    });
});
