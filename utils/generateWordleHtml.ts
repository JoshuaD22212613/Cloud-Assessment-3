type WordleHtmlSettings = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
  targetWord: string[];
  englishWord: string;
  hint?: string | null;
};

export function generateWordleHtml({
  title,
  difficulty,
  showHints,
  targetWord,
  englishWord,
  hint,
}: WordleHtmlSettings): string {
  const maxGuesses =
    difficulty === "easy"
      ? 6
      : difficulty === "medium"
        ? 5
        : 4;

  const keyboard = [
    ["p", "P", "pin"],
    ["t", "T", "top"],
    ["k", "K", "cat"],
    ["b", "B", "bat"],
    ["d", "D", "dog"],
    ["ɡ", "G", "go"],
    ["n", "N", "net"],
    ["m", "M", "mat"],
    ["ŋ", "NG", "sing"],
    ["f", "F", "fish"],
    ["s", "S", "sun"],
    ["θ", "TH", "thin"],
    ["ʃ", "SH", "ship"],
    ["v", "V", "van"],
    ["z", "Z", "zip"],
    ["ð", "TH", "then"],
    ["ʒ", "ZH", "vision"],
    ["l", "L", "log"],
    ["ɹ", "R", "ring"],
    ["w", "W", "win"],
    ["j", "Y", "yes"],
    ["h", "H", "hat"],
    ["tʃ", "CH", "chin"],
    ["dʒ", "J", "jam"],
    ["iː", "EE", "see"],
    ["ɪ", "I", "sit"],
    ["e", "E", "bed"],
    ["æ", "A", "bad"],
    ["ɐ", "U", "sun"],
    ["ɐː", "AR", "bark"],
    ["ɜː", "ER", "bird"],
    ["ʉː", "OO", "boot"],
    ["ɔ", "O", "log"],
    ["oː", "OR", "fork"],
    ["ʊ", "OO", "book"],
    ["æɪ", "AY", "bait"],
    ["ɑe", "I", "bike"],
    ["oɪ", "OY", "boil"],
    ["əʉ", "OA", "boat"],
    ["æɔ", "OW", "cloud"],
    ["ɪə", "EAR", "beard"],
    ["eə", "AIR", "chair"],
    ["ə", "UH", "about"],
  ];

  const safeTitle = title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${safeTitle}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px 20px;
      background: #f4f7fb;
      color: #1d2939;
      font-family: Arial, Helvetica, sans-serif;
    }

    .game {
      max-width: 850px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      margin-bottom: 8px;
    }

    .difficulty {
      color: #667085;
      text-transform: capitalize;
    }

    .hint {
      max-width: 500px;
      margin: 12px auto 0;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid #dce3ea;
      border-radius: 8px;
      color: #475467;
    }

    .board {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin: 25px 0;
    }

    .row {
      display: flex;
      gap: 8px;
    }

    .tile {
      width: 62px;
      height: 62px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 2px solid #cfd8e3;
      border-radius: 8px;

      background: white;
      font-size: 1.4rem;
      font-weight: bold;
    }

    .correct {
      background: #15803d;
      border-color: #15803d;
      color: white;
    }

    .present {
      background: #a16207;
      border-color: #a16207;
      color: white;
    }

    .incorrect {
      background: #475467;
      border-color: #475467;
      color: white;
    }

    .message {
      min-height: 24px;
      text-align: center;
      font-weight: bold;
      margin: 20px 0;
    }

    .keyboard {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 7px;

      max-width: 700px;
      margin: 20px auto;
    }

    .key {
      min-height: 48px;

      border: 1px solid #cfd8e3;
      border-radius: 7px;

      background: white;
      color: #1d2939;

      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
    }

    .key:hover,
    .key:focus-visible {
      border-color: #315f8c;
      background: #e8eef5;
    }

    .key:focus-visible,
    .control:focus-visible {
      outline: 3px solid #8eb9df;
      outline-offset: 2px;
    }

    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }

    .control {
      border: none;
      border-radius: 8px;
      padding: 11px 18px;

      background: #315f8c;
      color: white;

      font-weight: bold;
      cursor: pointer;
    }

    .legend {
      max-width: 500px;
      margin: 20px auto;
      padding: 15px;

      background: white;
      border: 1px solid #dce3ea;
      border-radius: 8px;
    }

    .legend span {
      display: block;
      margin: 5px 0;
    }

    @media (max-width: 600px) {
      .keyboard {
        grid-template-columns: repeat(5, 1fr);
      }

      .tile {
        width: 55px;
        height: 55px;
      }

      .controls {
        flex-wrap: wrap;
      }
    }
  </style>
</head>

<body>

  <main class="game">

    <header>
      <h1>${safeTitle}</h1>

      <p>
        Build the ${targetWord.length}-phoneme word.
      </p>

      <p class="difficulty">
        Difficulty: ${difficulty} — ${maxGuesses} attempts
      </p>

      ${
        showHints && hint
          ? `
      <p class="hint">
        Hint: ${hint
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;")}
      </p>
      `
          : ""
      }
    </header>

    <div
      id="board"
      class="board"
      aria-label="Wordle guess board"
    ></div>

    ${
      difficulty !== "hard"
        ? `
    <div class="legend">
      <span>
        <strong>Correct:</strong>
        right phoneme, right position
      </span>

      <span>
        <strong>Present:</strong>
        right phoneme, different position
      </span>

      <span>
        <strong>Incorrect:</strong>
        phoneme is not in the answer
      </span>
    </div>
    `
        : ""
    }

    <p
      id="message"
      class="message"
      aria-live="polite"
    >
      Select phonemes to make a guess.
    </p>

    <div
      id="keyboard"
      class="keyboard"
      aria-label="Phoneme keyboard"
    ></div>

    <div class="controls">
      <button
        class="control"
        type="button"
        onclick="deletePhoneme()"
      >
        Delete
      </button>

      <button
        class="control"
        type="button"
        onclick="submitGuess()"
      >
        Submit Guess
      </button>

      <button
        class="control"
        type="button"
        onclick="resetGame()"
      >
        Reset
      </button>
    </div>

  </main>

    <script>
    const targetWord = ${JSON.stringify(targetWord)};
    const englishWord = ${JSON.stringify(englishWord)};
    const maxGuesses = ${maxGuesses};

    function normalizePhoneme(value) {
      return String(value ?? "").trim().normalize("NFC");
    }

    const normalizedTargetWord = targetWord.map(normalizePhoneme);

    const keyboardData = ${JSON.stringify(keyboard)};

    let currentGuess = [];
    let guesses = [];
    let gameFinished = false;

    const board = document.getElementById("board");
    const keyboardElement =
      document.getElementById("keyboard");
    const message =
      document.getElementById("message");

    function createBoard() {
      board.innerHTML = "";

      for (
        let row = 0;
        row < maxGuesses;
        row++
      ) {
        const rowElement =
          document.createElement("div");

        rowElement.className = "row";

        for (
          let column = 0;
          column < normalizedTargetWord.length;
          column++
        ) {
          const tile =
            document.createElement("div");

          tile.className = "tile";
          tile.id =
            "tile-" + row + "-" + column;

          rowElement.appendChild(tile);
        }

        board.appendChild(rowElement);
      }

      updateCurrentRow();
    }

    function createKeyboard() {
      keyboardElement.innerHTML = "";

      keyboardData.forEach(function(item) {
        const symbol = item[0];
        const label = item[1];
        const example = item[2];

        const button =
          document.createElement("button");

        button.type = "button";
        button.className = "key";
        button.textContent = symbol;

        ${
          showHints
            ? `
        button.title =
          "/" +
          symbol +
          "/ — " +
          label +
          " (as in " +
          example +
          ")";

        button.setAttribute(
          "aria-label",
          symbol +
            ", " +
            label +
            ", as in " +
            example
        );
        `
            : `
        button.setAttribute(
          "aria-label",
          symbol
        );
        `
        }

        button.addEventListener(
          "click",
          function() {
            addPhoneme(symbol);
          }
        );

        keyboardElement.appendChild(button);
      });
    }

    function addPhoneme(symbol) {
      if (gameFinished) {
        return;
      }

      if (
        currentGuess.length <
        normalizedTargetWord.length
      ) {
        currentGuess.push(symbol);
        updateCurrentRow();
      }
    }

    function deletePhoneme() {
      if (gameFinished) {
        return;
      }

      currentGuess.pop();
      updateCurrentRow();
    }

    function updateCurrentRow() {
      if (guesses.length >= maxGuesses) {
        return;
      }

      for (
        let column = 0;
        column < normalizedTargetWord.length;
        column++
      ) {
        const tile =
          document.getElementById(
            "tile-" +
              guesses.length +
              "-" +
              column
          );

        if (tile) {
          tile.textContent =
            currentGuess[column] || "";
        }
      }
    }

    function checkGuess(guess) {
      const statuses =
        guess.map(function() {
          return "incorrect";
        });

      const normalizedGuess =
        guess.map(normalizePhoneme);

      const remaining =
        normalizedTargetWord.slice();

      guess.forEach(
        function(symbol, index) {
          if (
            normalizedGuess[index] ===
            normalizedTargetWord[index]
          ) {
            statuses[index] = "correct";
            remaining[index] = "";
          }
        }
      );

      guess.forEach(
        function(symbol, index) {
          if (
            statuses[index] === "correct"
          ) {
            return;
          }

          const foundIndex =
            remaining.indexOf(
              normalizedGuess[index]
            );

          if (foundIndex !== -1) {
            statuses[index] = "present";
            remaining[foundIndex] = "";
          }
        }
      );

      return statuses;
    }

    function submitGuess() {
      if (gameFinished) {
        return;
      }

      if (
        currentGuess.length !==
        normalizedTargetWord.length
      ) {
        message.textContent =
          "Choose " +
          normalizedTargetWord.length +
          " phonemes before submitting.";

        return;
      }

      const statuses =
        checkGuess(currentGuess);

      const rowIndex = guesses.length;

      currentGuess.forEach(
        function(symbol, column) {
          const tile =
            document.getElementById(
              "tile-" +
                rowIndex +
                "-" +
                column
            );

          if (tile) {
            tile.textContent = symbol;
            tile.classList.add(
              statuses[column]
            );
          }
        }
      );

      const correct =
        currentGuess.every(
          function(symbol, index) {
            return (
              normalizePhoneme(symbol) ===
              normalizedTargetWord[index]
            );
          }
        );

      guesses.push(
        currentGuess.slice()
      );

      if (correct) {
        message.textContent =
          "Correct! /" +
          normalizedTargetWord.join(" ") +
          "/ = " +
          englishWord;

        gameFinished = true;
        currentGuess = [];

        return;
      }

      if (
        guesses.length >= maxGuesses
      ) {
        message.textContent =
          "Game over. The answer was " +
          englishWord +
          ".";

        gameFinished = true;
        currentGuess = [];

        return;
      }

      currentGuess = [];

      message.textContent =
        "Not quite. Try another combination.";

      updateCurrentRow();
    }

    function resetGame() {
      currentGuess = [];
      guesses = [];
      gameFinished = false;

      message.textContent =
        "Select phonemes to make a guess.";

      createBoard();
    }

    createBoard();
    createKeyboard();
  </script>

  </body>
</html>`;
}