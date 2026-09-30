"use client";

import { useEffect, useState } from "react";

type ActivityType = "WORDLE" | "WORD_SEARCH";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

type StoredWord = {
  id: number;
  text: string;
  wordListId: number;
};

type Activity = {
  id: number;
  title: string;
  type: ActivityType;
  difficulty: Difficulty;
  showHints: boolean;
  gridSize: number | null;
  maxGuesses: number | null;
  wordListId: number;
  targetWordId: number | null;
};

export default function ActivityManager() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [wordLists, setWordLists] =
    useState<WordList[]>([]);

  const [words, setWords] =
    useState<StoredWord[]>([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");

  const [type, setType] =
    useState<ActivityType>("WORDLE");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("EASY");

  const [showHints, setShowHints] =
    useState(true);

  const [wordListId, setWordListId] =
    useState<number | null>(null);

  const [targetWordId, setTargetWordId] =
    useState<number | null>(null);

  const [gridSize, setGridSize] =
    useState(8);

  const [maxGuesses, setMaxGuesses] =
    useState(6);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        activitiesResponse,
        wordListsResponse,
        wordsResponse,
      ] = await Promise.all([
        fetch("/api/activities"),
        fetch("/api/wordlists"),
        fetch("/api/words"),
      ]);

      if (!activitiesResponse.ok) {
        throw new Error(
          "Failed to load activities."
        );
      }

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

      const activitiesData: Activity[] =
        await activitiesResponse.json();

      const wordListsData: WordList[] =
        await wordListsResponse.json();

      const wordsData: StoredWord[] =
        await wordsResponse.json();

      setActivities(activitiesData);
      setWordLists(wordListsData);
      setWords(wordsData);
    } catch (error) {
      console.error(
        "Failed to load activity data:",
        error
      );

      setError(
        "Unable to load saved activity configurations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableWords = words.filter(
    (word) =>
      word.wordListId === wordListId
  );

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setType("WORDLE");
    setDifficulty("EASY");
    setShowHints(true);
    setWordListId(null);
    setTargetWordId(null);
    setGridSize(8);
    setMaxGuesses(6);
  }

  function startEditing(
    activity: Activity
  ) {
    setEditingId(activity.id);
    setTitle(activity.title);
    setType(activity.type);
    setDifficulty(activity.difficulty);
    setShowHints(activity.showHints);
    setWordListId(activity.wordListId);
    setTargetWordId(
      activity.targetWordId
    );

    setGridSize(
      activity.gridSize ?? 8
    );

    setMaxGuesses(
      activity.maxGuesses ?? 6
    );

    setMessage("");
    setError("");
  }

  function cancelEditing() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function updateActivity() {
    if (editingId === null) {
      return;
    }

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter an activity title."
      );
      return;
    }

    if (!wordListId) {
      setError(
        "Please select a word list."
      );
      return;
    }

    if (
      type === "WORDLE" &&
      !targetWordId
    ) {
      setError(
        "Wordle activities require a target word."
      );
      return;
    }

    if (
      type === "WORD_SEARCH" &&
      (!Number.isInteger(gridSize) ||
        gridSize <= 0)
    ) {
      setError(
        "Word Search requires a valid grid size."
      );
      return;
    }

    if (
      type === "WORDLE" &&
      (!Number.isInteger(maxGuesses) ||
        maxGuesses <= 0)
    ) {
      setError(
        "Wordle requires a valid maximum number of guesses."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/activities/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            type,
            difficulty,
            showHints,

            wordListId,

            targetWordId:
              type === "WORDLE"
                ? targetWordId
                : null,

            gridSize:
              type === "WORD_SEARCH"
                ? gridSize
                : null,

            maxGuesses:
              type === "WORDLE"
                ? maxGuesses
                : null,
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
            "Failed to update activity."
        );
      }

      await loadData();
      resetForm();

      setMessage(
        "Activity configuration updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update activity:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update activity."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(
    activity: Activity
  ) {
    const confirmed = window.confirm(
      `Delete "${activity.title}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/activities/${activity.id}`,
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
            "Failed to delete activity."
        );
      }

      if (editingId === activity.id) {
        resetForm();
      }

      await loadData();

      setMessage(
        `"${activity.title}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Failed to delete activity:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete activity."
      );
    }
  }

  function getWordListName(
    id: number
  ) {
    return (
      wordLists.find(
        (wordList) =>
          wordList.id === id
      )?.name ?? "Unknown word list"
    );
  }

  function getWordName(
    id: number | null
  ) {
    if (id === null) {
      return "None";
    }

    return (
      words.find(
        (word) => word.id === id
      )?.text ?? "Unknown word"
    );
  }

  return (
    <div>
      {loading && (
        <p className="field-help">
          Loading saved activities...
        </p>
      )}

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

      {editingId !== null && (
        <>
          <h4>Edit Activity</h4>

          <div className="form-group">
            <label htmlFor="activity-title">
              Activity Title
            </label>

            <input
              id="activity-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity-type">
              Activity Type
            </label>

            <select
              id="activity-type"
              value={type}
              onChange={(event) => {
                const newType =
                  event.target.value as ActivityType;

                setType(newType);

                if (
                  newType ===
                  "WORD_SEARCH"
                ) {
                  setTargetWordId(
                    null
                  );
                }
              }}
            >
              <option value="WORDLE">
                Wordle
              </option>

              <option value="WORD_SEARCH">
                Word Search
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activity-difficulty">
              Difficulty
            </label>

            <select
              id="activity-difficulty"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target
                    .value as Difficulty
                )
              }
            >
              <option value="EASY">
                Easy
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HARD">
                Hard
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activity-word-list">
              Word List
            </label>

            <select
              id="activity-word-list"
              value={wordListId ?? ""}
              onChange={(event) => {
                const value =
                  Number(
                    event.target.value
                  );

                setWordListId(value);
                setTargetWordId(null);
              }}
            >
              <option value="">
                Select a word list
              </option>

              {wordLists.map(
                (wordList) => (
                  <option
                    key={wordList.id}
                    value={wordList.id}
                  >
                    {wordList.name}
                  </option>
                )
              )}
            </select>
          </div>

          {type === "WORDLE" && (
            <>
              <div className="form-group">
                <label htmlFor="activity-target-word">
                  Target Word
                </label>

                <select
                  id="activity-target-word"
                  value={
                    targetWordId ?? ""
                  }
                  onChange={(event) =>
                    setTargetWordId(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  disabled={
                    !wordListId
                  }
                >
                  <option value="">
                    Select a target word
                  </option>

                  {availableWords.map(
                    (word) => (
                      <option
                        key={word.id}
                        value={word.id}
                      >
                        {word.text}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="activity-max-guesses">
                  Maximum Guesses
                </label>

                <input
                  id="activity-max-guesses"
                  type="number"
                  min={1}
                  value={maxGuesses}
                  onChange={(event) =>
                    setMaxGuesses(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                />
              </div>
            </>
          )}

          {type ===
            "WORD_SEARCH" && (
            <div className="form-group">
              <label htmlFor="activity-grid-size">
                Grid Size
              </label>

              <input
                id="activity-grid-size"
                type="number"
                min={1}
                value={gridSize}
                onChange={(event) =>
                  setGridSize(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={showHints}
                onChange={(event) =>
                  setShowHints(
                    event.target.checked
                  )
                }
              />{" "}
              Show hints
            </label>
          </div>

          <button
            type="button"
            className="generate-button"
            onClick={updateActivity}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Update Activity"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={cancelEditing}
            disabled={saving}
          >
            Cancel Edit
          </button>

          <hr />
        </>
      )}

      <h4>
        Saved Activity Configurations
      </h4>

      {activities.length === 0 ? (
        <p className="field-help">
          No activity configurations
          have been saved yet.
        </p>
      ) : (
        <div>
          {activities.map(
            (activity) => (
              <div
                key={activity.id}
                className="selected-word"
              >
                <span>
                  Activity #{activity.id}
                </span>

                <strong>
                  {activity.title}
                </strong>

                <small>
                  Type:{" "}
                  {activity.type ===
                  "WORDLE"
                    ? "Wordle"
                    : "Word Search"}
                </small>

                <small>
                  Difficulty:{" "}
                  {activity.difficulty}
                </small>

                <small>
                  Word list:{" "}
                  {getWordListName(
                    activity.wordListId
                  )}
                </small>

                {activity.type ===
                  "WORDLE" && (
                  <>
                    <small>
                      Target word:{" "}
                      {getWordName(
                        activity.targetWordId
                      )}
                    </small>

                    <small>
                      Maximum guesses:{" "}
                      {activity.maxGuesses ??
                        "Not set"}
                    </small>
                  </>
                )}

                {activity.type ===
                  "WORD_SEARCH" && (
                  <small>
                    Grid size:{" "}
                    {activity.gridSize ??
                      "Not set"}
                  </small>
                )}

                <small>
                  Hints:{" "}
                  {activity.showHints
                    ? "On"
                    : "Off"}
                </small>

                <div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      startEditing(
                        activity
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      deleteActivity(
                        activity
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}