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
        <h3>Assessment 3</h3>

        <p>
          Assessment 3 extends the Phoneme Activity Builder with
          data-driven reporting, application monitoring and automated
          testing. The application uses PostgreSQL and API routes to
          persist classroom data, saved activity configurations and
          application usage events.
        </p>

        <p>
          Teachers can create database-driven Wordle and Word Search
          activities, manage stored classroom data, preview activities
          and download standalone HTML files for classroom use.
        </p>
      </section>

      <div className="info-grid">
        <section className="info-card">
          <h3>Phoneme Wordle</h3>

          <p>
            The Wordle builder creates a Wordle-style classroom activity
            using phoneme symbols instead of standard spelling. Teachers
            can select words stored in the database, adjust difficulty
            and hint settings, preview the activity and download it as a
            standalone HTML file.
          </p>
        </section>

        <section className="info-card">
          <h3>Phoneme Word Search</h3>

          <p>
            The Word Search builder creates an interactive phoneme-based
            puzzle using words stored in the database. Teachers can
            select a word list, configure activity settings, preview the
            puzzle and download the finished activity as a standalone
            HTML file.
          </p>
        </section>
      </div>

      <section className="info-card">
        <h3>Database and Activity Management</h3>

        <p>
          The Settings page allows word lists, words and saved activity
          configurations to be created, viewed, edited and deleted.
          Each word stores an ordered sequence of phonemes used by the
          activity builders.
        </p>
      </section>

      <section className="info-card">
        <h3>Reporting and Observability</h3>

        <p>
          The dashboard provides database-driven reporting for saved
          activities, successful and failed generations, average time
          on page and activity usage. Application health and warning
          indicators provide additional visibility into the state of
          the system.
        </p>
      </section>

      <section className="info-card">
        <h3>Testing and Accessibility</h3>

        <p>
          The application is supported by Playwright end-to-end tests,
          JMeter load testing and Lighthouse accessibility testing.
          These tools are used to verify important user workflows,
          observe application behaviour under increasing load and
          identify accessibility improvements.
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
          The walkthrough demonstrates the application's activity
          builders, database management, dashboard, reporting,
          observability and testing features.
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