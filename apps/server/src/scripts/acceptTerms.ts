import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'rageeb.cs@gmail.com';

  const user = await prisma.user.update({
    where: { email },
    data: {
      acceptedHostTerms: true,
      hostTermsAcceptedAt: new Date(),
    },
  });

  console.log('✅ Host terms accepted successfully!');
  console.log('User:', user.name);
  console.log('Accepted at:', user.hostTermsAcceptedAt);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
