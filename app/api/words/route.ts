import { db } from "../../../prisma/db";

// GET - Retrieve all words and their phonemes
export async function GET() {
  try {
    const words = await db.orm.public.Word
      .orderBy((word) => word.createdAt.desc())
      .all();

    const wordsWithPhonemes = await Promise.all(
      words.map(async (word) => {
        const phonemes = await db.orm.public.Phoneme
          .where({ wordId: word.id })
          .orderBy((phoneme) => phoneme.position.asc())
          .all();

        return {
          ...word,
          phonemes,
        };
      })
    );

    return Response.json(wordsWithPhonemes, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve words:", error);

    return Response.json(
      { error: "Failed to retrieve words" },
      { status: 500 }
    );
  }
}

// POST - Create a word and its phonemes
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

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    const hint =
      typeof body.hint === "string" ? body.hint.trim() : null;

    const wordListId = Number(body.wordListId);

    // Validate the word
    if (!text) {
      return Response.json(
        { error: "Word text is required" },
        { status: 400 }
      );
    }

    // Validate the word list ID
    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Valid word list ID is required" },
        { status: 400 }
      );
    }

    // Validate phonemes
    if (!Array.isArray(body.phonemes) || body.phonemes.length === 0) {
      return Response.json(
        { error: "At least one phoneme is required" },
        { status: 400 }
      );
    }

    const phonemeSymbols = body.phonemes.map((phoneme: unknown) =>
      typeof phoneme === "string" ? phoneme.trim() : ""
    );

    if (phonemeSymbols.some((phoneme: string) => !phoneme)) {
      return Response.json(
        { error: "All phonemes must be non-empty strings" },
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

    // Create the word
    const word = await db.orm.public.Word.create({
      text,
      hint: hint || null,
      wordListId,
    });

    // Create each phoneme in its correct position
    const phonemes = [];

    for (
      let position = 0;
      position < phonemeSymbols.length;
      position++
    ) {
      const phoneme = await db.orm.public.Phoneme.create({
        symbol: phonemeSymbols[position],
        position,
        wordId: word.id,
      });

      phonemes.push(phoneme);
    }

    return Response.json(
      {
        ...word,
        phonemes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create word:", error);

    return Response.json(
      { error: "Failed to create word" },
      { status: 500 }
    );
  }
}