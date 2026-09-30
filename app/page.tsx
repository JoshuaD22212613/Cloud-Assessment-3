import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <p className="eyebrow">Speech Pathology Classroom Tools</p>

        <h2>Build phoneme-based activities for your classroom</h2>

        <p className="hero-description">
          Create, preview and download interactive phoneme activities that
          can be played in a normal web browser.
        </p>
      </section>

      <section className="activity-section">
        <h2>Choose an activity</h2>

        <div className="activity-grid">
          <article className="activity-card">
            <h3>Phoneme Wordle</h3>

            <p>
              Create a Wordle-style activity where students identify words
              using phoneme symbols.
            </p>

            <Link className="primary-button" href="/wordle">
              Create Wordle
            </Link>
          </article>

          <article className="activity-card">
            <h3>Phoneme Word Search</h3>

            <p>
              Create a classroom word search using phoneme-based words and
              interactive puzzle activities.
            </p>

            <Link className="primary-button" href="/word-search">
              Create Word Search
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}