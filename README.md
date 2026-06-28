
# Java Full-Stack Portfolio Website

This is a portfolio website with a React/Vite frontend and a Java 21 backend.

The Java backend serves:

- `GET /api/portfolio` for website project and skill content
- `POST /api/contact` for contact form submissions
- the built website from `dist/`

## Frontend Development

Run the website frontend with Vite:

```powershell
npm run dev
```

For API calls during development, start the Java backend too:

```powershell
npm run backend:start
```

## Full-Stack Website Build

Build both the website and Java backend:

```powershell
npm run fullstack:build
```

Run the full-stack Java-served website:

```powershell
npm run backend:start
```

Then open:

```text
http://localhost:8080
```

## Contact Form Email

The contact form always saves submissions to:

```text
backend/data/messages.jsonl
```

To also receive contact form submissions by email, configure SMTP before starting the backend.
For Gmail, create an app password in your Google account and use it as `SMTP_PASSWORD`.

```powershell
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="465"
$env:SMTP_USERNAME="vivek130304@gmail.com"
$env:SMTP_PASSWORD="your-gmail-app-password"
$env:SMTP_FROM_EMAIL="vivek130304@gmail.com"
$env:CONTACT_TO_EMAIL="vivek130304@gmail.com"
npm run backend:start
```

If SMTP is not configured, the backend will still accept the form and save the message locally, but no email will be sent.
