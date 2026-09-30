import WordleBuilder from "../../components/WordleBuilder";

export default function WordlePage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">Activity Builder</p>
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