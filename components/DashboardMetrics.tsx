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

type Health = {
  status: string;
  message: string;
  timestamp: string;
};

export default function DashboardMetrics() {
  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  const [health, setHealth] =
    useState<Health | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          metricsResponse,
          healthResponse,
        ] = await Promise.all([
          fetch("/api/metrics", {
            cache: "no-store",
          }),

          fetch("/health", {
            cache: "no-store",
          }),
        ]);

        if (!metricsResponse.ok) {
          throw new Error(
            "Failed to load dashboard metrics."
          );
        }

        if (!healthResponse.ok) {
          throw new Error(
            "Application health check failed."
          );
        }

        const metricsData: Metrics =
          await metricsResponse.json();

        const healthData: Health =
          await healthResponse.json();

        setMetrics(metricsData);
        setHealth(healthData);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        setError(
          "Unable to load dashboard data. Please check the application and database."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
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

  function formatHealthTime(
    timestamp: string
  ) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleString();
  }

  if (loading) {
    return (
      <section className="info-card">
        <h3>Loading dashboard...</h3>

        <p>
          Retrieving reporting,
          health and usage metrics.
        </p>
      </section>
    );
  }

  if (
    error ||
    !metrics ||
    !health
  ) {
    return (
      <section className="info-card">
        <h3>
          Dashboard unavailable
        </h3>

        <p>
          {error ||
            "Dashboard data could not be loaded."}
        </p>
      </section>
    );
  }

  const applicationHealthy =
    health.status === "OK";

  const hasActivities =
    metrics.totalActivities > 0;

  const hasGenerationFailures =
    metrics.failedGenerations > 0;

  return (
    <section>
      <section className="info-card">
        <p className="eyebrow">
          System Status
        </p>

        <h3>
          Application Monitoring
        </h3>

        <p>
          Live application health and
          data-quality indicators.
        </p>

        <div className="info-grid">
          <article className="info-card">
            <p className="eyebrow">
              Application
            </p>

            <h3>
              {applicationHealthy
                ? "Healthy"
                : "Warning"}
            </h3>

            <p>
              {health.message}
            </p>

            <small>
              Last health check:{" "}
              {formatHealthTime(
                health.timestamp
              )}
            </small>
          </article>

          <article className="info-card">
            <p className="eyebrow">
              Database Data
            </p>

            <h3>
              {hasActivities
                ? "Available"
                : "Warning"}
            </h3>

            <p>
              {hasActivities
                ? `${metrics.totalActivities} saved activity configurations are available.`
                : "No saved activity configurations were found."}
            </p>
          </article>

          <article className="info-card">
            <p className="eyebrow">
              Generation Status
            </p>

            <h3>
              {hasGenerationFailures
                ? "Attention Required"
                : "No Failures"}
            </h3>

            <p>
              {hasGenerationFailures
                ? `${metrics.failedGenerations} failed generation attempt(s) have been recorded.`
                : "No failed activity generations have been recorded."}
            </p>
          </article>
        </div>
      </section>

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