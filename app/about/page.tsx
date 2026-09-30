export default function AboutPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">About the Project</p>

        <h2>Phoneme Activity Builder</h2>

        <p>
          The Phoneme Activity Builder is designed for teachers preparing
          classroom activities for Speech Pathology students.
        </p>
      </section>

      <section className="info-card">
        <h3>Assessment 2</h3>

        <p>
          Assessment 2 extends the Phoneme Activity Builder into a full-stack
          web application. The application uses a PostgreSQL database and API
          routes to manage word lists, words, phonemes and saved activity
          configurations.
        </p>

        <p>
          Teachers can create database-driven Wordle and Word Search activities,
          manage stored classroom data, preview activities and download
          standalone HTML files for classroom use.
        </p>
      </section>

      <div className="info-grid">
        <section className="info-card">
          <h3>Phoneme Wordle</h3>

          <p>
            The Wordle builder creates a Wordle-style classroom activity using
            phoneme symbols instead of standard spelling. Teachers can select
            words stored in the database, adjust difficulty and hint settings,
            preview the activity and download it as a standalone HTML file.
          </p>
        </section>

        <section className="info-card">
          <h3>Phoneme Word Search</h3>

          <p>
            The Word Search builder creates an interactive phoneme-based puzzle
            using words stored in the database. Teachers can select a word list,
            configure activity settings, preview the puzzle and download the
            finished activity as a standalone HTML file.
          </p>
        </section>
      </div>

      <section className="info-card">
        <h3>Database and Activity Management</h3>

        <p>
          The Settings page allows word lists, words and saved activity
          configurations to be created, viewed, edited and deleted. Each word
          stores an ordered sequence of phonemes, including multi-character
          phoneme symbols.
        </p>
      </section>

      <section className="info-card">
        <h3>Student Information</h3>

        <p>
          <strong>Name:</strong> Joshua Downie
        </p>

        <p>
          <strong>Student Number:</strong> 22212613
        </p>
      </section>

      <section className="info-card">
        <h3>Website Walkthrough</h3>

        <p>
          The video below demonstrates how to navigate the website, manage
          database content, configure Wordle and Word Search activities,
          preview the games and generate standalone HTML files.
        </p>

        <div className="video-container">
          <video
            className="walkthrough-video"
            controls
            preload="metadata"
          >
            <source
              src="/videos/assessment-walkthrough.mp4"
              type="video/mp4"
            />

            Your browser does not support the video element.
          </video>
        </div>
      </section>
    </div>
  );
}