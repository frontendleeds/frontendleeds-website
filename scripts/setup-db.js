// Script to set up the correct Prisma schema based on environment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const sourceSchema = isProduction ? 'schema.prod.prisma' : 'schema.dev.prisma';
const targetSchema = 'schema.prisma';

// Paths
const prismaDir = path.join(__dirname, '..', 'prisma');
const sourcePath = path.join(prismaDir, sourceSchema);
const targetPath = path.join(prismaDir, targetSchema);

// Copy the appropriate schema file
console.log(`Setting up database for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} environment`);
console.log(`Copying ${sourceSchema} to ${targetSchema}`);

try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('Schema file copied successfully');
} catch (error) {
  console.error('Error copying schema file:', error.message);
  process.exit(1);
}

// Set the DATABASE_URL environment variable based on environment
if (isProduction) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_PRODUCTION;
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEVELOPMENT;
}

console.log(`DATABASE_URL set to ${process.env.DATABASE_URL}`);
console.log('Database setup complete');
