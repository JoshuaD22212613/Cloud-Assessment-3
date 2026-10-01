# Phoneme Activity Builder

## Cloud Based Web Applications — Assessment 3

**Student:** Joshua Downie  
**Student Number:** 22212613

## Project Overview

The Phoneme Activity Builder is a full-stack web application designed to help teachers create phoneme-based classroom activities for Speech Pathology students.

Assessment 3 extends the existing application with database-driven reporting, usage metrics, application health monitoring, automated end-to-end testing, load testing, and accessibility evaluation.

Teachers can create and manage word lists containing words and ordered phonemes. Stored database content can then be used to configure, preview, save, and generate interactive Phoneme Wordle and Phoneme Word Search activities.

Generated activities can also be downloaded as standalone HTML files for classroom use.

## Main Features

### Phoneme Wordle

The Wordle builder allows a teacher to:

- Select a word list stored in the database.
- Select a target word.
- Use the ordered phonemes stored for that word.
- Select Easy, Medium, or Hard difficulty.
- Enable or disable hints.
- Preview the activity.
- Save the activity configuration.
- Generate and download a standalone HTML activity.

### Phoneme Word Search

The Word Search builder allows a teacher to:

- Select a database word list.
- Use multiple stored words and phonemes.
- Configure activity difficulty.
- Enable or disable hints.
- Generate a phoneme-based puzzle grid.
- Preview the activity.
- Save the activity configuration.
- Generate and download a standalone HTML activity.

### Data Management

The Settings page provides CRUD functionality for application data.

Users can:

- Create, view, edit, and delete word lists.
- Create, view, edit, and delete words.
- Store ordered phonemes for each word.
- Store multi-character phoneme symbols.
- View, edit, and delete saved Wordle and Word Search configurations.

## Dashboard and Reporting

Assessment 3 includes a database-driven dashboard for reporting and observability.

The dashboard displays:

- Total saved activities.
- Total Wordle activities.
- Total Word Search activities.
- Successful activity generations.
- Failed activity generations.
- Average recorded time on page.
- Most-used activity type.

The dashboard also provides application status information for application health, stored database data, and generation failures.

## Usage Metrics and Observability

Application usage is recorded using usage events stored in PostgreSQL.

Supported event types include:

- `GENERATION_SUCCESS`
- `GENERATION_FAILURE`
- `PAGE_VIEW`

Usage events can contain information such as activity type, page, duration, activity ID, error information, and creation time.

Generation events are recorded when Wordle or Word Search activities are generated.

Page-view duration events are used to calculate average recorded time on page.

## Health Monitoring

The application provides a health endpoint:

`GET /health`

A successful request returns HTTP status `200 OK` and application health information.

The existing API health endpoint is also available at:

`GET /api/health`

Health information is used by the dashboard to display application status.

## Technology Stack

The project uses:

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Docker
- Docker Compose
- Playwright
- Apache JMeter
- Lighthouse
- HTML and CSS
- Git and GitHub

## Database Design

The PostgreSQL database contains the main application models from the previous development stage together with Assessment 3 usage-event data.

### WordList

Stores a named collection of words that can be used to generate activities.

### Word

Stores the written form of a word, an optional hint, and the word list it belongs to.

### Phoneme

Stores individual phoneme symbols for a word.

Each phoneme has a position value so phonemes remain in the correct order.

### Activity

Stores saved Wordle and Word Search configurations.

Activity data can include:

- Title
- Activity type
- Difficulty
- Hint setting
- Word list
- Target word where applicable
- Grid size where applicable
- Maximum guesses where applicable

### UsageEvent

Stores application usage and observability events.

Usage-event data can include:

- Event type
- Activity type
- Activity ID
- Page
- Duration
- Error message
- Creation time

## API Routes

The application provides server-side API routes for database and reporting operations.

### Word Lists

`GET /api/wordlists`  
`POST /api/wordlists`

`GET /api/wordlists/[id]`  
`PUT /api/wordlists/[id]`  
`DELETE /api/wordlists/[id]`

### Words

`GET /api/words`  
`POST /api/words`

`GET /api/words/[id]`  
`PUT /api/words/[id]`  
`DELETE /api/words/[id]`

### Activities

`GET /api/activities`  
`POST /api/activities`

`GET /api/activities/[id]`  
`PUT /api/activities/[id]`  
`DELETE /api/activities/[id]`

### Metrics

`GET /api/metrics`

Returns aggregated application metrics used by the dashboard.

### Usage Events

`POST /api/usage-events`

Records application usage events used for reporting and observability.

### Health

`GET /health`

Returns application health information with HTTP status `200 OK`.

## Automated End-to-End Testing

Playwright is used for automated end-to-end testing.

The test suite includes:

- A word-list CRUD workflow that creates, edits, and deletes database content.
- A Wordle generation workflow covering an important activity-builder use case.

Run the Playwright test suite with:

```bash
npx playwright test
```

The completed Assessment 3 test suite passes both automated tests.

## Load Testing

Apache JMeter is used to evaluate application behaviour under increasing simulated load.

The Wordle builder was tested using the following load levels:

| Simulated Users | Average Response | Error Rate |
| ---: | ---: | ---: |
| 1 | 120 ms | 0.00% |
| 10 | 40 ms | 0.00% |
| 100 | 34 ms | 0.00% |
| 1,000 | 4,093 ms | 0.00% |
| 10,000 | 11,769 ms | 17.96% |

The application remained error-free through the 1,000-user test, although response times increased substantially at that level.

At 10,000 simulated users, response times increased further and an error rate of 17.96% was recorded, showing significant degradation under heavy load.

These measurements were produced using the local development environment and should not be interpreted as production capacity measurements.

The JMeter test plan is stored in:

`load-test.jmx`

## Accessibility Testing

Lighthouse was used to evaluate accessibility.

The homepage achieved:

`100 / 100`

The Wordle builder initially achieved:

`96 / 100`

Lighthouse identified a prohibited ARIA attribute issue affecting the Wordle phoneme tiles.

The Wordle tile accessibility implementation was updated, and the Wordle page was tested again.

The final Wordle accessibility score was:

`100 / 100`

This demonstrates how accessibility testing was used to identify and correct an implementation issue.

## Running the Application Locally

### Requirements

Before running the project locally, install:

- Node.js
- npm
- PostgreSQL

### Install Dependencies

From the project directory run:

```bash
npm install
```

### Database Connection

Create a `.env` file in the project root containing a PostgreSQL connection string.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/phoneme_builder"
```

The `.env` file is excluded from Git.

### Start Development Server

Run:

```bash
npm run dev
```

The application will normally be available at:

`http://localhost:3000`

## Docker

The project contains Docker configuration for the application and PostgreSQL database.

Docker-related files include:

- `Dockerfile`
- `docker-compose.yml`
- `docker-entrypoint.sh`
- `.dockerignore`

## Project Structure

```text
app/
  api/
    activities/
    metrics/
    usage-events/
    wordlists/
    words/
  about/
  dashboard/
  health/
  settings/
  word-search/
  wordle/

components/
  ActivityManager.tsx
  DashboardMetrics.tsx
  PageTimeTracker.tsx
  WordListManager.tsx
  WordManager.tsx
  WordleBuilder.tsx
  WordleGame.tsx
  WordSearchBuilder.tsx
  WordSearchGame.tsx

prisma/
  schema.prisma
  db.ts

tests/
  wordlist-crud.spec.ts
  wordle-generation.spec.ts

utils/
  generateWordleHtml.ts
  generateWordSearchHtml.ts

load-test.jmx
playwright.config.ts
Dockerfile
docker-compose.yml
docker-entrypoint.sh
README.md
```

## Validation and Error Handling

The application includes validation and error handling for database operations, activity configurations, generation workflows, and usage-event recording.

Application monitoring also exposes generation failures and system status information through the dashboard.

## Git Repository

Assessment 3 development is stored in the following GitHub repository:

`https://github.com/JoshuaD22212613/Cloud-Assessment-3`

The repository excludes local or generated files that should not be committed, including:

- `node_modules`
- `.next`
- `.env`
- Playwright generated reports and test results

## Assessment 3

The completed application demonstrates:

- Full-stack Next.js development.
- PostgreSQL database persistence.
- CRUD operations.
- Database-driven Wordle and Word Search activities.
- Saved activity configurations.
- Usage-event persistence.
- Dashboard reporting.
- Application health monitoring.
- Generation success and failure tracking.
- Page-duration metrics.
- Playwright end-to-end testing.
- JMeter load testing.
- Lighthouse accessibility testing and improvement.
- Docker support.
- Git and GitHub version control.