// prisma/seed.ts

import { BallQuality, PrismaClient } from '@prisma/client'
import testData from "../src/lib/data.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    for (const userData of testData.users) {
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                phoneNumber: userData['phone-number'],
                name: userData.name
            }
        })   
    }

    for (const ballPriceData of testData['ball-price']) {
        const ballPrice = await prisma.ballPrice.create({
            data: {
                ballQuality: ballPriceData.ballQuality as BallQuality,
                price: ballPriceData.price
            }
        })
    }


    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
