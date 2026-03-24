const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const content = [
    { key: 'homepage_hero_title', title: 'Hero Title', content: 'MUOROTO FM.' },
    { key: 'homepage_hero_subtitle', title: 'Hero Subtitle', content: '"The Voice of Truth" — Nairobi\'s leading gospel for spiritual nourishment and community empowerment.' },
    { key: 'homepage_trending_tag', title: 'Trending Tag', content: 'What\'s Trending' },
    { key: 'homepage_trending_title', title: 'Trending Section Title', content: 'On The Air.' },
    { key: 'homepage_mission_title', title: 'Mission Title', content: 'Affirmative Role in Kenyan Society' },
    { key: 'homepage_mission_content', title: 'Mission Content', content: '"We always produce veracious content through our super talented staff."' },
    { key: 'about_hero_title', title: 'About Hero Title', content: 'WHO WE ARE.' },
    { key: 'about_hero_subtitle', title: 'About Hero Subtitle', content: '"Mugambo Wa Ma" — The Voice of Truth' },
    { key: 'about_establishment_title', title: 'Establishment Title', content: 'Broadcasting with Purpose.' },
    { key: 'about_establishment_content', title: 'Establishment Narrative', content: 'Muoroto FM is a leading National Radio Station based in the heart of Nairobi County, Kenya. We serve as a vital link between traditional Gikuyu culture and modern Kenyan aspirations.' },
  ]

  for (const item of content) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    })
  }
  console.log('Seeded initial content successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
