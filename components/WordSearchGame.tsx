"use client";

import { useEffect, useMemo, useState } from "react";

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
  wordId: number;
};

export type WordSearchStoredWord = {
  id: number;
  text: string;
  hint: string | null;
  wordListId: number;
  phonemes: Phoneme[];
};

type WordSearchGameProps = {
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
  words: WordSearchStoredWord[];
};

type GameWord = {
  id: number;
  english: string;
  hint: string | null;
  phonemes: string[];
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

function buildGrid(words: GameWord[]) {
  const longestWord = Math.max(
    0,
    ...words.map((word) => word.phonemes.length)
  );

  /*
  Minimum 8x8 to preserve the original activity appearance.
  */
  const gridSize = Math.max(
    8,
    longestWord,
    words.length
  );

  const grid = Array.from(
    { length: gridSize },
    (_, rowIndex) =>
      Array.from(
        { length: gridSize },
        (_, columnIndex) => {
          const fillerIndex =
            (rowIndex * gridSize + columnIndex) %
            fillerPhonemes.length;

          return fillerPhonemes[fillerIndex];
        }
      )
  );

  /*
    Each word is placed horizontally on its own row.
    One phoneme occupies one grid cell, including
    multi-character phonemes such as tʃ and eə.
  */
  words.forEach((word, rowIndex) => {
    word.phonemes.forEach(
      (phoneme, columnIndex) => {
        grid[rowIndex][columnIndex] = phoneme;
      }
    );
  });

  return grid;
}

export default function WordSearchGame({
  difficulty,
  showHints,
  words,
}: WordSearchGameProps) {
  const gameWords = useMemo<GameWord[]>(
    () =>
      words
        .map((word) => ({
          id: word.id,
          english: word.text,
          hint: word.hint,
          phonemes: word.phonemes
            .slice()
            .sort(
              (a, b) =>
                a.position - b.position
            )
            .map(
              (phoneme) =>
                phoneme.symbol.trim()
            )
            .filter(Boolean),
        }))
        .filter(
          (word) =>
            word.english.trim() !== "" &&
            word.phonemes.length > 0
        ),
    [words]
  );

  const grid = useMemo(
    () => buildGrid(gameWords),
    [gameWords]
  );

  const [selectedCells, setSelectedCells] =
    useState<string[]>([]);

  const [foundWordIds, setFoundWordIds] =
    useState<number[]>([]);

  const [message, setMessage] = useState(
    "Select phonemes in the grid to find a word."
  );

  /*
    Reset the game whenever the selected database
    word list changes.
  */
  useEffect(() => {
    setSelectedCells([]);
    setFoundWordIds([]);
    setMessage(
      "Select phonemes in the grid to find a word."
    );
  }, [words]);

  function selectCell(
    row: number,
    column: number
  ) {
    const id = `${row}-${column}`;

    if (selectedCells.includes(id)) {
      setSelectedCells(
        selectedCells.filter(
          (selectedId) =>
            selectedId !== id
        )
      );
    } else {
      setSelectedCells([
        ...selectedCells,
        id,
      ]);
    }
  }

  function checkSelection() {
    if (selectedCells.length === 0) {
      setMessage(
        "Select at least one phoneme before checking."
      );
      return;
    }

    const selectedSymbols =
      selectedCells.map((id) => {
        const [row, column] = id
          .split("-")
          .map(Number);

        return grid[row]?.[column] ?? "";
      });

    const selectedWord =
      selectedSymbols.join("");

    const match = gameWords.find(
      (word) =>
        word.phonemes.join("") ===
        selectedWord
    );

    if (match) {
      if (
        !foundWordIds.includes(match.id)
      ) {
        setFoundWordIds([
          ...foundWordIds,
          match.id,
        ]);

        setMessage(
          `Found! /${match.phonemes.join(
            " "
          )}/ = ${match.english}`
        );
      } else {
        setMessage(
          `${match.english} has already been found.`
        );
      }
    } else {
      setMessage(
        "That selection does not match a word. Try again."
      );
    }

    setSelectedCells([]);
  }

  function clearSelection() {
    setSelectedCells([]);

    setMessage(
      "Selection cleared."
    );
  }

  function resetGame() {
    setSelectedCells([]);
    setFoundWordIds([]);

    setMessage(
      "Select phonemes in the grid to find a word."
    );
  }

  if (gameWords.length === 0) {
    return (
      <div className="word-search-game">
        <section className="word-search-panel">
          <h3>Activity Preview</h3>

          <p className="game-message">
            This word list does not contain
            any valid phoneme words yet.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="word-search-game">
      <section className="word-search-panel">
        <h3>Activity Preview</h3>

        <p>
          Find all {gameWords.length}{" "}
          {gameWords.length === 1
            ? "phoneme word"
            : "phoneme words"}{" "}
          hidden in the grid. Difficulty:{" "}
          <strong>{difficulty}</strong>.
        </p>

        <div
          className="word-search-grid"
          aria-label="Phoneme word search grid"
          style={{
            gridTemplateColumns:
              `repeat(${grid.length}, minmax(0, 1fr))`,
          }}
        >
          {grid.map(
            (row, rowIndex) =>
              row.map(
                (
                  symbol,
                  columnIndex
                ) => {
                  const id =
                    `${rowIndex}-${columnIndex}`;

                  const selected =
                    selectedCells.includes(
                      id
                    );

                  return (
                    <button
                      type="button"
                      key={id}
                      className={`word-search-cell ${
                        selected
                          ? "selected-cell"
                          : ""
                      }`}
                      onClick={() =>
                        selectCell(
                          rowIndex,
                          columnIndex
                        )
                      }
                      aria-pressed={
                        selected
                      }
                      aria-label={`Phoneme ${symbol}, row ${
                        rowIndex + 1
                      }, column ${
                        columnIndex + 1
                      }`}
                    >
                      {symbol}
                    </button>
                  );
                }
              )
          )}
        </div>

        <p
          className="game-message"
          aria-live="polite"
        >
          {message}
        </p>

        <div className="wordle-actions">
          <button
            type="button"
            className="primary-action-button"
            onClick={checkSelection}
          >
            Check Word
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={clearSelection}
          >
            Clear Selection
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </section>

      <aside className="word-list-panel">
        <h3>Words to Find</h3>

        <p>
          {difficulty === "easy"
            ? "Use the English words and phoneme forms as hints."
            : difficulty === "medium"
              ? "Use the phoneme forms as hints."
              : "Find each hidden phoneme word without a word list hint."}
        </p>

        <ul className="word-search-list">
          {gameWords.map((word) => {
            const found =
              foundWordIds.includes(
                word.id
              );

            return (
              <li
                key={word.id}
                className={
                  found
                    ? "found-word"
                    : ""
                }
              >
                <strong>
                  {found
                    ? `/${word.phonemes.join(
                        " "
                      )}/`
                    : !showHints
                      ? "Hidden word"
                      : difficulty ===
                            "easy" ||
                          difficulty ===
                            "medium"
                        ? `/${word.phonemes.join(
                            " "
                          )}/`
                        : "Hidden word"}
                </strong>

                <span>
                  {found
                    ? `${word.english} ✓`
                    : !showHints
                      ? "Not found"
                      : difficulty ===
                            "easy"
                        ? word.english
                        : difficulty ===
                            "medium"
                          ? "English answer hidden"
                          : "Not found"}
                </span>

                {showHints &&
                  difficulty ===
                    "easy" &&
                  word.hint &&
                  !found && (
                    <small>
                      Hint: {word.hint}
                    </small>
                  )}
              </li>
            );
          })}
        </ul>

        <p className="word-count">
          Found {foundWordIds.length} of{" "}
          {gameWords.length}
        </p>
      </aside>
    </div>
  );
}