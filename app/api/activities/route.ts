import { db } from "../../../prisma/db";

// GET - Retrieve all saved activity configurations
export async function GET() {
  try {
    const activities = await db.orm.public.Activity
      .orderBy((activity) => activity.createdAt.desc())
      .all();

    return Response.json(activities, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve activities:", error);

    return Response.json(
      { error: "Failed to retrieve activities" },
      { status: 500 }
    );
  }
}

// POST - Create a new activity configuration
export async function POST(request: Request) {
  try {
    // Safely read the JSON request body
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Request body must contain valid JSON" },
        { status: 400 }
      );
    }

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const type =
      typeof body.type === "string" ? body.type.trim() : "";

    const difficulty =
      typeof body.difficulty === "string"
        ? body.difficulty.trim()
        : "EASY";

    const showHints =
      typeof body.showHints === "boolean"
        ? body.showHints
        : true;

    const gridSize =
      body.gridSize === null || body.gridSize === undefined
        ? null
        : Number(body.gridSize);

    const maxGuesses =
      body.maxGuesses === null || body.maxGuesses === undefined
        ? null
        : Number(body.maxGuesses);

    const wordListId = Number(body.wordListId);

    const targetWordId =
      body.targetWordId === null || body.targetWordId === undefined
        ? null
        : Number(body.targetWordId);

    // Validate title
    if (!title) {
      return Response.json(
        { error: "Activity title is required" },
        { status: 400 }
      );
    }

    // Validate activity type
    if (type !== "WORDLE" && type !== "WORD_SEARCH") {
      return Response.json(
        { error: "Activity type must be WORDLE or WORD_SEARCH" },
        { status: 400 }
      );
    }

    // Validate difficulty
    if (
      difficulty !== "EASY" &&
      difficulty !== "MEDIUM" &&
      difficulty !== "HARD"
    ) {
      return Response.json(
        { error: "Difficulty must be EASY, MEDIUM or HARD" },
        { status: 400 }
      );
    }

    // Validate word list ID
    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Valid word list ID is required" },
        { status: 400 }
      );
    }

    // Validate optional grid size
    if (
      gridSize !== null &&
      (!Number.isInteger(gridSize) || gridSize <= 0)
    ) {
      return Response.json(
        { error: "Grid size must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate optional maximum guesses
    if (
      maxGuesses !== null &&
      (!Number.isInteger(maxGuesses) || maxGuesses <= 0)
    ) {
      return Response.json(
        { error: "Max guesses must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate optional target word ID
    if (
      targetWordId !== null &&
      (!Number.isInteger(targetWordId) || targetWordId <= 0)
    ) {
      return Response.json(
        { error: "Target word ID must be a positive integer" },
        { status: 400 }
      );
    }

    // Make sure the selected word list exists
    const wordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .first();

    if (!wordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    // If a target word is supplied, validate it
    if (targetWordId !== null) {
      const targetWord = await db.orm.public.Word
        .where({ id: targetWordId })
        .first();

      if (!targetWord) {
        return Response.json(
          { error: "Target word not found" },
          { status: 404 }
        );
      }

      // Prevent a target word from another word list
      if (targetWord.wordListId !== wordListId) {
        return Response.json(
          {
            error: "Target word must belong to the selected word list",
          },
          { status: 400 }
        );
      }
    }

    // Wordle requires a target word
    if (type === "WORDLE" && targetWordId === null) {
      return Response.json(
        { error: "Wordle activities require a target word" },
        { status: 400 }
      );
    }

    // Word Search requires a grid size
    if (type === "WORD_SEARCH" && gridSize === null) {
      return Response.json(
        { error: "Word Search activities require a grid size" },
        { status: 400 }
      );
    }

    // Create the activity
    const activity = await db.orm.public.Activity.create({
      title,
      type,
      difficulty,
      showHints,
      gridSize,
      maxGuesses,
      wordListId,
      targetWordId,
    });

    return Response.json(activity, { status: 201 });
  } catch (error) {
    console.error("Failed to create activity:", error);

    return Response.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}