const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'python' },
        { name: 'Web development' },
        { name: 'Vedic Maths' },
        { name: 'English' },
        { name: 'C++' },
        { name: 'Graphic Design' },
      ],
    })

    console.log('Success')
  } catch (error) {
    console.log('Error seeding the database categories', error)
  } finally {
    await database.$disconnect()
  }
}

main()
