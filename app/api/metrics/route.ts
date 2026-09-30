import { db } from "../../../prisma/db";

// GET - Retrieve application reporting and observability metrics
export async function GET() {
  try {
    // Retrieve saved activities and usage events from the database
    const activities = await db.orm.public.Activity.all();

    const usageEvents = await db.orm.public.UsageEvent.all();

    // Count saved activities by type
    const totalWordleActivities = activities.filter(
      (activity) => activity.type === "WORDLE"
    ).length;

    const totalWordSearchActivities = activities.filter(
      (activity) => activity.type === "WORD_SEARCH"
    ).length;

    // Count generation outcomes
    const successfulGenerations = usageEvents.filter(
      (event) => event.eventType === "GENERATION_SUCCESS"
    ).length;

    const failedGenerations = usageEvents.filter(
      (event) => event.eventType === "GENERATION_FAILURE"
    ).length;

    // Calculate average recorded time on page
    const timedPageViews = usageEvents.filter(
      (event) =>
        event.eventType === "PAGE_VIEW" &&
        event.durationSeconds !== null
    );

    const totalDuration = timedPageViews.reduce(
      (total, event) => total + (event.durationSeconds ?? 0),
      0
    );

    const averageTimeOnPage =
      timedPageViews.length > 0
        ? Math.round(totalDuration / timedPageViews.length)
        : 0;

    // Determine which activity type has been used most often
    const wordleUsage = usageEvents.filter(
      (event) => event.activityType === "WORDLE"
    ).length;

    const wordSearchUsage = usageEvents.filter(
      (event) => event.activityType === "WORD_SEARCH"
    ).length;

    let mostUsedActivityType: "WORDLE" | "WORD_SEARCH" | "NONE" = "NONE";

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "WORDLE";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "WORD_SEARCH";
    } else if (wordleUsage > 0) {
      mostUsedActivityType = "WORDLE";
    }

    return Response.json(
      {
        totalActivities: activities.length,
        totalWordleActivities,
        totalWordSearchActivities,
        successfulGenerations,
        failedGenerations,
        averageTimeOnPage,
        mostUsedActivityType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve metrics:", error);

    return Response.json(
      { error: "Failed to retrieve metrics" },
      { status: 500 }
    );
  }
}