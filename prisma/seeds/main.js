import {PrismaClient} from '@prisma/client'

import UserSeeder from "./UserSeeder.js";
import PostSeeder from "./PostSeeder.js";
import CommentSeeder from "./CommentSeeder.js";
import LikeSeeder from "./LikeSeeder.js";

const prisma = new PrismaClient()

const main = async () => {
    try {
        await UserSeeder();
        await PostSeeder();
        await CommentSeeder();
        await LikeSeeder();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()