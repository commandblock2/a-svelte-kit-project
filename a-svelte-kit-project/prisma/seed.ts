// prisma/seed.ts

import { BallQuality, PrismaClient, TransactionType } from '@prisma/client'
import testData from "../src/lib/test-data.json" assert { type: "json" }

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

    for (const locationData of testData.places) {
        const location = await prisma.location.create({
            data: {
                name: locationData.name,
                longitude: locationData.longitude,
                latitude: locationData.latitude
            }
        })
    }

    for (const machineData of testData.machines) {
        const location = await prisma.location.findFirst()
        const machine = await prisma.machine.create({
            data: {
                preciseLatitude: machineData['precise-latitude'],
                preciseLongitude: machineData['precise-longitude'],
                location: { connect: { id: location!.id } },
                ballCountByQuality: {
                    createMany: {
                        data:
                            Object
                                .entries(machineData.balls)
                                .map(([quality, count]) => ({
                                    ballQuality: quality as BallQuality,
                                    count: count,
                                }))
                    }
                }
            }
        })
    }

    for (const transactionData of testData.transactions) {
        const machine = await prisma.machine.findFirst();
        const user = await prisma.user.findFirst();

        const transaction = await prisma.transaction.create({
            data: {
                ballCountByQuality: {
                    createMany: {
                        data:
                            Object
                                .entries(transactionData.balls)
                                .map(([quality, count]) => ({
                                    ballQuality: quality as BallQuality,
                                    count: count,
                                }))
                    }
                },
                user: { connect: { id: user?.id } },
                machine: { connect: { id: machine?.id } },
                type: transactionData.type as TransactionType,
            },
        });
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
