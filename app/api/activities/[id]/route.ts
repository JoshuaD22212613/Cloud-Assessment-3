import { db } from "../../../../prisma/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Retrieve one activity by ID
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return Response.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await db.orm.public.Activity
      .where({ id: activityId })
      .first();

    if (!activity) {
      return Response.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return Response.json(activity, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve activity:", error);

    return Response.json(
      { error: "Failed to retrieve activity" },
      { status: 500 }
    );
  }
}

// PUT - Update one activity
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return Response.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const existingActivity = await db.orm.public.Activity
      .where({ id: activityId })
      .first();

    if (!existingActivity) {
      return Response.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

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
        : "";

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

    // Validate grid size
    if (
      gridSize !== null &&
      (!Number.isInteger(gridSize) || gridSize <= 0)
    ) {
      return Response.json(
        { error: "Grid size must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate max guesses
    if (
      maxGuesses !== null &&
      (!Number.isInteger(maxGuesses) || maxGuesses <= 0)
    ) {
      return Response.json(
        { error: "Max guesses must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate target word ID
    if (
      targetWordId !== null &&
      (!Number.isInteger(targetWordId) || targetWordId <= 0)
    ) {
      return Response.json(
        { error: "Target word ID must be a positive integer" },
        { status: 400 }
      );
    }

    // Check that the word list exists
    const wordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .first();

    if (!wordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    // Validate target word if supplied
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

      if (targetWord.wordListId !== wordListId) {
        return Response.json(
          {
            error: "Target word must belong to the selected word list",
          },
          { status: 400 }
        );
      }
    }

    // Wordle must have a target word
    if (type === "WORDLE" && targetWordId === null) {
      return Response.json(
        { error: "Wordle activities require a target word" },
        { status: 400 }
      );
    }

    // Word Search must have a grid size
    if (type === "WORD_SEARCH" && gridSize === null) {
      return Response.json(
        { error: "Word Search activities require a grid size" },
        { status: 400 }
      );
    }

    // Update the activity
    const updatedActivity = await db.orm.public.Activity
      .where({ id: activityId })
      .update({
        title,
        type,
        difficulty,
        showHints,
        gridSize,
        maxGuesses,
        wordListId,
        targetWordId,
      });

    return Response.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error("Failed to update activity:", error);

    return Response.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

// DELETE - Delete one activity
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return Response.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const existingActivity = await db.orm.public.Activity
      .where({ id: activityId })
      .first();

    if (!existingActivity) {
      return Response.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    await db.orm.public.Activity
      .where({ id: activityId })
      .delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete activity:", error);

    return Response.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}