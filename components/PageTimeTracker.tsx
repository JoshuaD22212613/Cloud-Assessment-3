"use client";

import { useEffect } from "react";

type PageTimeTrackerProps = {
  page: string;
};

export default function PageTimeTracker({
  page,
}: PageTimeTrackerProps) {
  useEffect(() => {
    const startTime = Date.now();

    function recordPageView() {
      const durationSeconds = Math.max(
        1,
        Math.round(
          (Date.now() - startTime) / 1000
        )
      );

      const data = JSON.stringify({
        eventType: "PAGE_VIEW",
        activityType: null,
        activityId: null,
        page,
        durationSeconds,
        errorMessage: null,
      });

      const blob = new Blob([data], {
        type: "application/json",
      });

      navigator.sendBeacon(
        "/api/usage-events",
        blob
      );
    }

    window.addEventListener(
      "pagehide",
      recordPageView
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        recordPageView
      );

      recordPageView();
    };
  }, [page]);

  return null;
}