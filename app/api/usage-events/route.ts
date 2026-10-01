import { db } from "../../../prisma/db";

type UsageEventType =
  | "GENERATION_SUCCESS"
  | "GENERATION_FAILURE"
  | "PAGE_VIEW";

type ActivityType = "WORDLE" | "WORD_SEARCH";

// POST - Record an application usage event
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

    const eventType = body.eventType as UsageEventType;
    const activityType =
      body.activityType === "WORDLE" ||
      body.activityType === "WORD_SEARCH"
        ? (body.activityType as ActivityType)
        : null;

    const activityId =
      body.activityId === null || body.activityId === undefined
        ? null
        : Number(body.activityId);

    const page =
      typeof body.page === "string" ? body.page.trim() : null;

    const durationSeconds =
      body.durationSeconds === null ||
      body.durationSeconds === undefined
        ? null
        : Number(body.durationSeconds);

    const errorMessage =
      typeof body.errorMessage === "string"
        ? body.errorMessage.trim()
        : null;

    // Validate event type
    if (
      eventType !== "GENERATION_SUCCESS" &&
      eventType !== "GENERATION_FAILURE" &&
      eventType !== "PAGE_VIEW"
    ) {
      return Response.json(
        { error: "Invalid usage event type" },
        { status: 400 }
      );
    }

    // Generation events require an activity type
    if (
      (eventType === "GENERATION_SUCCESS" ||
        eventType === "GENERATION_FAILURE") &&
      activityType === null
    ) {
      return Response.json(
        { error: "Generation events require an activity type" },
        { status: 400 }
      );
    }

    // Validate optional activity ID
    if (
      activityId !== null &&
      (!Number.isInteger(activityId) || activityId <= 0)
    ) {
      return Response.json(
        { error: "Activity ID must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate optional duration
    if (
      durationSeconds !== null &&
      (!Number.isInteger(durationSeconds) || durationSeconds < 0)
    ) {
      return Response.json(
        { error: "Duration must be a non-negative integer" },
        { status: 400 }
      );
    }

    const usageEvent = await db.orm.public.UsageEvent.create({
      eventType,
      activityType,
      activityId,
      page,
      durationSeconds,
      errorMessage,
    });

    return Response.json(usageEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to record usage event:", error);

    return Response.json(
      { error: "Failed to record usage event" },
      { status: 500 }
    );
  }
}