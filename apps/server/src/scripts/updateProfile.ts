import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'rageeb.cs@gmail.com';

  const user = await prisma.user.update({
    where: { email },
    data: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rageeb',
      bio: 'Passionate event organizer and community builder. I love bringing people together for amazing experiences. With years of experience in event planning, I specialize in creating memorable gatherings that foster connections and fun.',
      location: 'Dhaka, Bangladesh',
      interests: ['Technology', 'Music', 'Sports', 'Travel', 'Food'],
    },
  });

  console.log('✅ Profile updated successfully!');
  console.log('User:', user.name);
  console.log('Email:', user.email);
  console.log('Avatar:', user.avatar);
  console.log('Bio:', user.bio?.substring(0, 50) + '...');
  console.log('Location:', user.location);
  console.log('Interests:', user.interests);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
