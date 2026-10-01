import WordSearchBuilder from "../../components/WordSearchBuilder";
import PageTimeTracker from "../../components/PageTimeTracker";

export default function WordSearchPage() {
  return (
    <div className="standard-page">
      <PageTimeTracker page="/word-search" />

      <section className="page-heading">
        <p className="eyebrow">
          Activity Builder
        </p>

        <h2>Phoneme Word Search</h2>

        <p>
          Create and preview an interactive word search using
          phoneme-based words for classroom activities.
        </p>
      </section>

      <WordSearchBuilder />
    </div>
  );
}