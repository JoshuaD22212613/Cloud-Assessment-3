import { db } from "../../../../prisma/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Retrieve one word list
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (
      !Number.isInteger(wordListId) ||
      wordListId <= 0
    ) {
      return Response.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const wordList =
      await db.orm.public.WordList
        .where({ id: wordListId })
        .first();

    if (!wordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    return Response.json(wordList, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve word list:",
      error
    );

    return Response.json(
      { error: "Failed to retrieve word list" },
      { status: 500 }
    );
  }
}

// PUT - Update one word list
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (
      !Number.isInteger(wordListId) ||
      wordListId <= 0
    ) {
      return Response.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const existingWordList =
      await db.orm.public.WordList
        .where({ id: wordListId })
        .first();

    if (!existingWordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          error:
            "Request body must contain valid JSON",
        },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return Response.json(
        { error: "Word list name is required" },
        { status: 400 }
      );
    }

    const updatedWordList =
      await db.orm.public.WordList
        .where({ id: wordListId })
        .update({
          name,
          description: description || null,
        });

    return Response.json(updatedWordList, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Failed to update word list:",
      error
    );

    return Response.json(
      { error: "Failed to update word list" },
      { status: 500 }
    );
  }
}

// DELETE - Delete one word list
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (
      !Number.isInteger(wordListId) ||
      wordListId <= 0
    ) {
      return Response.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const existingWordList =
      await db.orm.public.WordList
        .where({ id: wordListId })
        .first();

    if (!existingWordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    // Do not allow a list to be deleted while
    // a saved activity configuration references it.
    const linkedActivity =
      await db.orm.public.Activity
        .where({ wordListId })
        .first();

    if (linkedActivity) {
      return Response.json(
        {
          error:
            "This word list cannot be deleted because it is being used by a saved activity configuration.",
        },
        { status: 409 }
      );
    }

    await db.orm.public.WordList
      .where({ id: wordListId })
      .delete();

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "Failed to delete word list:",
      error
    );

    return Response.json(
      { error: "Failed to delete word list" },
      { status: 500 }
    );
  }
}