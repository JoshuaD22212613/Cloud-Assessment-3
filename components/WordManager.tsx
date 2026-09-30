"use client";

import { useEffect, useState } from "react";

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

export default function WordManager() {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [words, setWords] = useState<StoredWord[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState<number | null>(null);

  const [wordText, setWordText] = useState("");
  const [hint, setHint] = useState("");
  const [phonemeText, setPhonemeText] = useState("");

  const [editingWordId, setEditingWordId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [wordListsResponse, wordsResponse] =
        await Promise.all([
          fetch("/api/wordlists"),
          fetch("/api/words"),
        ]);

      if (!wordListsResponse.ok) {
        throw new Error("Failed to load word lists.");
      }

      if (!wordsResponse.ok) {
        throw new Error("Failed to load words.");
      }

      const wordListsData: WordList[] =
        await wordListsResponse.json();

      const wordsData: StoredWord[] =
        await wordsResponse.json();

      setWordLists(wordListsData);
      setWords(wordsData);

      setSelectedWordListId((currentId) => {
        if (wordListsData.length === 0) {
          return null;
        }

        const currentStillExists =
          currentId !== null &&
          wordListsData.some(
            (wordList) => wordList.id === currentId
          );

        if (currentStillExists) {
          return currentId;
        }

        return wordListsData[0].id;
      });
    } catch (error) {
      console.error(
        "Failed to load word data:",
        error
      );

      setError(
        "Unable to load words. Please check the backend and database."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    function handleWordListsUpdated() {
      loadData();
    }

    window.addEventListener(
      "wordlists-updated",
      handleWordListsUpdated
    );

    return () => {
      window.removeEventListener(
        "wordlists-updated",
        handleWordListsUpdated
      );
    };
  }, []);

  const filteredWords = words.filter(
    (word) =>
      word.wordListId === selectedWordListId
  );

  function resetForm() {
    setWordText("");
    setHint("");
    setPhonemeText("");
    setEditingWordId(null);
    setMessage("");
    setError("");
  }

  function startEditing(word: StoredWord) {
    setEditingWordId(word.id);
    setSelectedWordListId(word.wordListId);
    setWordText(word.text);
    setHint(word.hint ?? "");

    setPhonemeText(
      word.phonemes
        .slice()
        .sort(
          (a, b) => a.position - b.position
        )
        .map((phoneme) => phoneme.symbol)
        .join(" ")
    );

    setMessage("");
    setError("");
  }

  function getPhonemes() {
    return phonemeText
      .trim()
      .split(/\s+/)
      .map((phoneme) => phoneme.trim())
      .filter(Boolean);
  }

  async function saveWord() {
    setMessage("");
    setError("");

    const cleanWord = wordText.trim();
    const phonemes = getPhonemes();

    if (!cleanWord) {
      setError("Please enter a word.");
      return;
    }

    if (!selectedWordListId) {
      setError("Please select a word list.");
      return;
    }

    if (phonemes.length === 0) {
      setError(
        "Please enter at least one phoneme."
      );
      return;
    }

    try {
      setSaving(true);

      const editing = editingWordId !== null;

      const response = await fetch(
        editing
          ? `/api/words/${editingWordId}`
          : "/api/words",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: cleanWord.toUpperCase(),
            hint: hint.trim() || null,
            wordListId: selectedWordListId,
            phonemes,
          }),
        }
      );

      let data: {
        error?: string;
      } | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save word."
        );
      }

      await loadData();

      setWordText("");
      setHint("");
      setPhonemeText("");
      setEditingWordId(null);

      setMessage(
        editing
          ? "Word updated successfully."
          : "Word added successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save word:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the word."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteWord(word: StoredWord) {
    const confirmed = window.confirm(
      `Delete "${word.text}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/words/${word.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let data: {
          error?: string;
        } | null = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        throw new Error(
          data?.error || "Failed to delete word."
        );
      }

      if (editingWordId === word.id) {
        setWordText("");
        setHint("");
        setPhonemeText("");
        setEditingWordId(null);
      }

      await loadData();

      setMessage(
        `"${word.text}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Failed to delete word:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete the word."
      );
    }
  }

  return (
    <div>
      {loading && (
        <p className="field-help">
          Loading database words...
        </p>
      )}

      <div className="form-group">
        <label htmlFor="manager-word-list">
          Word list
        </label>

        <select
          id="manager-word-list"
          value={selectedWordListId ?? ""}
          onChange={(event) => {
            const value = event.target.value;

            setSelectedWordListId(
              value ? Number(value) : null
            );

            resetForm();
          }}
          disabled={
            loading || wordLists.length === 0
          }
        >
          {wordLists.length === 0 && (
            <option value="">
              No word lists available
            </option>
          )}

          {wordLists.map((wordList) => (
            <option
              key={wordList.id}
              value={wordList.id}
            >
              {wordList.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="manager-word">
          Word
        </label>

        <input
          id="manager-word"
          type="text"
          value={wordText}
          onChange={(event) =>
            setWordText(event.target.value)
          }
          placeholder="Example: SHIP"
          maxLength={50}
        />
      </div>

      <div className="form-group">
        <label htmlFor="manager-hint">
          Hint
        </label>

        <input
          id="manager-hint"
          type="text"
          value={hint}
          onChange={(event) =>
            setHint(event.target.value)
          }
          placeholder="Example: A type of boat"
          maxLength={120}
        />
      </div>

      <div className="form-group">
        <label htmlFor="manager-phonemes">
          Phonemes
        </label>

        <input
          id="manager-phonemes"
          type="text"
          value={phonemeText}
          onChange={(event) =>
            setPhonemeText(event.target.value)
          }
          placeholder="Example: ʃ ɪ p"
        />

        <p className="field-help">
          Separate each phoneme with a space.
          Multi-character phonemes such as tʃ are
          stored as one phoneme.
        </p>
      </div>

      {error && (
        <p className="field-help">
          {error}
        </p>
      )}

      {message && (
        <p className="field-help">
          {message}
        </p>
      )}

      <button
        type="button"
        className="generate-button"
        onClick={saveWord}
        disabled={
          saving ||
          loading ||
          wordLists.length === 0
        }
      >
        {saving
          ? "Saving..."
          : editingWordId !== null
            ? "Update Word"
            : "Add Word"}
      </button>

      {editingWordId !== null && (
        <button
          type="button"
          className="secondary-button"
          onClick={resetForm}
          disabled={saving}
        >
          Cancel Edit
        </button>
      )}

      <hr />

      <h4>Stored Words</h4>

      {filteredWords.length === 0 ? (
        <p className="field-help">
          No words are stored in this list yet.
        </p>
      ) : (
        <div>
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="selected-word"
            >
              <span>
                Database word #{word.id}
              </span>

              <strong>
                {word.text}
              </strong>

              <small>
                /
                {word.phonemes
                  .slice()
                  .sort(
                    (a, b) =>
                      a.position - b.position
                  )
                  .map(
                    (phoneme) =>
                      phoneme.symbol
                  )
                  .join(" ")}
                /
              </small>

              {word.hint && (
                <small>
                  Hint: {word.hint}
                </small>
              )}

              <div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    startEditing(word)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    deleteWord(word)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}