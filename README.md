# Phoneme Activity Builder

## Cloud Based Web Applications — Assessment 2

**Student:** Joshua Downie  
**Student Number:** 22212613

## Project Overview

The Phoneme Activity Builder is a full-stack web application designed to help teachers create phoneme-based classroom activities for Speech Pathology students.

The project extends the frontend developed in Assessment 1 by adding server-side API routes, PostgreSQL database storage, CRUD functionality, saved activity configurations, and Docker deployment.

Teachers can create and manage word lists containing words and ordered phonemes. The stored database content can then be used to generate interactive Phoneme Wordle and Phoneme Word Search activities.

The generated activities can be previewed in the application and downloaded as standalone HTML files.

## Main Features

### Phoneme Wordle

The Wordle builder allows a teacher to:

- Select a word list stored in the database.
- Select a target word.
- Use the ordered phonemes stored for that word.
- Select Easy, Medium, or Hard difficulty.
- Enable or disable hints.
- Preview the activity.
- Save the activity configuration to the database.
- Download the generated activity as a standalone HTML file.

### Phoneme Word Search

The Word Search builder allows a teacher to:

- Select a database word list.
- Use multiple words and their stored phonemes.
- Configure the activity difficulty.
- Enable or disable hints.
- Generate a phoneme-based puzzle grid.
- Preview the activity.
- Save the activity configuration to the database.
- Download the generated activity as a standalone HTML file.

### Data Management

The Settings page provides CRUD functionality for the application's stored data.

Users can:

- Create, view, edit, and delete word lists.
- Create, view, edit, and delete words.
- Store ordered phonemes for each word.
- Store multi-character phonemes such as `tʃ`.
- View, edit, and delete saved Wordle and Word Search configurations.

## Technology Stack

The project uses:

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- HTML and CSS
- Git and GitHub

## Database Design

The PostgreSQL database contains the following main models:

### WordList

Stores a named collection of words that can be used to generate activities.

### Word

Stores the written form of a word, an optional hint, and the word list it belongs to.

### Phoneme

Stores individual phoneme symbols for a word.

Each phoneme has a position value so that the phonemes remain in the correct order.

Phonemes are stored as strings, allowing both single-character and multi-character phoneme symbols.

### Activity

Stores saved Wordle and Word Search configurations.

Activity data includes:

- Title
- Activity type
- Difficulty
- Hint setting
- Word list
- Target word where applicable
- Grid size where applicable
- Maximum guesses where applicable

Multiple activity configurations can be stored in the database.

## API Routes

The application provides server-side API routes for database operations.

### Health Check

`GET /api/health`

Returns HTTP status `200 OK` when the application API is running.

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

The API validates incoming data and returns appropriate HTTP error responses for invalid IDs, missing required fields, malformed JSON, and invalid activity configurations.

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

### Initialise the Database

Run:

```bash
npx prisma db init
```

### Start Development Server

Run:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Production Build

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Docker Deployment

The project includes:

- `Dockerfile`
- `docker-compose.yml`
- `docker-entrypoint.sh`
- `.dockerignore`

Docker Compose runs two services:

1. The Next.js application.
2. A PostgreSQL database.

The application container waits for PostgreSQL to become healthy and automatically initialises the database schema before starting Next.js.

### Build and Start with Docker

Run:

```bash
docker compose up -d --build
```

The application will be available at:

```text
http://localhost:3000
```

The health endpoint can be tested at:

```text
http://localhost:3000/api/health
```

### Stop Docker Containers

Run:

```bash
docker compose down
```

### Fresh Database Test

To remove the Docker database volume and test the project from a completely fresh database:

```bash
docker compose down -v
docker compose up -d --build
```

The application will automatically initialise the required database schema.

## Project Structure

```text
app/
  api/
    activities/
    health/
    wordlists/
    words/
  about/
  settings/
  word-search/
  wordle/

components/
  ActivityManager.tsx
  WordListManager.tsx
  WordManager.tsx
  WordleBuilder.tsx
  WordleGame.tsx
  WordSearchBuilder.tsx
  WordSearchGame.tsx

data/
  phonemes.ts

prisma/
  schema.prisma
  db.ts

utils/
  generateWordleHtml.ts
  generateWordSearchHtml.ts

Dockerfile
docker-compose.yml
docker-entrypoint.sh
README.md
```

## Activity Generation

Wordle and Word Search activities are generated from data retrieved from the PostgreSQL database.

The activity generators do not rely on a fixed target word or fixed classroom word list.

For Wordle, the selected database word and its ordered phonemes are passed to the HTML generator.

For Word Search, the selected database words and their phonemes are used to construct the puzzle.

This allows teachers to change database content without modifying the activity generation source code.

## Validation and Error Handling

The application includes validation for:

- Invalid database IDs.
- Missing activity titles.
- Missing word list selections.
- Empty words.
- Empty phoneme arrays.
- Invalid phoneme values.
- Invalid activity types.
- Invalid difficulty settings.
- Invalid grid sizes.
- Invalid maximum guess values.
- Missing Wordle target words.
- Target words belonging to the wrong word list.
- Malformed JSON request bodies.
- Missing database records.

API errors return appropriate HTTP status codes and readable error messages.

## Git Repository

The project source code and development history are stored in the Assessment 2 GitHub repository.

Repository:

https://github.com/JoshuaD22212613/Cloud-Assessment-2

The repository excludes files and directories that should not be submitted to source control, including:

- `node_modules`
- `.next`
- `.env`

## Assessment 2

This project was developed for Cloud Based Web Applications Assessment 2.

The final application demonstrates:

- Full-stack Next.js development.
- PostgreSQL database persistence.
- Prisma database access.
- REST-style CRUD API routes.
- Ordered and multi-character phoneme storage.
- Multiple saved activity configurations.
- Database-driven frontend functionality.
- Downloadable Wordle and Word Search HTML activities.
- Input validation and error handling.
- Health check endpoint.
- Docker containerisation.
- Git and GitHub version control.