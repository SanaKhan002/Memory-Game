document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const gameButtons = document.querySelectorAll('.game-button');

    const words = [
        { word: 'apple', hint: 'A fruit that keeps the doctor away.' },
        { word: 'banana', hint: 'A yellow fruit that monkeys love.' },
        { word: 'grape', hint: 'A small, round fruit often used to make wine.' },
        { word: 'orange', hint: 'A citrus fruit that is orange in color.' },
        { word: 'strawberry', hint: 'A red fruit with tiny seeds on its surface.' }
    ];

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameType = button.dataset.game;
            gameArea.innerHTML = ''; 
            if (gameType === 'guessWord') {
                startGuessTheWord();
            } else if (gameType === 'ticTacToe') {
                startTicTacToe();
            } else if (gameType === 'memory') {
                startMemoryGame();
            } else if (gameType === 'hangman') {
                startHangman();
            }
        });
    });

    function startGuessTheWord() {
        let wordIndex = 0;
        let score = 0;

        function displayQuestion() {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerText = `Guess the word: ${words[wordIndex].hint}`;
            gameArea.appendChild(questionElement);

            const inputField = document.createElement('input');
            inputField.type = 'text';
            gameArea.appendChild(inputField);

            const submitButton = document.createElement('button');
            submitButton.innerText = 'Submit';
            gameArea.appendChild(submitButton);

            submitButton.addEventListener('click', () => {
                const userGuess = inputField.value.toLowerCase();
                const correctAnswer = words[wordIndex].word.toLowerCase();
                if (userGuess === correctAnswer) {
                    score++;
                    wordIndex++;
                    inputField.value = ''; 
                    if (wordIndex < words.length) {
                        gameArea.innerHTML = ''; 
                        displayQuestion();
                    } else {
                        showResult(`Congratulations! Your score is: ${score} / ${words.length}`);
                    }
                } else {
                    showResult(`Wrong guess! The correct answer was: ${correctAnswer}. Your score is: ${score} / ${words.length}`);
                }
            });
        }

        function showResult(message) {
            const result = document.createElement('div');
            result.classList.add('result');
            result.innerText = message;
            gameArea.appendChild(result);

            const playAgainButton = document.createElement('button');
            playAgainButton.innerText = 'Play Again';
            playAgainButton.classList.add('play-again-button');
            gameArea.appendChild(playAgainButton);

            playAgainButton.addEventListener('click', () => {
                gameArea.innerHTML = ''; 
                wordIndex = 0; 
                score = 0; 
                displayQuestion(); 
            });
        }

        displayQuestion(); 
    }
    
    function startTicTacToe() {
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';

        const grid = document.createElement('div');
        grid.classList.add('grid');
        gameArea.appendChild(grid);

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => makeMove(i));
            grid.appendChild(cell);
        }

        function makeMove(index) {
            if (board[index] === '' && !checkWinner()) {
                board[index] = currentPlayer;
                renderBoard();
                if (checkWinner()) {
                    showResult(`${currentPlayer} wins!`);
                } else if (board.every(cell => cell !== '')) {
                    showResult('It\'s a tie!');
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
                }
            }
        }

        function renderBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                cell.innerText = board[index];
            });
        }

        function checkWinner() {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            return winningCombinations.some(combination => {
                const [a, b, c] = combination;
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        }

        function showResult(message) {
            const result = document.createElement('div');
            result.classList.add('result');
            result.innerText = message;
            gameArea.appendChild(result);

            const playAgainButton = document.createElement('button');
            playAgainButton.innerText = 'Play Again';
            playAgainButton.classList.add('play-again-button');
            gameArea.appendChild(playAgainButton);

            playAgainButton.addEventListener('click', () => {
                gameArea.innerHTML = ''; 
                startTicTacToe(); 
            });
        }
    }

    
    function startMemoryGame() {
        const cardValues = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍', '🍉', '🍒'];
        const cards = [...cardValues, ...cardValues]; 
        let firstCard = null;
        let secondCard = null;
        let matches = 0;
        let attempts = 0;
        let timer;
        let seconds = 0;

        cards.sort(() => 0.5 - Math.random());

        const grid = document.createElement('div');
        grid.classList.add('grid');
        gameArea.appendChild(grid);

        cards.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('cell');
            card.dataset.index = index;
            card.dataset.value = value;
            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });

        function flipCard(card) {
            if (firstCard && secondCard) return; 

            card.innerText = card.dataset.value; 
            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                attempts++;
                checkMatch();
            }
        }

        function checkMatch() {
            if (firstCard.dataset.value === secondCard.dataset.value) {
                matches++;
                resetCards();
                if (matches === cardValues.length) {
                    clearInterval(timer);
                    showResult(`You won! It took ${seconds} seconds and ${attempts} attempts.`);
                }
            } else {
                setTimeout(() => {
                    firstCard.innerText = '';
                    secondCard.innerText = '';
                    resetCards();
                }, 1000);
            }
        }

        function resetCards() {
            firstCard = null;
            secondCard = null;
        }

        function showResult(message) {
            const result = document.createElement('div');
            result.classList.add('result');
            result.innerText = message;
            gameArea.appendChild(result);

            const playAgainButton = document.createElement('button');
            playAgainButton.innerText = 'Play Again';
            playAgainButton.classList.add('play-again-button');
            gameArea.appendChild(playAgainButton);

            playAgainButton.addEventListener('click', () => {
                gameArea.innerHTML = ''; 
                startMemoryGame(); 
            });
        }
       
        timer = setInterval(() => {
            seconds++;
        }, 1000);
    }
    
    function startHangman() {
        const words = [
            { word: 'apple', hint: 'A fruit that keeps the doctor away.' },
            { word: 'banana', hint: 'A yellow fruit that monkeys love.' },
            { word: 'grape', hint: 'A small, round fruit often used to make wine.' },
            { word: 'orange', hint: 'A citrus fruit that is orange in color.' },
            { word: 'strawberry', hint: 'A red fruit with tiny seeds on its surface.' }
        ];
    
        let wordIndex = 0;
        let guessedLetters = [];
        let wrongGuesses = 0;
        const maxWrongGuesses = 6;
    
        function displayWord() {
            const currentWord = words[wordIndex].word;
            const wordDisplay = currentWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
            const hintDisplay = words[wordIndex].hint;
    
            gameArea.innerHTML = `
                <div class="question">Guess the word: ${wordDisplay}</div>
                <div class="hint">Hint: ${hintDisplay}</div>
                <input type="text" id="letterInput" maxlength="1" />
                <button id="submitLetter">Submit</button>
                <div class="result"></div>
                <div class="wrong-guesses">Wrong guesses left: ${maxWrongGuesses - wrongGuesses}</div>
            `;
    
            document.getElementById('submitLetter').addEventListener('click', handleGuess);
    
            document.getElementById('letterInput').addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    handleGuess();
                }
            });
        }
    
        function handleGuess() {
            const input = document.getElementById('letterInput').value.toLowerCase();
            if (input && !guessedLetters.includes(input) && /^[a-z]$/.test(input)) {
                guessedLetters.push(input);
                if (!words[wordIndex].word.includes(input)) {
                    wrongGuesses++;
                }
                if (wrongGuesses >= maxWrongGuesses) {
                    showResult(`Game Over! The word was: ${words[wordIndex].word}.`);
                } else if (words[wordIndex].word.split('').every(letter => guessedLetters.includes(letter))) {
                    showResult(`Congratulations! You guessed the word: ${words[wordIndex].word}!`);
                } else {
                    displayWord();
                }
            } else {
                alert('Please enter a valid letter that you haven\'t guessed yet.');
            }
            document.getElementById('letterInput').value = '';
        }
    
        function showResult(message) {
            const result = document.querySelector('.result');
            result.innerText = message;
    
            const playAgainButton = document.createElement('button');
            playAgainButton.innerText = 'Play Again';
            gameArea.appendChild(playAgainButton);
    
            playAgainButton.addEventListener('click', () => {
                gameArea.innerHTML = '';
                wordIndex = (wordIndex + 1) % words.length;
                guessedLetters = [];
                wrongGuesses = 0;
                displayWord();
            });
        }
    
        displayWord();
    }
    
    
    window.onload = startHangman;
    
});
