"use client";

import { useEffect, useState } from "react";

type Metrics = {
  totalActivities: number;
  totalWordleActivities: number;
  totalWordSearchActivities: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageTimeOnPage: number;
  mostUsedActivityType:
    | "WORDLE"
    | "WORD_SEARCH"
    | "NONE";
};

export default function DashboardMetrics() {
  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/metrics",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard metrics."
          );
        }

        const data: Metrics =
          await response.json();

        setMetrics(data);
      } catch (error) {
        console.error(
          "Failed to load dashboard metrics:",
          error
        );

        setError(
          "Unable to load dashboard data. Please check the application and database."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  function formatActivityType(
    activityType:
      | "WORDLE"
      | "WORD_SEARCH"
      | "NONE"
  ) {
    if (activityType === "WORDLE") {
      return "Wordle";
    }

    if (
      activityType === "WORD_SEARCH"
    ) {
      return "Word Search";
    }

    return "No usage yet";
  }

  if (loading) {
    return (
      <section className="info-card">
        <h3>Loading dashboard...</h3>

        <p>
          Retrieving reporting and
          usage metrics.
        </p>
      </section>
    );
  }

  if (error || !metrics) {
    return (
      <section className="info-card">
        <h3>Dashboard unavailable</h3>

        <p>
          {error ||
            "Dashboard metrics could not be loaded."}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="info-grid">
        <article className="info-card">
          <p className="eyebrow">
            Saved Activities
          </p>

          <h3>
            {metrics.totalActivities}
          </h3>

          <p>
            Total activity
            configurations stored in
            the database.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Wordle Activities
          </p>

          <h3>
            {
              metrics.totalWordleActivities
            }
          </h3>

          <p>
            Saved Phoneme Wordle
            configurations.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Word Search Activities
          </p>

          <h3>
            {
              metrics.totalWordSearchActivities
            }
          </h3>

          <p>
            Saved Phoneme Word Search
            configurations.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Successful Generations
          </p>

          <h3>
            {
              metrics.successfulGenerations
            }
          </h3>

          <p>
            HTML activities generated
            successfully.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Failed Generations
          </p>

          <h3>
            {
              metrics.failedGenerations
            }
          </h3>

          <p>
            Activity generation
            attempts that failed.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Average Time on Page
          </p>

          <h3>
            {
              metrics.averageTimeOnPage
            }
            s
          </h3>

          <p>
            Average recorded visit
            duration across tracked
            pages.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">
            Most Used Activity
          </p>

          <h3>
            {formatActivityType(
              metrics.mostUsedActivityType
            )}
          </h3>

          <p>
            Activity type with the
            highest recorded usage.
          </p>
        </article>
      </div>
    </section>
  );
}