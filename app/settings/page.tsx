import ThemeControls from "../../components/ThemeControls";
import WordListManager from "../../components/WordListManager";
import WordManager from "../../components/WordManager";
import ActivityManager from "../../components/ActivityManager";

export default function SettingsPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">
          Preferences & Data
        </p>

        <h2>Settings</h2>

        <p>
          Customise the appearance of the Phoneme
          Activity Builder and manage the data used
          to create classroom activities.
        </p>
      </section>

      <section className="info-card">
        <h3>Appearance</h3>

        <p>
          Choose between light and dark mode. Your
          selected theme will be stored in a cookie.
        </p>

        <ThemeControls />
      </section>

      <section className="info-card">
        <h3>Manage Word Lists</h3>

        <p>
          Create, edit and delete the word lists used
          by Wordle and Word Search activities.
        </p>

        <WordListManager />
      </section>

      <section className="info-card">
        <h3>Manage Words</h3>

        <p>
          Add, edit and delete words stored in the
          PostgreSQL database. Each word can contain
          an ordered list of phonemes used by the
          Wordle and Word Search activities.
        </p>

        <WordManager />
      </section>

      <section className="info-card">
        <h3>
          Manage Activity Configurations
        </h3>

        <p>
          View, edit and delete saved Wordle and Word
          Search configurations stored in the
          PostgreSQL database.
        </p>

        <ActivityManager />
      </section>
    </div>
  );
}