# Project Rules

## Overview
This document outlines the rules, standards, and structure for the Planner and Habit Tracker application.

## Tech Stack

### Frontend
-   **Framework**: Next.js v16.0.5
-   **Language**: TypeScript
-   **Styling**: Use `shadcn/ui` components (based on Radix UI and Tailwind CSS).
-   **Icons**: Use `lucide-react`.
-   **State Management**: Use `swr` for server state. Use `zustand` for global client state. Use React Context only for static providers (like themes).
-   **Validation**: Use `zod` for form validation.
-   **Forms**: Use `react-hook-form` combined with `zod`.
-   **Authentication**: Use custom authentication with JWT.

### Backend
-   **Runtime**: Bun v1.3.3
-   **Framework**: Express.js v5.1.0
-   **Database**: PostgreSQL (using Bun's built-in `bun:sql` or `pg` driver compatible with Bun)
-   **Validation**: Zod (preferred for schema validation)
-   **Rate Limiting**: express-rate-limit
-   **Security**: helmet, cors

## Frontend Rules (`planner-frontend`)

### Folder Structure
```
planner-frontend/
├── app/                  # App Router pages (Server Components by default)
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── api/              # Next.js API routes (if needed, prefer backend)
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components across features
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

### Guidelines
-   **Server Components**: Use Server Components by default. Only add `"use client"` when interactivity (state, effects, event listeners) is required.
-   **Page Files**: All `page.tsx` files MUST be Server Components.
-   **Shadcn**: Use `npx shadcn@latest add [component]` to add UI components. Do not build custom UI elements if a shadcn equivalent exists.
-   **Internationalization**: Wrap text in `t()` from `next-intl`.
-   **Data Fetching (SWR)**:
    -   **Mandatory SWR**: Use `swr` for all client-side data fetching.
    -   **Custom Hooks**: Encapsulate all data fetching and mutation logic in `hooks/`.
    -   **Central API Config**: Define all API routes in `lib/api-config.ts` and use them as SWR keys.
    -   **Fetcher**: Use the centralized `lib/fetcher.ts` to handle headers and errors.
    -   **Optimistic Updates**: Implement optimistic updates in mutation hooks.
    -   **No Browser Cache**: Ensure fetcher prevents default browser caching (use `no-store` or similar headers).

## Backend Rules (`planner-backend`)

### Folder Structure
```
planner-backend/
├── src/
│   ├── routes/           # Express routes definitions
│   ├── controllers/      # Request handlers (logging, response)
│   ├── services/         # Business logic
│   ├── repositories/     # Database operations
│   ├── validate/         # Zod schemas for request validation
│   ├── middleware/       # Express middleware (auth, error, logging)
│   ├── utils/            # Helper functions
│   ├── config/           # Environment and DB configuration
│   └── app.ts            # App entry point
└── package.json
```

### Guidelines
-   **Repositories**: Handle all direct database operations (SQL queries).
-   **Services**: Handle business logic, data processing, and call repositories.
-   **Controllers**: Handle HTTP requests, logging, validation (via middleware), call services, and send responses.
-   **Validation**: Use `zod` schemas in the `validate/` folder to validate incoming request bodies and query parameters.
-   **Response Format**:
    All API responses must follow this standard format:
    ```json
    {
      "success": boolean,
      "data": any,      // Present on success
      "error": string,  // Present on error (code or type)
      "message": string // Human readable message
    }
    ```
-   **Error Handling**:
    -   Use a global error handling middleware.
    -   Create a custom `AppError` class that extends `Error` and includes `statusCode`.
    -   Catch async errors using a wrapper or Express 5's built-in async error handling (Express 5 supports promises natively).
-   **Logging**:
    -   Implement request logging (e.g., using `morgan` or custom middleware).
    -   Log errors to the console (or file/service in production).
-   **Rate Limiting**:
    -   Apply `express-rate-limit` to all routes, with stricter limits on auth routes.

## Authentication
-   **Strategy**: JWT (JSON Web Tokens).
-   **Implementation**:
    -   Frontend: `next-auth` (Auth.js) handles session management.
    -   Backend: Verify JWT token in middleware for protected routes.
