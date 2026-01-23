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
  const threeDays = new Date(now);
  threeDays.setDate(threeDays.getDate() + 3);
  const fiveDays = new Date(now);
  fiveDays.setDate(fiveDays.getDate() + 5);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const tenDays = new Date(now);
  tenDays.setDate(tenDays.getDate() + 10);
  const twoWeeks = new Date(now);
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  const threeWeeks = new Date(now);
  threeWeeks.setDate(threeWeeks.getDate() + 21);
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const sixWeeks = new Date(now);
  sixWeeks.setDate(sixWeeks.getDate() + 42);

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

    // Startup Pitch Night
    prisma.event.create({
      data: {
        title: "Startup Pitch Night - Investor Connect",
        description:
          "Watch 10 promising startups pitch their ideas to a panel of angel investors and VCs. Network with founders, investors, and tech enthusiasts. Great opportunity to discover the next big thing or find investment opportunities. Refreshments provided.",
        eventType: "Tech & Innovation",
        location: "Innovation Hub, 500 Startup Lane, Boston, MA",
        latitude: 42.3601,
        longitude: -71.0589,
        date: threeDays,
        maxParticipants: 80,
        currentCount: 12,
        price: 15.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
        tags: ["startup", "pitch", "investors", "networking", "tech"],
        hostId: users[2].id,
      },
    }),

    // Open Mic Comedy Night
    prisma.event.create({
      data: {
        title: "Open Mic Comedy Night",
        description:
          "Laugh your heart out at our weekly open mic comedy night! Whether you want to perform or just enjoy the show, everyone is welcome. Sign up to perform or grab a seat and enjoy local comedians trying out new material. Two-drink minimum.",
        eventType: "Social & Networking",
        location: "The Laugh Factory, 789 Comedy St, Los Angeles, CA",
        latitude: 34.0522,
        longitude: -118.2437,
        date: fiveDays,
        maxParticipants: 100,
        currentCount: 23,
        price: 10.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop",
        tags: ["comedy", "open-mic", "entertainment", "nightlife", "fun"],
        hostId: users[1].id,
      },
    }),

    // Beach Volleyball Tournament
    prisma.event.create({
      data: {
        title: "Beach Volleyball Tournament",
        description:
          "Grab your friends and join our beach volleyball tournament! Teams of 4 compete in a fun, friendly atmosphere. Prizes for top 3 teams. All skill levels welcome - the goal is to have fun! Sunscreen and water provided.",
        eventType: "Sports & Fitness",
        location: "Santa Monica Beach, Los Angeles, CA",
        latitude: 34.0195,
        longitude: -118.4912,
        date: nextWeek,
        maxParticipants: 48,
        currentCount: 16,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop",
        tags: ["volleyball", "beach", "tournament", "sports", "outdoor"],
        hostId: users[1].id,
      },
    }),

    // Coding Bootcamp Preview
    prisma.event.create({
      data: {
        title: "Free Coding Bootcamp Preview - Learn Web Dev",
        description:
          "Curious about coding? Join our free 3-hour preview session where you'll build your first website! No experience needed. Learn HTML, CSS, and basic JavaScript. Perfect for career changers or anyone curious about tech. Laptops provided.",
        eventType: "Education & Learning",
        location: "Code Academy, 123 Developer Way, Denver, CO",
        latitude: 39.7392,
        longitude: -104.9903,
        date: tenDays,
        maxParticipants: 30,
        currentCount: 8,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
        tags: ["coding", "bootcamp", "learning", "web-development", "free"],
        hostId: users[2].id,
      },
    }),

    // Indie Music Festival
    prisma.event.create({
      data: {
        title: "Indie Music Festival - Local Artists Showcase",
        description:
          "Discover amazing local indie artists at this outdoor music festival! Featuring 8 bands across 2 stages. Food trucks, craft vendors, and a beer garden. Family-friendly until 6 PM. Bring blankets and lawn chairs!",
        eventType: "Music & Concert",
        location: "Piedmont Park, Atlanta, GA",
        latitude: 33.7879,
        longitude: -84.3742,
        date: twoWeeks,
        maxParticipants: 500,
        currentCount: 127,
        price: 25.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
        tags: ["music", "festival", "indie", "outdoor", "live-music"],
        hostId: users[1].id,
      },
    }),

    // Entrepreneurs Breakfast Club
    prisma.event.create({
      data: {
        title: "Entrepreneurs Breakfast Club",
        description:
          "Start your day with inspiration! Join fellow entrepreneurs for breakfast, coffee, and powerful discussions. Each week features a successful founder sharing their journey. Great for networking and finding collaborators or mentors.",
        eventType: "Networking",
        location: "The Business Cafe, 456 Enterprise Blvd, Portland, OR",
        latitude: 45.5152,
        longitude: -122.6784,
        date: threeDays,
        maxParticipants: 25,
        currentCount: 11,
        price: 20.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
        tags: ["entrepreneurs", "breakfast", "networking", "business", "mentorship"],
        hostId: users[2].id,
      },
    }),

    // Hiking & Nature Walk
    prisma.event.create({
      data: {
        title: "Sunset Hiking Adventure",
        description:
          "Join us for a moderate 5-mile hike ending with stunning sunset views! Trail is suitable for intermediate hikers. We'll take breaks for photos and nature appreciation. Bring water, snacks, and a flashlight for the walk back. Carpooling available.",
        eventType: "Sports & Fitness",
        location: "Runyon Canyon Park, Los Angeles, CA",
        latitude: 34.1061,
        longitude: -118.3487,
        date: fiveDays,
        maxParticipants: 20,
        currentCount: 7,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
        tags: ["hiking", "nature", "sunset", "outdoor", "fitness"],
        hostId: users[1].id,
      },
    }),

    // Book Club Meetup
    prisma.event.create({
      data: {
        title: "Monthly Book Club - Fiction Lovers",
        description:
          "This month we're discussing 'The Midnight Library' by Matt Haig. Join our friendly group for thoughtful discussion, wine, and snacks. New members always welcome! No pressure to finish the book - just come ready to chat about life and literature.",
        eventType: "Meetup",
        location: "Cozy Corner Bookshop, 234 Reading Lane, Nashville, TN",
        latitude: 36.1627,
        longitude: -86.7816,
        date: threeWeeks,
        maxParticipants: 15,
        currentCount: 6,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
        tags: ["book-club", "reading", "discussion", "social", "literature"],
        hostId: users[2].id,
      },
    }),

    // Salsa Dancing Class
    prisma.event.create({
      data: {
        title: "Salsa Dancing - Beginner Friendly",
        description:
          "Learn to salsa in a fun, judgment-free environment! No partner needed - we rotate throughout the class. Our experienced instructors will have you dancing in no time. Wear comfortable shoes. Social dancing after class!",
        eventType: "Social & Networking",
        location: "Latin Dance Studio, 567 Rhythm Ave, Miami, FL",
        latitude: 25.7617,
        longitude: -80.1918,
        date: nextWeek,
        maxParticipants: 40,
        currentCount: 18,
        price: 15.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop",
        tags: ["salsa", "dancing", "beginner", "social", "latin"],
        hostId: users[1].id,
      },
    }),

    // AI Workshop
    prisma.event.create({
      data: {
        title: "Hands-On AI Workshop - Build Your First Chatbot",
        description:
          "Get hands-on experience with AI! In this workshop, you'll learn the basics of machine learning and build a simple chatbot using Python. Basic programming knowledge helpful but not required. Laptops provided, but bring your own if preferred.",
        eventType: "Tech & Innovation",
        location: "Tech Hub, 890 Innovation Dr, San Jose, CA",
        latitude: 37.3382,
        longitude: -121.8863,
        date: twoWeeks,
        maxParticipants: 25,
        currentCount: 14,
        price: 45.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        tags: ["ai", "workshop", "chatbot", "python", "machine-learning"],
        hostId: users[2].id,
      },
    }),

    // Farmers Market Tour
    prisma.event.create({
      data: {
        title: "Farmers Market Food Tour & Cooking Demo",
        description:
          "Explore the best of local produce with a guided tour of the farmers market! Meet local farmers, sample fresh foods, and learn about sustainable eating. Ends with a cooking demonstration using market ingredients. Recipes included!",
        eventType: "Food & Drink",
        location: "Union Square Farmers Market, New York, NY",
        latitude: 40.7359,
        longitude: -73.9911,
        date: tenDays,
        maxParticipants: 20,
        currentCount: 9,
        price: 35.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop",
        tags: ["farmers-market", "food", "cooking", "sustainable", "local"],
        hostId: users[1].id,
      },
    }),

    // Meditation & Mindfulness
    prisma.event.create({
      data: {
        title: "Guided Meditation & Mindfulness Session",
        description:
          "Escape the stress of daily life with our guided meditation session. Perfect for beginners and experienced practitioners alike. Learn breathing techniques, body scanning, and mindful awareness. Leave feeling refreshed and centered. Mats provided.",
        eventType: "Sports & Fitness",
        location: "Zen Garden Studio, 123 Peace Way, San Diego, CA",
        latitude: 32.7157,
        longitude: -117.1611,
        date: threeDays,
        maxParticipants: 20,
        currentCount: 5,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        tags: ["meditation", "mindfulness", "wellness", "relaxation", "free"],
        hostId: users[2].id,
      },
    }),

    // Rock Climbing Intro
    prisma.event.create({
      data: {
        title: "Indoor Rock Climbing - First Timers Welcome",
        description:
          "Try rock climbing in a safe, indoor environment! Our certified instructors will teach you the basics of climbing, belaying, and safety. All equipment provided. Great for building strength and confidence. No experience necessary!",
        eventType: "Sports & Fitness",
        location: "Summit Climbing Gym, 456 Vertical St, Phoenix, AZ",
        latitude: 33.4484,
        longitude: -112.074,
        date: nextWeek,
        maxParticipants: 16,
        currentCount: 4,
        price: 30.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop",
        tags: ["rock-climbing", "indoor", "fitness", "adventure", "beginner"],
        hostId: users[1].id,
      },
    }),

    // Professional Headshot Session
    prisma.event.create({
      data: {
        title: "Professional Headshot Photo Session",
        description:
          "Update your LinkedIn and professional profiles with quality headshots! Quick 15-minute sessions with a professional photographer. Includes 3 edited digital photos. Perfect for job seekers, entrepreneurs, and professionals. Business casual attire recommended.",
        eventType: "Networking",
        location: "Portrait Studio, 789 Business Park, Charlotte, NC",
        latitude: 35.2271,
        longitude: -80.8431,
        date: threeWeeks,
        maxParticipants: 20,
        currentCount: 8,
        price: 50.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        tags: ["headshots", "photography", "professional", "linkedin", "career"],
        hostId: users[2].id,
      },
    }),

    // Board Game Night
    prisma.event.create({
      data: {
        title: "Board Game Night - Strategy Games",
        description:
          "Join fellow board game enthusiasts for an evening of strategy games! We have Catan, Ticket to Ride, Wingspan, and more. All skill levels welcome. Great way to make new friends while exercising your brain. Snacks and drinks available for purchase.",
        eventType: "Meetup",
        location: "Game Haven Cafe, 321 Play Street, Seattle, WA",
        latitude: 47.6062,
        longitude: -122.3321,
        date: fiveDays,
        maxParticipants: 30,
        currentCount: 12,
        price: 5.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=600&fit=crop",
        tags: ["board-games", "strategy", "social", "games", "fun"],
        hostId: users[1].id,
      },
    }),

    // Public Speaking Workshop
    prisma.event.create({
      data: {
        title: "Conquer Your Fear - Public Speaking Workshop",
        description:
          "Overcome stage fright and become a confident speaker! This supportive workshop covers techniques for managing anxiety, structuring talks, and engaging audiences. Includes practice sessions with constructive feedback. Transform your communication skills!",
        eventType: "Education & Learning",
        location: "Leadership Center, 567 Success Ave, Dallas, TX",
        latitude: 32.7767,
        longitude: -96.797,
        date: twoWeeks,
        maxParticipants: 20,
        currentCount: 7,
        price: 40.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
        tags: ["public-speaking", "workshop", "confidence", "communication", "skills"],
        hostId: users[2].id,
      },
    }),

    // Acoustic Open Mic
    prisma.event.create({
      data: {
        title: "Acoustic Open Mic Night",
        description:
          "Calling all singers, songwriters, and musicians! Share your original songs or covers in an intimate coffeehouse setting. 10-minute slots available. Or just come to enjoy great live acoustic music. Coffee and pastries available.",
        eventType: "Music & Concert",
        location: "Harmony Coffee House, 234 Melody Lane, Austin, TX",
        latitude: 30.2672,
        longitude: -97.7431,
        date: nextWeek,
        maxParticipants: 50,
        currentCount: 19,
        price: 0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop",
        tags: ["acoustic", "open-mic", "music", "live", "singer-songwriter"],
        hostId: users[1].id,
      },
    }),

    // Cryptocurrency 101
    prisma.event.create({
      data: {
        title: "Cryptocurrency 101 - Understanding Bitcoin & Beyond",
        description:
          "Demystify the world of cryptocurrency! Learn what Bitcoin is, how blockchain works, and the basics of buying, storing, and trading crypto safely. No technical background required. Q&A session included. Perfect for curious beginners!",
        eventType: "Education & Learning",
        location: "Financial Education Center, 890 Wealth St, San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        date: tenDays,
        maxParticipants: 40,
        currentCount: 22,
        price: 25.0,
        status: EventStatus.OPEN,
        imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
        tags: ["cryptocurrency", "bitcoin", "blockchain", "finance", "education"],
        hostId: users[2].id,
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
