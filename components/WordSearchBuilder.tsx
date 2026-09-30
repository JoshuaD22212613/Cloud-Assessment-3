"use client";

import { useEffect, useState } from "react";

import WordSearchGame from "./WordSearchGame";

import { generateWordSearchHtml } from "../utils/generateWordSearchHtml";

export type WordSearchDifficulty =
  | "easy"
  | "medium"
  | "hard";

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
  wordId: number;
};

type StoredWord = {
  id: number;
  text: string;
  hint: string | null;
  wordListId: number;
  phonemes: Phoneme[];
};

export default function WordSearchBuilder() {
  const [activityTitle, setActivityTitle] =
    useState("Phoneme Word Search");

  const [difficulty, setDifficulty] =
    useState<WordSearchDifficulty>("easy");

  const [showHints, setShowHints] =
    useState(true);

  const [wordLists, setWordLists] =
    useState<WordList[]>([]);

  const [words, setWords] =
    useState<StoredWord[]>([]);

  const [
    selectedWordListId,
    setSelectedWordListId,
  ] = useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  useEffect(() => {
    async function loadDatabaseData() {
      try {
        setLoading(true);
        setError("");

        const [
          wordListsResponse,
          wordsResponse,
        ] = await Promise.all([
          fetch("/api/wordlists"),
          fetch("/api/words"),
        ]);

        if (!wordListsResponse.ok) {
          throw new Error(
            "Failed to load word lists."
          );
        }

        if (!wordsResponse.ok) {
          throw new Error(
            "Failed to load words."
          );
        }

        const wordListsData: WordList[] =
          await wordListsResponse.json();

        const wordsData: StoredWord[] =
          await wordsResponse.json();

        setWordLists(wordListsData);
        setWords(wordsData);

        if (wordListsData.length > 0) {
          setSelectedWordListId(
            wordListsData[0].id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load Word Search data:",
          error
        );

        setError(
          "Unable to load stored words. Please check the backend and database."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDatabaseData();
  }, []);

  const selectedWords =
    words.filter(
      (word) =>
        word.wordListId ===
        selectedWordListId
    );

  function handleWordListChange(
    wordListId: number
  ) {
    setSelectedWordListId(
      wordListId
    );

    setError("");
    setSaveMessage("");
    setSaveError("");
  }

  function getGridSize() {
    if (selectedWords.length === 0) {
      return 8;
    }

    const longestWord =
      Math.max(
        ...selectedWords.map(
          (word) =>
            word.phonemes.length
        )
      );

    return Math.max(
      8,
      selectedWords.length,
      longestWord
    );
  }

  async function saveConfiguration() {
    setSaveMessage("");
    setSaveError("");

    if (!activityTitle.trim()) {
      setSaveError(
        "Please enter an activity title."
      );
      return;
    }

    if (!selectedWordListId) {
      setSaveError(
        "Please select a word list."
      );
      return;
    }

    if (selectedWords.length === 0) {
      setSaveError(
        "The selected word list must contain at least one word."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/activities",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                activityTitle.trim(),

              type:
                "WORD_SEARCH",

              difficulty:
                difficulty.toUpperCase(),

              showHints,

              gridSize:
                getGridSize(),

              maxGuesses:
                null,

              wordListId:
                selectedWordListId,

              targetWordId:
                null,
            }),
          }
        );

      let data: {
        id?: number;
        error?: string;
      } | null = null;

      try {
        data =
          await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save configuration."
        );
      }

      setSaveMessage(
        `Configuration saved successfully. Activity ID: ${data?.id}`
      );
    } catch (error) {
      console.error(
        "Failed to save Word Search configuration:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save the configuration."
      );
    } finally {
      setSaving(false);
    }
  }

  function downloadHtml() {
    if (!selectedWordListId) {
      setError(
        "Please select a stored word list before generating the activity."
      );
      return;
    }

    if (selectedWords.length === 0) {
      setError(
        "The selected word list does not contain any words."
      );
      return;
    }

    const html =
  generateWordSearchHtml({
    title:
      activityTitle ||
      "Phoneme Word Search",

    difficulty,
    showHints,

    words: selectedWords.map(
      (word) => ({
        id: word.id,
        english: word.text,
        hint: word.hint,

        phonemes: word.phonemes
          .slice()
          .sort(
            (a, b) =>
              a.position -
              b.position
          )
          .map(
            (phoneme) =>
              phoneme.symbol
          ),
      })
    ),
  });

    const blob =
      new Blob(
        [html],
        {
          type:
            "text/html;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "phoneme-word-search.html";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  }

  return (
    <div className="builder-layout">
      <section className="builder-controls">
        <h3>
          Activity Settings
        </h3>

        <p className="builder-description">
          Configure the Word Search
          activity and preview the
          result before generating
          the final HTML file.
        </p>

        {loading && (
          <p className="field-help">
            Loading stored words...
          </p>
        )}

        {error && (
          <p className="field-help">
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="word-search-title">
            Activity title
          </label>

          <input
            id="word-search-title"
            type="text"
            value={activityTitle}
            onChange={(event) => {
              setActivityTitle(
                event.target.value
              );

              setSaveMessage("");
              setSaveError("");
            }}
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="word-search-list">
            Word list
          </label>

          <select
            id="word-search-list"
            value={
              selectedWordListId ??
              ""
            }
            onChange={(event) =>
              handleWordListChange(
                Number(
                  event.target.value
                )
              )
            }
            disabled={
              loading ||
              wordLists.length === 0
            }
          >
            {wordLists.length ===
              0 && (
              <option value="">
                No word lists
                available
              </option>
            )}

            {wordLists.map(
              (wordList) => (
                <option
                  key={
                    wordList.id
                  }
                  value={
                    wordList.id
                  }
                >
                  {wordList.name}
                </option>
              )
            )}
          </select>

          <p className="field-help">
            Words are loaded from
            the PostgreSQL database.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="word-search-difficulty">
            Difficulty
          </label>

          <select
            id="word-search-difficulty"
            value={difficulty}
            onChange={(event) => {
              setDifficulty(
                event.target
                  .value as WordSearchDifficulty
              );

              setSaveMessage("");
              setSaveError("");
            }}
          >
            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>
          </select>

          <p className="field-help">
            Difficulty controls the
            amount of assistance
            provided to students.
          </p>
        </div>

        <div className="checkbox-group">
          <input
            id="word-search-hints"
            type="checkbox"
            checked={showHints}
            onChange={(event) => {
              setShowHints(
                event.target.checked
              );

              setSaveMessage("");
              setSaveError("");
            }}
          />

          <label htmlFor="word-search-hints">
            Show word hints
          </label>
        </div>

        <div className="selected-word">
          <span>
            Selected database
            word list
          </span>

          {selectedWordListId ? (
            <>
              <strong>
                {selectedWords.length}{" "}
                {selectedWords.length ===
                1
                  ? "word"
                  : "words"}
              </strong>

              {selectedWords.length >
              0 ? (
                <>
                  <small>
                    {selectedWords
                      .map(
                        (word) =>
                          word.text
                      )
                      .join(", ")}
                  </small>

                  <small>
                    {selectedWords
                      .map(
                        (word) =>
                          `${
                            word.text
                          }: /${word.phonemes
                            .slice()
                            .sort(
                              (
                                a,
                                b
                              ) =>
                                a.position -
                                b.position
                            )
                            .map(
                              (
                                phoneme
                              ) =>
                                phoneme.symbol
                            )
                            .join(
                              " "
                            )}/`
                      )
                      .join(" • ")}
                  </small>
                </>
              ) : (
                <small>
                  No words are stored
                  in this list yet.
                </small>
              )}
            </>
          ) : (
            <>
              <strong>
                No word list
                selected
              </strong>

              <small>
                Create or select a
                stored word list
                first.
              </small>
            </>
          )}
        </div>

        <button
          type="button"
          className="generate-button"
          onClick={
            saveConfiguration
          }
          disabled={
            saving ||
            loading ||
            !selectedWordListId ||
            selectedWords.length ===
              0
          }
        >
          {saving
            ? "Saving..."
            : "Save Configuration"}
        </button>

        {saveMessage && (
          <p className="field-help">
            {saveMessage}
          </p>
        )}

        {saveError && (
          <p className="field-help">
            {saveError}
          </p>
        )}

        <button
          type="button"
          className="generate-button"
          onClick={downloadHtml}
          disabled={
            loading ||
            !selectedWordListId ||
            selectedWords.length ===
              0
          }
        >
          Generate HTML
        </button>
      </section>

      <section className="builder-preview">
        <div className="preview-heading">
          <div>
            <p className="preview-label">
              Live Preview
            </p>

            <h3>
              {activityTitle ||
                "Untitled Activity"}
            </h3>
          </div>

          <span className="difficulty-badge">
            {difficulty}
          </span>
        </div>

        <WordSearchGame
          difficulty={difficulty}
          showHints={showHints}
          words={selectedWords}
        />
      </section>
    </div>
  );
}