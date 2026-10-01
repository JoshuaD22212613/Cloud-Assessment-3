import DashboardMetrics from "../../components/DashboardMetrics";

export default function DashboardPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">
          Reporting & Observability
        </p>

        <h2>Activity Dashboard</h2>

        <p>
          Monitor activity usage, generation results and classroom
          application metrics.
        </p>
      </section>

      <DashboardMetrics />
    </div>
  );
}