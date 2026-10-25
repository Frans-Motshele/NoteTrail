# NoteTrail

A full-stack note-taking app built with the MERN stack. Create, view, edit, and delete notes through a clean dark-themed interface, backed by a REST API, MongoDB, and Upstash Redis rate limiting.

## Live Demo

**[https://notetrail.onrender.com](https://notetrail.onrender.com/)**

> Hosted on Render. If the app hasn't been used for a while, the first load may take a short time while the server wakes up.

## Screenshots

### Home
![NoteTrail home page showing a note card](docs/screenshots/home.jpeg)

### Empty State
![NoteTrail empty state with a prompt to create the first note](docs/screenshots/empty-state.jpeg)

### Create a Note
![Create new note form](docs/screenshots/create-note.jpeg)

### Edit a Note
![Note detail page with edit and delete options](docs/screenshots/edit-note.jpeg)

## Features

- Create, read, update, and delete notes (full CRUD)
- Notes sorted newest first, with automatic created/updated timestamps
- Note detail page for viewing and editing a single note
- API rate limiting (100 requests per 60 seconds) with a dedicated "rate limited" UI
- Toast notifications for success and error feedback
- Empty-state screen when there are no notes
- Single-deployment setup: in production, Express serves the built React app

## Tech Stack

**Frontend**
- React 19 with Vite
- React Router 7
- Tailwind CSS + DaisyUI
- Axios, React Hot Toast, Lucide React

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Upstash Redis + `@upstash/ratelimit`
- dotenv, CORS

## Project Structure

```
NoteTrail/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
│       ├── config/          # MongoDB (db.js) and Upstash (upstash.js) setup
│       ├── controller/      # Notes request handlers
│       ├── middleware/      # Rate limiter
│       ├── model/           # Mongoose Note schema
│       ├── routes/          # /api/notes routes
│       └── server.js        # Express entry point
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf           # Serves the React build, proxies /api to the backend
│   └── src/
│       ├── components/      # Navbar, NoteCard, NotesNotFound, RateLimitedUI
│       ├── Pages/           # HomePage, CreatePage, NoteDetailPage
│       ├── lib/             # Axios instance and helpers
│       ├── App.jsx
│       └── main.jsx
├── docker-compose.yml       # Runs backend and frontend together
└── package.json             # Root build/start scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A free [Upstash Redis](https://upstash.com/) database for rate limiting
- [Docker](https://www.docker.com/) and Docker Compose (optional, only for the Docker setup)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Frans-Motshele/NoteTrail.git
cd NoteTrail
```

### 2. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```env
Port=5001
Mongo_url=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

| Variable | Description |
| --- | --- |
| `Port` | Port the Express server listens on (the frontend dev setup expects `5001`) |
| `Mongo_url` | MongoDB connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `NODE_ENV` | Set to `production` when deploying (enables static serving of the frontend) |

### 3. Run in development

Start the backend:

```bash
cd backend
npm install
npm run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

In development, CORS is enabled for `http://localhost:5173`, and the frontend talks to `http://localhost:5001/api`.

### 4. Build and run for production

From the project root:

```bash
npm run build   # installs dependencies and builds the frontend
npm start       # starts the backend, which serves frontend/dist
```

Make sure `NODE_ENV=production` is set in your hosting environment. The Express server then serves the React build and handles API requests from the same domain.

### 5. Run with Docker
 
The repo includes a Dockerfile for each service and a `docker-compose.yml` that runs both.
 
- **Backend:** Node 22 (Alpine) running the Express API on port `5001`, reachable only inside the Docker network.
- **Frontend:** a multi-stage build that compiles the React app, then serves it with Nginx on port `80`. Nginx forwards `/api/` requests to the backend and falls back to `index.html` for client-side routes.
  
1. Create `backend/.env` as described in [step 2](#2-configure-environment-variables). The `.env` file is excluded from the image by `.dockerignore` and loaded at runtime through `env_file`.
2. From the project root, build and start both containers:
   
```bash
docker compose up --build
```
 
3. Open http://localhost.
   
Useful commands:
 
```bash
docker compose up -d --build   # run in the background
docker compose logs -f         # follow logs
docker compose down            # stop and remove containers
```
## Docker Deployment
 
Prebuilt images for NoteTrail are published on Docker Hub, so you can run the app without cloning the repo or building anything locally.
 
| Service | Image |
| --- | --- |
| Backend (Express API) | fransmotshele/notetrail-backend:latest |
| Frontend (React + Nginx) | fransmotshele/notetrail-frontend:latest |
 
 
### 1. Create the environment file
 
Create a folder for the deployment and add a `.env` file in it:
 
```env
Port=5001
Mongo_url=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```
 
### 2. Pull docker-compose.prod.yml file

 Automatically pulls the frontend and backend images from Docker Hub images from docker hub, creates the containers from those images, starts the containers in the background and connects the frontend and backend through the Compose network.

> The backend service must be named `backend`. The frontend's Nginx config proxies `/api/` requests to `http://backend:5001`.
 
### 3. Start the application
 
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```
 
Then open http://localhost in your browser. Compose pulls any image that isn't already available locally.
 
### Managing the deployment
 
```bash
docker compose ps              # check container status
docker compose logs -f         # follow logs
docker compose pull            # fetch newer images
docker compose up -d           # recreate containers with the new images
docker compose down            # stop and remove containers
```
 
### Notes
 
- MongoDB and Upstash Redis are external services, so no database container is needed. Make sure your MongoDB instance accepts connections from the machine running Docker (for Atlas, add its IP to the network access list).
- To serve on a different host port, change `"80:80"` to something like `"8080:80"` and open http://localhost:8080.
- Never bake your `.env` into an image or commit it to Git. Pass it in at runtime as shown above.
## API Reference

Base URL: `/api/notes`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/notes` | Get all notes (newest first) |
| `GET` | `/api/notes/:id` | Get a single note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Note model

```json
{
  "_id": "string",
  "title": "string (required)",
  "content": "string (required)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Example: create a note

```bash
curl -X POST http://localhost:5001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Groceries", "content": "Milk, eggs, bread"}'
```

### Rate limiting

Requests are limited to 100 per 60 seconds using a sliding window. Exceeding the limit returns `429 Too Many Requests`, and the frontend shows a rate-limit notice.

## Scripts

**Root**

| Script | Description |
| --- | --- |
| `npm run build` | Install backend and frontend dependencies, then build the frontend |
| `npm start` | Start the backend server |

**Backend** (`/backend`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start with Node |

**Frontend** (`/frontend`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License.

## Author

**Frans Motshele** - [GitHub](https://github.com/Frans-Motshele)
