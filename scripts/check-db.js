import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Check users
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    // Check events
    const events = await prisma.event.findMany();
    console.log('Events:', events);

    // Check RSVPs
    const rsvps = await prisma.rSVP.findMany();
    console.log('RSVPs:', rsvps);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
