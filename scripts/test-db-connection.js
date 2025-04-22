// Script to test database connection based on environment

// Simulate different environments
const testEnvironments = ['development', 'production'];

async function testConnection(environment) {
  console.log(`\n--- Testing ${environment} environment ---`);
  
  // Set NODE_ENV to simulate the environment
  process.env.NODE_ENV = environment;
  
  try {
    // Dynamically import the prisma module to get fresh instance with current environment
    const prismaModule = await import('../src/lib/prisma.js');
    const prisma = prismaModule.prisma;
    
    // Log which database URL is being used
    console.log(`Using database URL: ${process.env.DATABASE_URL}`);
    
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful!', result);
    
    // Disconnect from the database
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

// Run tests for each environment
async function runTests() {
  for (const env of testEnvironments) {
    await testConnection(env);
  }
}

runTests().catch(console.error);
