"use client";

import { useEffect, useState } from "react";

import { phonemes } from "../data/phonemes";

import PhonemeButton from "./PhonemeButton";

type TileStatus = "correct" | "present" | "incorrect";

type CompletedGuess = {
  symbols: string[];
  statuses: TileStatus[];
};

type WordleGameProps = {
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
  targetWord: string[];
  englishWord: string;
};

export default function WordleGame({
  difficulty,
  showHints,
  targetWord,
  englishWord,
}: WordleGameProps) {
  const maxGuesses =
    difficulty === "easy"
      ? 6
      : difficulty === "medium"
        ? 5
        : 4;

  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<CompletedGuess[]>([]);

  const [message, setMessage] = useState(
    "Select phonemes from the keyboard to make a guess."
  );

  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Reset the game when a different database word is selected
  useEffect(() => {
    setCurrentGuess([]);
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);
    setMessage(
      "Select phonemes from the keyboard to make a guess."
    );
  }, [targetWord, englishWord]);

  function addPhoneme(symbol: string) {
    if (gameWon || gameOver) return;

    if (currentGuess.length < targetWord.length) {
      setCurrentGuess([...currentGuess, symbol]);
    }
  }

  function deletePhoneme() {
    if (gameWon || gameOver) return;

    setCurrentGuess(currentGuess.slice(0, -1));
  }

  function checkGuess(symbols: string[]): TileStatus[] {
    const statuses: TileStatus[] = symbols.map(
      () => "incorrect"
    );

    const remainingTarget = [...targetWord];

    // First pass: find phonemes in the correct position
    symbols.forEach((symbol, index) => {
      if (symbol === targetWord[index]) {
        statuses[index] = "correct";
        remainingTarget[index] = "";
      }
    });

    // Second pass: find phonemes present in another position
    symbols.forEach((symbol, index) => {
      if (statuses[index] === "correct") return;

      const foundIndex = remainingTarget.indexOf(symbol);

      if (foundIndex !== -1) {
        statuses[index] = "present";
        remainingTarget[foundIndex] = "";
      }
    });

    return statuses;
  }

  function submitGuess() {
    if (gameWon || gameOver) return;

    if (targetWord.length === 0) {
      setMessage("No target word has been selected.");
      return;
    }

    if (currentGuess.length !== targetWord.length) {
      setMessage(
        `Choose ${targetWord.length} phonemes before submitting.`
      );

      return;
    }

    const statuses = checkGuess(currentGuess);

    const newGuesses = [
      ...guesses,
      {
        symbols: [...currentGuess],
        statuses,
      },
    ];

    setGuesses(newGuesses);

    const isCorrect = currentGuess.every(
      (symbol, index) => symbol === targetWord[index]
    );

    if (isCorrect) {
      setGameWon(true);

      setMessage(
        `Correct! /${targetWord.join(" ")}/ = ${englishWord}`
      );
    } else if (newGuesses.length >= maxGuesses) {
      setGameOver(true);

      setMessage(
        `Game over. The answer was ${englishWord}.`
      );
    } else {
      setMessage(
        "Not quite. Try another combination of phonemes."
      );
    }

    setCurrentGuess([]);
  }

  function resetGame() {
    setCurrentGuess([]);
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);

    setMessage(
      "Select phonemes from the keyboard to make a guess."
    );
  }

  if (targetWord.length === 0) {
    return (
      <div className="wordle-game">
        <section className="wordle-panel">
          <div className="wordle-instructions">
            <h3>Activity Preview</h3>

            <p>
              Select a stored database word to preview the
              Wordle activity.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="wordle-game">
      <section className="wordle-panel">
        <div className="wordle-instructions">
          <h3>Activity Preview</h3>

          <p>
            Build a {targetWord.length}-phoneme word.
            Each tile represents one phoneme rather than one
            English letter. You have {maxGuesses} attempts.
          </p>
        </div>

        <div
          className="wordle-board"
          aria-label="Wordle guess board"
        >
          {Array.from({ length: maxGuesses }).map(
            (_, rowIndex) => {
              const completedGuess = guesses[rowIndex];

              const isCurrentRow =
                rowIndex === guesses.length && !gameOver;

              return (
                <div
                  className="wordle-row"
                  key={rowIndex}
                >
                  {targetWord.map((_, columnIndex) => {
                    const completedSymbol =
                      completedGuess?.symbols[columnIndex] ?? "";

                    const currentSymbol = isCurrentRow
                      ? currentGuess[columnIndex] ?? ""
                      : "";

                    const status =
                      completedGuess?.statuses[columnIndex];

                    return (
                      <div
                        key={columnIndex}
                        className={`wordle-tile ${
                          status ? `tile-${status}` : ""
                        }`}
                        aria-label={
                          status
                            ? `${completedSymbol}: ${status}`
                            : currentSymbol ||
                              "Empty phoneme tile"
                        }
                      >
                        {completedSymbol || currentSymbol}
                      </div>
                    );
                  })}
                </div>
              );
            }
          )}
        </div>

        {difficulty !== "hard" && (
          <div
            className="wordle-legend"
            aria-label="Guess feedback legend"
          >
            <span>
              <strong>Correct:</strong> right phoneme,
              right position
            </span>

            <span>
              <strong>Present:</strong> right phoneme,
              different position
            </span>

            <span>
              <strong>Incorrect:</strong> phoneme is not
              in the answer
            </span>
          </div>
        )}

        <p
          className="game-message"
          aria-live="polite"
        >
          {message}
        </p>

        <div className="wordle-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={deletePhoneme}
          >
            Delete
          </button>

          <button
            type="button"
            className="primary-action-button"
            onClick={submitGuess}
          >
            Submit Guess
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

      <section className="keyboard-section">
        <h3>Phoneme Keyboard</h3>

        <p>
          {showHints
            ? "Hover over a phoneme or focus it with the keyboard to see its English sound hint."
            : "Select phonemes from the keyboard to build your guess."}
        </p>

        <div className="phoneme-keyboard">
          {phonemes.map((phoneme) => (
            <PhonemeButton
              key={phoneme.symbol}
              symbol={phoneme.symbol}
              label={showHints ? phoneme.label : ""}
              example={showHints ? phoneme.example : ""}
              onClick={addPhoneme}
            />
          ))}
        </div>
      </section>
    </div>
  );
}