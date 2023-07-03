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
    }
} satisfies Actions;
