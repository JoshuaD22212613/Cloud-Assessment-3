import { db } from "../../../prisma/db";

// GET - Retrieve all word lists
export async function GET() {
  try {
    const wordLists = await db.orm.public.WordList
      .orderBy((wordList) => wordList.createdAt.desc())
      .all();

    return Response.json(wordLists, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve word lists:", error);

    return Response.json(
      {
        error: "Failed to retrieve word lists",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new word list
export async function POST(request: Request) {
  try {
    let body;

try {
  body = await request.json();
} catch {
  return Response.json(
    { error: "Request body must contain valid JSON" },
    { status: 400 }
  );
}

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    // Validation - a word list must have a name
    if (!name) {
      return Response.json(
        {
          error: "Word list name is required",
        },
        { status: 400 }
      );
    }

    const wordList = await db.orm.public.WordList.create({
      name,
      description: description || null,
    });

    return Response.json(wordList, { status: 201 });
  } catch (error) {
    console.error("Failed to create word list:", error);

    return Response.json(
      {
        error: "Failed to create word list",
      },
      { status: 500 }
    );
  }
}