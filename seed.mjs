import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// 先清空旧数据
await prisma.episode.deleteMany()
await prisma.drama.deleteMany()
console.log('已清空旧数据')

const dramas = [
  { title: '霸总的秘密恋人', titleEn: 'The CEO Secret Lover', category: 'romance', status: 'completed', description: '她只是他世界里的一个秘密，却不知道自己早已住进了他心里。一场意外相遇，改变了两个人的命运。', epCount: 5 },
  { title: '误嫁豪门', titleEn: 'Married into Wealth by Mistake', category: 'romance', status: 'ongoing', description: '一场阴差阳错的婚礼，让她成为了豪门少奶奶。他冷漠霸道，她温柔坚韧，两颗心慢慢靠近。', epCount: 8 },
  { title: '凤凰涅槃', titleEn: 'Phoenix Rising', category: 'historical', status: 'completed', description: '她以为自己只是一个弃妃，却不知命运早已为她安排了另一段传奇。浴火重生，成就一代传奇。', epCount: 10 },
  { title: '都市逆袭', titleEn: 'Urban Comeback', category: 'modern', status: 'ongoing', description: '被人陷害、身无分文，她从零开始，一步步走上人生巅峰。这一次，她要让所有人刮目相看。', epCount: 6 },
  { title: '替嫁新娘', titleEn: 'The Substitute Bride', category: 'romance', status: 'completed', description: '她被迫代替姐姐嫁给传说中的冷面总裁，却意外发现他并没有传说中那么可怕。', epCount: 6 },
  { title: '将门嫡女', titleEn: "The General's Daughter", category: 'historical', status: 'completed', description: '将门嫡女，重生归来，这一世她要护家人周全，让仇人付出代价。', epCount: 8 },
]

for (let di = 0; di < dramas.length; di++) {
  const d = dramas[di]
  const drama = await prisma.drama.create({
    data: { title: d.title, titleEn: d.titleEn, category: d.category, status: d.status, description: d.description }
  })
  for (let i = 0; i < d.epCount; i++) {
    // 用占位 ID，格式 seed_d{dramaIndex}_e{epIndex}，全局唯一
    const youtubeId = `seed_d${di}_e${i}`
    await prisma.episode.create({
      data: { dramaId: drama.id, episode: i + 1, youtubeId, title: `第${i + 1}集` }
    })
  }
  console.log('✓', d.title)
}

await prisma.$disconnect()
console.log('Done!')
