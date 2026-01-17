const { PrismaClient, UserRole, EventStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.review.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👥 Creating users...");
  const password = await bcrypt.hash("Test123!", 10);

  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        email: "admin@hypehouse.com",
        password,
        name: "Admin User",
        role: UserRole.ADMIN,
        bio: "HypeHouse platform administrator",
        location: "New York, NY",
        interests: ["Platform Management", "Community Building", "Events"],
        avatar: "https://ui-avatars.com/api/?name=Admin+User&background=7c3aed&color=fff&size=200",
        emailVerified: true,
        verified: true,
        acceptedHostTerms: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "john.host@test.com",
        password,
        name: "John Host",
        role: UserRole.HOST,
        bio: "Passionate event organizer and community builder with 5+ years of experience",
        location: "New York, NY",
        interests: ["Events", "Community", "Networking", "Fitness"],
        avatar: "https://ui-avatars.com/api/?name=John+Host&background=3b82f6&color=fff&size=200",
        emailVerified: true,
        verified: true,
        rating: 4.8,
        reviewCount: 15,
        acceptedHostTerms: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah.organizer@test.com",
        password,
        name: "Sarah Organizer",
        role: UserRole.HOST,
        bio: "Love bringing people together through amazing experiences. Specializing in tech and food events.",
        location: "San Francisco, CA",
        interests: ["Technology", "Food & Wine", "Music", "Networking"],
        avatar: "https://ui-avatars.com/api/?name=Sarah+Organizer&background=ec4899&color=fff&size=200",
        emailVerified: true,
        verified: true,
        rating: 4.9,
        reviewCount: 23,
        acceptedHostTerms: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "mike.user@test.com",
        password,
        name: "Mike Thompson",
        role: UserRole.USER,
        bio: "Adventure seeker and fitness enthusiast. Always looking for new experiences!",
        location: "Seattle, WA",
        interests: ["Fitness", "Outdoor Activities", "Sports", "Community"],
        avatar: "https://ui-avatars.com/api/?name=Mike+Thompson&background=10b981&color=fff&size=200",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "emma.participant@test.com",
        password,
        name: "Emma Davis",
        role: UserRole.USER,
        bio: "Tech lover and networking pro. Passionate about AI and Web3.",
        location: "Austin, TX",
        interests: ["Technology", "AI", "Web3", "Networking"],
        avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff&size=200",
        emailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "alex.user@test.com",
        password,
        name: "Alex Johnson",
        role: UserRole.USER,
        bio: "Food and music enthusiast exploring new experiences",
        location: "Chicago, IL",
        interests: ["Food", "Music", "Art", "Culture"],
        avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=8b5cf6&color=fff&size=200",
        emailVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create events
  console.log("🎉 Creating events...");

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const twoWeeks = new Date(now);
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const events = await Promise.all([
    // Free event - Tomorrow
    prisma.event.create({
      data: {
        title: "Morning Yoga Session in Central Park",
        description:
          "Join us for a refreshing morning yoga session in the heart of Central Park. All levels welcome! Bring your own mat and water bottle. We'll practice gentle flows and breathing exercises to start your day with positive energy.",
        eventType: "Sports & Fitness",
        location: "Central Park, New York, NY",
        latitude: 40.785091,
        longitude: -73.968285,
        date: tomorrow,
        maxParticipants: 20,
        currentCount: 3,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        tags: ["yoga", "wellness", "outdoor", "morning", "free"],
        hostId: users[0].id,
      },
    }),

    // Paid event - Next week
    prisma.event.create({
      data: {
        title: "Tech Networking Mixer - Web3 & AI",
        description:
          "An exclusive evening of networking with top professionals in Web3, AI, and blockchain technologies. Enjoy complimentary drinks and appetizers while connecting with innovators, investors, and entrepreneurs. Featured speakers from leading tech companies will share insights on the future of technology. Limited spots available!",
        eventType: "Tech & Innovation",
        location: "WeWork Downtown, 123 Main St, San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        date: nextWeek,
        maxParticipants: 50,
        currentCount: 3,
        price: 25.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
        tags: ["networking", "tech", "web3", "ai", "professional"],
        hostId: users[1].id,
      },
    }),

    // Free event - Next week
    prisma.event.create({
      data: {
        title: "Community BBQ & Picnic",
        description:
          "Join neighbors and friends for a fun-filled afternoon of great food, games, and community bonding. We'll provide the grill and basic supplies - bring a dish to share! Kids and pets welcome. Perfect opportunity to meet your neighbors and make new friends.",
        eventType: "Social & Networking",
        location: "Riverside Park, Seattle, WA",
        latitude: 47.6062,
        longitude: -122.3321,
        date: nextWeek,
        maxParticipants: 100,
        currentCount: 2,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
        tags: ["community", "picnic", "family-friendly", "outdoor", "potluck"],
        hostId: users[0].id,
      },
    }),

    // Paid event - Two weeks
    prisma.event.create({
      data: {
        title: "Live Jazz Night feat. The Blue Notes",
        description:
          "Experience an unforgettable evening of smooth jazz performed by the acclaimed Blue Notes quartet. Enjoy craft cocktails and a sophisticated atmosphere in our intimate venue. Seating is limited, so reserve your spot early. Doors open at 7 PM, show starts at 8 PM.",
        eventType: "Music & Concert",
        location: "The Jazz Lounge, 456 Music Ave, New Orleans, LA",
        latitude: 29.9511,
        longitude: -90.0715,
        date: twoWeeks,
        maxParticipants: 75,
        currentCount: 0,
        price: 35.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop",
        tags: ["jazz", "music", "live-performance", "cocktails", "nightlife"],
        hostId: users[1].id,
      },
    }),

    // Free event - Next month
    prisma.event.create({
      data: {
        title: "Beginner's Photography Workshop",
        description:
          "Learn the fundamentals of photography in this hands-on workshop! We'll cover composition, lighting, camera settings, and editing basics. Bring your camera (DSLR, mirrorless, or even smartphone). Perfect for beginners wanting to improve their photography skills. All skill levels welcome!",
        eventType: "Education & Learning",
        location: "Art Studio Downtown, 789 Creative Blvd, Austin, TX",
        latitude: 30.2672,
        longitude: -97.7431,
        date: nextMonth,
        maxParticipants: 15,
        currentCount: 0,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
        tags: ["photography", "workshop", "learning", "creative", "beginner"],
        hostId: users[0].id,
      },
    }),

    // Paid event - Next month
    prisma.event.create({
      data: {
        title: "Wine Tasting & Food Pairing Experience",
        description:
          "Indulge in an exquisite evening of wine tasting paired with gourmet small plates. Our sommelier will guide you through 6 premium wines from around the world, explaining tasting notes and perfect food pairings. Each wine is carefully selected and paired with artisan cheeses, charcuterie, and chef-prepared dishes. A truly sophisticated culinary adventure!",
        eventType: "Food & Drink",
        location: "Vineyard Restaurant, 321 Wine Country Rd, Napa Valley, CA",
        latitude: 38.2975,
        longitude: -122.2869,
        date: nextMonth,
        maxParticipants: 30,
        currentCount: 0,
        price: 75.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
        tags: ["wine", "tasting", "gourmet", "foodie", "premium"],
        hostId: users[1].id,
      },
    }),

    // Free event - Almost full
    prisma.event.create({
      data: {
        title: "5K Charity Fun Run for Local Schools",
        description:
          "Lace up your running shoes for a great cause! Join our annual 5K fun run benefiting local schools. All proceeds go directly to funding art and music programs. The route is beginner-friendly and includes water stations. Medals for all finishers! Registration includes a race t-shirt.",
        eventType: "Sports & Fitness",
        location: "City Sports Complex, Miami, FL",
        latitude: 25.7617,
        longitude: -80.1918,
        date: twoWeeks,
        maxParticipants: 12,
        currentCount: 0,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop",
        tags: ["running", "charity", "fitness", "community", "5k"],
        hostId: users[0].id,
      },
    }),

    // Paid event - Premium price
    prisma.event.create({
      data: {
        title: "Exclusive Rooftop Sunset Dinner Party",
        description:
          "Experience luxury dining under the stars at our exclusive rooftop venue. This intimate dinner party features a 5-course tasting menu prepared by a Michelin-starred chef, signature cocktails, live acoustic music, and breathtaking city views. Dress code: Smart casual. This is a premium experience with very limited seating - only 25 spots available.",
        eventType: "Food & Drink",
        location: "Skyline Rooftop, Downtown Chicago, IL",
        latitude: 41.8781,
        longitude: -87.6298,
        date: nextMonth,
        maxParticipants: 25,
        currentCount: 0,
        price: 150.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        tags: ["dinner", "rooftop", "exclusive", "fine-dining", "luxury"],
        hostId: users[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);

  // Add participants to some events
  console.log("👤 Adding participants to events...");

  const participants = await Promise.all([
    // Morning Yoga - 3 participants
    prisma.participant.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        paymentStatus: null,
        amountPaid: 0,
      },
    }),
    prisma.participant.create({
      data: {
        userId: users[3].id,
        eventId: events[0].id,
        paymentStatus: null,
        amountPaid: 0,
      },
    }),
    prisma.participant.create({
      data: {
        userId: users[4].id,
        eventId: events[0].id,
        paymentStatus: null,
        amountPaid: 0,
      },
    }),

    // Tech Networking (Paid) - 3 participants with payment
    prisma.participant.create({
      data: {
        userId: users[2].id,
        eventId: events[1].id,
        paymentStatus: "COMPLETED",
        amountPaid: 25.0,
      },
    }),
    prisma.participant.create({
      data: {
        userId: users[3].id,
        eventId: events[1].id,
        paymentStatus: "COMPLETED",
        amountPaid: 25.0,
      },
    }),
    prisma.participant.create({
      data: {
        userId: users[4].id,
        eventId: events[1].id,
        paymentStatus: "COMPLETED",
        amountPaid: 25.0,
      },
    }),

    // Community BBQ - 2 participants
    prisma.participant.create({
      data: {
        userId: users[2].id,
        eventId: events[2].id,
        paymentStatus: null,
        amountPaid: 0,
      },
    }),
    prisma.participant.create({
      data: {
        userId: users[4].id,
        eventId: events[2].id,
        paymentStatus: null,
        amountPaid: 0,
      },
    }),
  ]);

  console.log(`✅ Created ${participants.length} participant records`);

  console.log("\n✨ Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Events: ${events.length}`);
  console.log(`   - Free events: ${events.filter((e) => e.price === 0).length}`);
  console.log(
    `   - Paid events: ${events.filter((e) => e.price > 0).length}`
  );
  console.log(`   Participants: ${participants.length}`);
  console.log("\n🔐 Test Login Credentials:");
  console.log("   👑 ADMIN:");
  console.log("      Email: admin@hypehouse.com");
  console.log("      Password: Test123!");
  console.log("\n   🎭 HOSTS:");
  console.log("      Email: john.host@test.com");
  console.log("      Email: sarah.organizer@test.com");
  console.log("\n   👥 USERS:");
  console.log("      Email: mike.user@test.com");
  console.log("      Email: emma.participant@test.com");
  console.log("      Email: alex.user@test.com");
  console.log("\n   Password (all): Test123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
