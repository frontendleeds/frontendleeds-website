# Frontend Leeds Community Platform

A modern web application for the Frontend Leeds community, built with Next.js, Prisma, and TailwindCSS. This platform enables community members to discover events, apply to speak, view resources, and connect with other frontend developers in Leeds.

## Features

- **Event Management**: Browse, RSVP to, and share upcoming community events
- **Speaker Applications**: Apply to speak at future events
- **User Authentication**: Secure sign-up and login functionality
- **Admin Dashboard**: Manage events, users, and speaker applications
- **Gallery**: View photos from past events
- **Resources**: Access community resources and materials
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Optimized for all device sizes

## Technologies

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: 
  - Development: SQLite
  - Production: PostgreSQL
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with next-themes for dark mode

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/frontend-leeds.git
   cd frontend-leeds
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Edit the `.env` file with your configuration:
   - For development, use SQLite (already configured)
   - For production, add your PostgreSQL connection string

### Database Setup

The project uses SQLite for development and PostgreSQL for production. The database connection is automatically configured based on the environment:

- In development mode, it uses `DATABASE_URL` pointing to a local SQLite file
- In production mode, it uses `DATABASE_URL` pointing to your PostgreSQL database

make sure to change provider to sqlite on Development
To initialize the database:

```bash
# Run migrations
npx prisma migrate dev

# Seed the database with initial data
npm run seed
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

## Environment Variables

Create a `.env` file with the following variables:

```
# Development database (SQLite)
DATABASE_URL_DEVELOPMENT="file:./dev.db"

# Production database (PostgreSQL)
DATABASE_URL_PRODUCTION="postgres://user:password@host:port/database?sslmode=require"

# NextAuth configuration
NEXTAUTH_SECRET="your-nextauth-secret-replace-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality
- `npm run seed`: Seed the database with initial data

## Project Structure

```
frontend-leeds/
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── events/          # Event-related pages
│   │   ├── gallery/         # Gallery pages
│   │   └── resources/       # Resources pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and libraries
│   └── types/               # TypeScript type definitions
├── .env.example             # Example environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
└── tailwind.config.js       # TailwindCSS configuration
```

## Database Configuration

The application is configured to use SQLite in development and PostgreSQL in production. This is managed by the `setup-db.js` script which 

 allows for easy local development with SQLite while using a more robust PostgreSQL database in production.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
