"use client";

import { useEffect, useState } from "react";

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

export default function WordListManager() {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadWordLists() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/wordlists");

      if (!response.ok) {
        throw new Error("Failed to load word lists.");
      }

      const data: WordList[] = await response.json();

      setWordLists(data);
    } catch (error) {
      console.error(
        "Failed to load word lists:",
        error
      );

      setError(
        "Unable to load word lists. Please check the backend and database."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWordLists();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  function notifyWordListChange() {
    window.dispatchEvent(
      new Event("wordlists-updated")
    );
  }

  async function saveWordList() {
    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      setError("Please enter a word list name.");
      return;
    }

    try {
      setSaving(true);

      const editing = editingId !== null;

      const response = await fetch(
        editing
          ? `/api/wordlists/${editingId}`
          : "/api/wordlists",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: cleanName,
            description:
              cleanDescription || null,
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
          data?.error ||
            "Failed to save word list."
        );
      }

      await loadWordLists();

      resetForm();

      setMessage(
        editing
          ? "Word list updated successfully."
          : "Word list created successfully."
      );

      notifyWordListChange();
    } catch (error) {
      console.error(
        "Failed to save word list:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the word list."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(wordList: WordList) {
    setEditingId(wordList.id);
    setName(wordList.name);
    setDescription(
      wordList.description ?? ""
    );

    setMessage("");
    setError("");
  }

  function cancelEditing() {
    resetForm();

    setMessage("");
    setError("");
  }

  async function deleteWordList(
    wordList: WordList
  ) {
    const confirmed = window.confirm(
      `Delete "${wordList.name}"? Words stored in this list will also be deleted.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/wordlists/${wordList.id}`,
        {
          method: "DELETE",
        }
      );

      let data: {
        error?: string;
      } | null = null;

      if (response.status !== 204) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete word list."
        );
      }

      if (editingId === wordList.id) {
        resetForm();
      }

      await loadWordLists();

      setMessage(
        `"${wordList.name}" deleted successfully.`
      );

      notifyWordListChange();
    } catch (error) {
      console.error(
        "Failed to delete word list:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete the word list."
      );
    }
  }

  return (
    <div>
      {loading && (
        <p className="field-help">
          Loading word lists...
        </p>
      )}

      <div className="form-group">
        <label htmlFor="word-list-name">
          Word List Name
        </label>

        <input
          id="word-list-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Example: Classroom Words"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="word-list-description">
          Description
        </label>

        <input
          id="word-list-description"
          type="text"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Example: Words for classroom activities"
          maxLength={200}
        />

        <p className="field-help">
          The description is optional.
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
        onClick={saveWordList}
        disabled={saving || loading}
      >
        {saving
          ? "Saving..."
          : editingId !== null
            ? "Update Word List"
            : "Create Word List"}
      </button>

      {editingId !== null && (
        <button
          type="button"
          className="secondary-button"
          onClick={cancelEditing}
          disabled={saving}
        >
          Cancel Edit
        </button>
      )}

      <hr />

      <h4>Saved Word Lists</h4>

      {wordLists.length === 0 ? (
        <p className="field-help">
          No word lists have been created yet.
        </p>
      ) : (
        <div>
          {wordLists.map((wordList) => (
            <div
              key={wordList.id}
              className="selected-word"
            >
              <span>
                Word list #{wordList.id}
              </span>

              <strong>
                {wordList.name}
              </strong>

              <small>
                {wordList.description ||
                  "No description provided."}
              </small>

              <div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    startEditing(wordList)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    deleteWordList(wordList)
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