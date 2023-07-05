import prisma from '$lib/prisma';
import type { Actions } from './$types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hashPassword } from '$lib/password-util'
import isEmail from 'validator/lib/isEmail';



export const actions = {
    signup: async ({ cookies, request }) => {

        try {
            // Parse the JSON payload from the request body
            const data = await request.formData();

            // Extract the form data from the parsed JSON payload
            const username = data.get("username") as string;
            const password = data.get("password") as string;
            const email = data.get("email") as string;

            if (!isEmail(email))
                throw Error("Invalid email")

            // Hash the password
            const hashedPassword = await hashPassword(password);

            // Create the user in the database
            const user = await prisma.user.create({
                data: {
                    name: username,
                    email: email,
                    password: hashedPassword,
                }
            });

            console.log('User created:', user);

            return {
                status: 201,
                body: { message: 'User created successfully' }
            };
        } catch (error) {
            console.error('Error creating user:', error);

            switch (true) {
                case error instanceof PrismaClientKnownRequestError:
                    return {
                        status: 409,
                        body: {
                            error: 'User with the same email already existed'
                        }
                    }

                case error instanceof Error:
                    return {
                        status: 400,
                        body: {
                            error: (error as Error).message
                        }
                    }

                default:
                    return {
                        status: 400,
                        body: { error: 'Unknown error, which should not be happening' }
                    };
            }
        }
    },

    signin: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user || await hashPassword(password) !== password)
            return { status: 401, body: { error: 'incorrect password or username' } }

        const session = await prisma.session.create({
            data: {
                user: { connect: { id: user?.id } },
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires after 1d
                sessionId: crypto.randomUUID()
            }
        })

        cookies.set('sessionid', session.sessionId);

        return { success: true };
    },
    
    signout: async ({ cookies, request }) => {
        const sessionId = cookies.get('sessionid')
        prisma.session.delete({
            where: {
                sessionId: sessionId
            }
        })

        return { success: true }
    }
} satisfies Actions;
