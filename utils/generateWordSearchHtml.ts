type WordSearchHtmlWord = {
  id: number;
  english: string;
  hint: string | null;
  phonemes: string[];
};

type WordSearchHtmlSettings = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
  words: WordSearchHtmlWord[];
};

const fillerPhonemes = [
  "p",
  "t",
  "k",
  "b",
  "d",
  "ɡ",
  "n",
  "m",
  "ŋ",
  "f",
  "s",
  "θ",
  "ʃ",
  "v",
  "z",
  "ð",
  "ʒ",
  "l",
  "ɹ",
  "w",
  "j",
  "h",
  "tʃ",
  "dʒ",
  "iː",
  "ɪ",
  "e",
  "æ",
  "ɐ",
  "ɐː",
  "ɜː",
  "ʉː",
  "ɔ",
  "oː",
  "ʊ",
  "æɪ",
  "ɑe",
  "oɪ",
  "əʉ",
  "æɔ",
  "ɪə",
  "eə",
  "ə",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replaceAll(
    "<",
    "\\u003c"
  );
}

function buildGrid(
  words: WordSearchHtmlWord[]
) {
  const longestWord = Math.max(
    0,
    ...words.map(
      (word) => word.phonemes.length
    )
  );

  const gridSize = Math.max(
    8,
    words.length,
    longestWord
  );

  const grid = Array.from(
    { length: gridSize },
    (_, rowIndex) =>
      Array.from(
        { length: gridSize },
        (_, columnIndex) => {
          const fillerIndex =
            (
              rowIndex * gridSize +
              columnIndex
            ) %
            fillerPhonemes.length;

          return fillerPhonemes[
            fillerIndex
          ];
        }
      )
  );

  words.forEach(
    (word, rowIndex) => {
      word.phonemes.forEach(
        (
          phoneme,
          columnIndex
        ) => {
          grid[rowIndex][
            columnIndex
          ] = phoneme;
        }
      );
    }
  );

  return grid;
}

export function generateWordSearchHtml({
  title,
  difficulty,
  showHints,
  words,
}: WordSearchHtmlSettings): string {
  const validWords = words.filter(
    (word) =>
      word.english.trim() !== "" &&
      word.phonemes.length > 0 &&
      word.phonemes.every(
        (phoneme) =>
          phoneme.trim() !== ""
      )
  );

  const grid =
    buildGrid(validWords);

  const safeTitle =
    escapeHtml(title);

  const wordCount =
    validWords.length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

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
      max-width: 1000px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
    }

    header h1 {
      margin-bottom: 8px;
    }

    .difficulty {
      color: #667085;
      text-transform: capitalize;
    }

    .game-layout {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr) 240px;
      gap: 25px;
      align-items: start;
    }

    .puzzle,
    .word-panel {
      background: white;
      border: 1px solid #dce3ea;
      border-radius: 12px;
      padding: 24px;
    }

    .grid {
      display: grid;
      gap: 5px;
      width: fit-content;
      max-width: 100%;
      margin: 10px auto 25px;
    }

    .cell {
      width: 48px;
      height: 48px;

      border: 2px solid #dce3ea;
      border-radius: 7px;

      background: #f4f7fb;
      color: #1d2939;

      font-size: 1.05rem;
      font-weight: bold;

      cursor: pointer;
    }

    .cell:hover {
      border-color: #315f8c;
    }

    .cell:focus-visible,
    .control:focus-visible {
      outline: 3px solid #8eb9df;
      outline-offset: 2px;
    }

    .cell.selected {
      background: #315f8c;
      border-color: #315f8c;
      color: white;
    }

    .message {
      min-height: 24px;
      font-weight: bold;
      text-align: center;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }

    .control {
      border: none;
      border-radius: 8px;

      padding: 11px 16px;

      background: #315f8c;
      color: white;

      font-weight: bold;
      cursor: pointer;
    }

    .word-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }

    .word-list li {
      display: flex;
      flex-direction: column;
      gap: 4px;

      padding: 10px 0;

      border-bottom:
        1px solid #dce3ea;
    }

    .word-list li:last-child {
      border-bottom: none;
    }

    .word-list span,
    .word-list small {
      color: #667085;
      font-size: 0.85rem;
    }

    .word-list .found strong,
    .word-list .found span,
    .word-list .found small {
      text-decoration: line-through;
      opacity: 0.65;
    }

    .word-count {
      font-weight: bold;
    }

    @media (max-width: 700px) {
      .game-layout {
        grid-template-columns: 1fr;
      }

      .word-panel {
        order: -1;
      }
    }

    @media (max-width: 500px) {
      .grid {
        width: 100%;
        gap: 3px;
      }

      .cell {
        width: 100%;
        height: 40px;
        font-size: 0.9rem;
      }

      .puzzle,
      .word-panel {
        padding: 16px;
      }
    }
  </style>
</head>

<body>
  <main class="game">

    <header>
      <h1>${safeTitle}</h1>

      <p>
        Find all ${wordCount}
        ${
          wordCount === 1
            ? "phoneme word"
            : "phoneme words"
        }
        hidden in the puzzle.
      </p>

      <p class="difficulty">
        Difficulty: ${difficulty}
      </p>
    </header>

    <div class="game-layout">

      <section class="puzzle">

        <div
          id="grid"
          class="grid"
          aria-label="Phoneme word search grid"
        ></div>

        <p
          id="message"
          class="message"
          aria-live="polite"
        >
          Select phonemes in the grid to find a word.
        </p>

        <div class="controls">

          <button
            type="button"
            class="control"
            onclick="checkSelection()"
          >
            Check Word
          </button>

          <button
            type="button"
            class="control"
            onclick="clearSelection()"
          >
            Clear Selection
          </button>

          <button
            type="button"
            class="control"
            onclick="resetGame()"
          >
            Reset
          </button>

        </div>
      </section>

      <aside class="word-panel">

        <h2>Words to Find</h2>

        <p id="hint-description"></p>

        <ul
          id="word-list"
          class="word-list"
        ></ul>

        <p
          id="word-count"
          class="word-count"
        >
          Found 0 of ${wordCount}
        </p>

      </aside>

    </div>
  </main>

  <script>
    const words =
      ${safeJson(validWords)};

    const gridData =
      ${safeJson(grid)};

    const difficulty =
      ${safeJson(difficulty)};

    const showHints =
      ${safeJson(showHints)};

    let selectedCells = [];
    let foundWordIds = [];

    const gridElement =
      document.getElementById("grid");

    const message =
      document.getElementById("message");

    const wordList =
      document.getElementById("word-list");

    const wordCount =
      document.getElementById("word-count");

    const hintDescription =
      document.getElementById(
        "hint-description"
      );

    function createGrid() {
      gridElement.innerHTML = "";

      const size =
        gridData.length;

      gridElement.style.gridTemplateColumns =
        "repeat(" +
        size +
        ", 48px)";

      gridData.forEach(
        function(
          row,
          rowIndex
        ) {
          row.forEach(
            function(
              symbol,
              columnIndex
            ) {
              const id =
                rowIndex +
                "-" +
                columnIndex;

              const button =
                document.createElement(
                  "button"
                );

              button.type =
                "button";

              button.className =
                "cell";

              button.textContent =
                symbol;

              button.setAttribute(
                "aria-label",
                "Phoneme " +
                  symbol +
                  ", row " +
                  (rowIndex + 1) +
                  ", column " +
                  (columnIndex + 1)
              );

              button.setAttribute(
                "aria-pressed",
                "false"
              );

              button.addEventListener(
                "click",
                function() {
                  selectCell(
                    id,
                    button
                  );
                }
              );

              gridElement.appendChild(
                button
              );
            }
          );
        }
      );
    }

    function selectCell(
      id,
      button
    ) {
      const index =
        selectedCells.indexOf(
          id
        );

      if (index !== -1) {
        selectedCells.splice(
          index,
          1
        );

        button.classList.remove(
          "selected"
        );

        button.setAttribute(
          "aria-pressed",
          "false"
        );
      } else {
        selectedCells.push(id);

        button.classList.add(
          "selected"
        );

        button.setAttribute(
          "aria-pressed",
          "true"
        );
      }
    }

    function selectedSymbols() {
      return selectedCells.map(
        function(id) {
          const parts =
            id.split("-");

          const row =
            Number(parts[0]);

          const column =
            Number(parts[1]);

          return gridData[
            row
          ][column];
        }
      );
    }

    function checkSelection() {
      if (
        selectedCells.length ===
        0
      ) {
        message.textContent =
          "Select at least one phoneme before checking.";

        return;
      }

      const symbols =
        selectedSymbols();

      const selectedWord =
        symbols.join("");

      const match =
        words.find(
          function(word) {
            return (
              word.phonemes.join(
                ""
              ) ===
              selectedWord
            );
          }
        );

      if (match) {
        if (
          foundWordIds.indexOf(
            match.id
          ) === -1
        ) {
          foundWordIds.push(
            match.id
          );

          message.textContent =
            "Found! /" +
            match.phonemes.join(
              " "
            ) +
            "/ = " +
            match.english;
        } else {
          message.textContent =
            match.english +
            " has already been found.";
        }
      } else {
        message.textContent =
          "That selection does not match a word. Try again.";
      }

      clearSelectedCells();
      renderWordList();
    }

    function clearSelectedCells() {
      selectedCells = [];

      document
        .querySelectorAll(
          ".cell.selected"
        )
        .forEach(
          function(cell) {
            cell.classList.remove(
              "selected"
            );

            cell.setAttribute(
              "aria-pressed",
              "false"
            );
          }
        );
    }

    function clearSelection() {
      clearSelectedCells();

      message.textContent =
        "Selection cleared.";
    }

    function renderWordList() {
      wordList.innerHTML = "";

      words.forEach(
        function(word) {
          const found =
            foundWordIds.indexOf(
              word.id
            ) !== -1;

          const item =
            document.createElement(
              "li"
            );

          if (found) {
            item.className =
              "found";
          }

          const phonemeText =
            document.createElement(
              "strong"
            );

          const englishText =
            document.createElement(
              "span"
            );

          if (found) {
            phonemeText.textContent =
              "/" +
              word.phonemes.join(
                " "
              ) +
              "/";

            englishText.textContent =
              word.english +
              " ✓";
          } else if (
            !showHints
          ) {
            phonemeText.textContent =
              "Hidden word";

            englishText.textContent =
              "Not found";
          } else if (
            difficulty ===
            "easy"
          ) {
            phonemeText.textContent =
              "/" +
              word.phonemes.join(
                " "
              ) +
              "/";

            englishText.textContent =
              word.english;
          } else if (
            difficulty ===
            "medium"
          ) {
            phonemeText.textContent =
              "/" +
              word.phonemes.join(
                " "
              ) +
              "/";

            englishText.textContent =
              "English answer hidden";
          } else {
            phonemeText.textContent =
              "Hidden word";

            englishText.textContent =
              "Not found";
          }

          item.appendChild(
            phonemeText
          );

          item.appendChild(
            englishText
          );

          if (
            !found &&
            showHints &&
            difficulty ===
              "easy" &&
            word.hint
          ) {
            const hintText =
              document.createElement(
                "small"
              );

            hintText.textContent =
              "Hint: " +
              word.hint;

            item.appendChild(
              hintText
            );
          }

          wordList.appendChild(
            item
          );
        }
      );

      wordCount.textContent =
        "Found " +
        foundWordIds.length +
        " of " +
        words.length;

      if (!showHints) {
        hintDescription.textContent =
          "Find each hidden phoneme word.";
      } else if (
        difficulty === "easy"
      ) {
        hintDescription.textContent =
          "Use the English words and phoneme forms as hints.";
      } else if (
        difficulty === "medium"
      ) {
        hintDescription.textContent =
          "Use the phoneme forms as hints.";
      } else {
        hintDescription.textContent =
          "Find each word without a word list hint.";
      }
    }

    function resetGame() {
      foundWordIds = [];

      clearSelectedCells();

      message.textContent =
        "Select phonemes in the grid to find a word.";

      renderWordList();
    }

    createGrid();
    renderWordList();
  </script>

</body>
</html>`;
}