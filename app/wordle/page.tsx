import WordleBuilder from "../../components/WordleBuilder";
import PageTimeTracker from "../../components/PageTimeTracker";

export default function WordlePage() {
  return (
    <div className="standard-page">
      <PageTimeTracker page="/wordle" />

      <section className="page-heading">
        <p className="eyebrow">
          Activity Builder
        </p>

        <h2>Phoneme Wordle</h2>

        <p>
          Create and preview a Wordle-style classroom activity using phonemes
          instead of standard spelling.
        </p>
      </section>

      <WordleBuilder />
    </div>
  );
}