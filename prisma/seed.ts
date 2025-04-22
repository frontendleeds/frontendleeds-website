import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.rSVP.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // In production, use hashed password
      role: Role.ADMIN,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create regular user
  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123', // In production, use hashed password
      role: Role.USER,
    },
  });

  console.log('Created regular user:', user.email);

  // Create events
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Introduction to React',
        description: 'Learn the basics of React and how to build your first component.',
        content: `
# Introduction to React

React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible.

## What you'll learn

- React fundamentals
- Component-based architecture
- JSX syntax
- State and props
- Hooks

## Requirements

- Basic knowledge of HTML, CSS, and JavaScript
- Node.js installed on your computer

## Agenda

1. Introduction to React
2. Setting up a React project
3. Creating your first component
4. Working with state and props
5. Handling events
6. Building a simple application

We look forward to seeing you there!
        `,
        location: 'Leeds Digital Hub, 1 Eastgate, Leeds',
        startTime: new Date(now.getTime() + oneWeek),
        endTime: new Date(now.getTime() + oneWeek + 3 * 60 * 60 * 1000),
        published: true,
        creatorId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Advanced CSS Techniques',
        description: 'Dive deep into advanced CSS techniques like Grid, Flexbox, and CSS Variables.',
        content: `
# Advanced CSS Techniques

Take your CSS skills to the next level with this workshop on advanced techniques.

## What you'll learn

- CSS Grid layout
- Flexbox mastery
- CSS Variables
- Responsive design strategies
- CSS animations and transitions

## Requirements

- Solid understanding of basic CSS
- Laptop with a code editor

## Agenda

1. CSS Grid vs Flexbox
2. Building complex layouts
3. Using CSS Variables for theming
4. Creating responsive designs without media queries
5. Advanced animations and transitions

We look forward to seeing you there!
        `,
        location: 'Leeds Library, Calverley Street, Leeds',
        startTime: new Date(now.getTime() + 2 * oneWeek),
        endTime: new Date(now.getTime() + 2 * oneWeek + 3 * 60 * 60 * 1000),
        published: true,
        creatorId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'JavaScript Performance Optimization',
        description: 'Learn how to optimize your JavaScript code for better performance.',
        content: `
# JavaScript Performance Optimization

Performance matters! Learn how to make your JavaScript code faster and more efficient.

## What you'll learn

- Common performance bottlenecks
- Measuring performance
- Memory management
- Efficient DOM manipulation
- Async patterns for better UX

## Requirements

- Intermediate JavaScript knowledge
- Familiarity with browser developer tools

## Agenda

1. Understanding the JavaScript engine
2. Identifying performance issues
3. Optimizing loops and functions
4. Memory management and garbage collection
5. Async patterns for responsive UIs

We look forward to seeing you there!
        `,
        location: 'Duke Studios, Sheaf Street, Leeds',
        startTime: new Date(now.getTime() + 3 * oneWeek),
        endTime: new Date(now.getTime() + 3 * oneWeek + 3 * 60 * 60 * 1000),
        published: true,
        creatorId: admin.id,
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // Create RSVPs
  const rsvp = await prisma.rSVP.create({
    data: {
      userId: user.id,
      eventId: events[0].id,
      status: 'GOING',
    },
  });

  console.log('Created RSVP:', rsvp);

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
