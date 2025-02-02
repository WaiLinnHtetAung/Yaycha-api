import {PrismaClient} from '@prisma/client'

import UserSeeder from "./UserSeeder.js";
import PostSeeder from "./PostSeeder.js";
import CommentSeeder from "./CommentSeeder.js";

const prisma = new PrismaClient()

const main = async () => {
    try {
        await UserSeeder();
        await PostSeeder();
        await CommentSeeder();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()