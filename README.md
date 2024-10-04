# Slack Clone

This is a repository for Slack Clone: Next.js 14, Convex, Convex-Auth, React, TailwindCSS, ShadCN UI.

Key Features:

- Convex Database
- Convex Auth Authentication
- Google Auth
- Github Auth
- Realtime messages
- Realtime reactions on messages
- Message Threads
- Workspace CRUD opreations
- Workspace invitaion link + code
- Channel CRUD opreations
- Image upload
- One-to-one conversations
- ShadcnUI & TailwindCSS
- Full mobile responsiveness

# Final Version

To visit the website, [click here.](https://slackclone-ss.vercel.app)

### Cloning the repository

```shell
git clone https://github.com/ShethSamarth/slack-clone.git
```

### Setup .env file

```js
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
```

### Setup .env file for convex

```js
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

JWKS=
JWT_PRIVATE_KEY=
SITE_URL=
```

### Install packages

```shell
bun install
```

### Start convex development server

```shell
bunx convex dev
```

### Start the app

```shell
bun run dev
```
