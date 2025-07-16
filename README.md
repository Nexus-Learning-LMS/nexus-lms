# 🚀 Nexus Learning Platform

A full-stack Learning Management System (LMS) designed with a focus on collaborative administration and a unique, time-gated learning progression for students.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo-name)

### **[► Live Demo](https://nexus-learning.vercel.app)**

---

## ✨ Overview

The **Nexus Learning Platform** is an advanced e-learning application built to solve key challenges in online education. It provides a robust, secure, and intuitive environment for students, teachers, and administrators.

The platform moves beyond standard course delivery by implementing two core features:

* **Time-Gated Progression:** A "rolling window" of accessible chapters paces students, encouraging mastery before they can proceed. The window only advances after a user has completed all chapters within it and a 24-hour timer has elapsed. This unique system ensures students thoroughly engage with the material.
* **Collaborative Administration:** Multiple teachers can co-manage published courses, view analytics on user engagement and enrollments, and handle course publishing workflows, making it a powerful tool for educational organizations.

*(Placeholder for screenshots or a GIF of the application)*

---

## 🛠️ Tech Stack & Core Services

This project is built with a modern, full-stack TypeScript architecture, leveraging a suite of powerful tools and services to deliver a performant and scalable user experience.

| Technology / Service | Role in Project                                     |
| :------------------- | :-------------------------------------------------- |
| **Supabase** | Cloud-based PostgreSQL Database & Backend Services  |
| **Mux** | Video Streaming and Storage Service                 |
| **Clerk** | Authentication & Authorization                      |
| **UploadThing** | Course Thumbnail & File System                      |
| **Web3Forms** | Contact Form API                                    |
| **Vercel** | Deployment Service                                  |
| **Prisma** | ORM for Database Management                         |
| **Next.js** | Full-Stack Web Framework                            |
| **Tailwind CSS** | Utility-First CSS Framework                         |

---

## ⚙️ Getting Started (For Developers)

This section contains everything a developer needs to set up the project locally.

### Prerequisites

* **Node.js** (v18 or later)
* **npm** or **yarn**
* **Accounts** for all services listed in the tech stack table above.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd <your-project-directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### 🔑 Environment Variables

Create a `.env` file in the root of your project and populate it with the keys below.

```bash
# Supabase URLs
DATABASE_URL=""
DIRECT_URL=""

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Your Teacher/Admin User ID from Clerk
NEXT_PUBLIC_TEACHER_ID=""

# UploadThing Keys
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Mux Keys
MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""

# Web3Forms Key
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=""
```

**Where to retrieve environment variables:**

| Variable                             | Meaning                                                      | Where to Retrieve                                                                                              |
| :----------------------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                       | Connection string for the app (uses connection pooler).      | Supabase Dashboard > Project Settings > Database > Connection string (URI, port `6543`). **Append `?pgbouncer=true`**. |
| `DIRECT_URL`                         | Connection string for Prisma CLI commands (migrations, studio). | Supabase Dashboard > Project Settings > Database > Connection string (URI, port `5432`).                       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  | Public key for the Clerk frontend.                           | Clerk Dashboard > API Keys.                                                                                    |
| `CLERK_SECRET_KEY`                   | Secret key for the Clerk backend.                            | Clerk Dashboard > API Keys.                                                                                    |
| `NEXT_PUBLIC_TEACHER_ID`             | The User ID of the designated admin/teacher account.         | Clerk Dashboard > Users > Select the user > Copy User ID.                                                      |
| `UPLOADTHING_SECRET`                 | Secret key for UploadThing.                                  | UploadThing Dashboard > API Keys.                                                                              |
| `UPLOADTHING_APP_ID`                 | Application ID for UploadThing.                              | UploadThing Dashboard > API Keys.                                                                              |
| `MUX_TOKEN_ID`                       | Access Token ID for Mux.                                     | Mux Dashboard > Settings > API Access Tokens.                                                                  |
| `MUX_TOKEN_SECRET`                   | Secret Key for the Mux Access Token.                         | Mux Dashboard > Settings > API Access Tokens.                                                                  |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`   | Access key for the Web3Forms API.                            | Web3Forms Dashboard.                                                                                           |

<br>

---

## 💻 Development Commands

* **Run the local development server:**
    ```bash
    npm run dev
    ```
* **View the database locally with Prisma Studio:**
    This command opens a visual editor for your database.
    ```bash
    npx prisma studio
    ```
* **Modify the Database Schema:**
    When you change your `schema.prisma` file, you must first update the Prisma Client, then push the changes to your database.
    ```bash
    npx prisma generate
    npx prisma db push
    ```

---

## 📚 Managing Course Categories

You can add new course categories using two methods.

### Standard Method (Recommended)

1.  Open the **Supabase Dashboard** > **Table Editor**.
2.  Select the **Category** table.
3.  Click **"Insert Row"**.
4.  For the `id`, generate a random UUID using an online generator.
5.  Add the `name` for the category and save.

### Developer Method

1.  Configure the `scripts/seed.ts` file to add or change course categories.
2.  Run the script from your terminal:
    ```bash
    node scripts/seed.ts
    ```
3.  Use `npx prisma studio` to verify that the categories have been added.

---

## ☁️ Deployment

This application is optimized for and deployed on **Vercel**. For the best performance and to avoid potential issues with custom domains, it is recommended to use a **dedicated domain** rather than the default `.vercel.app` URL in a production environment.
