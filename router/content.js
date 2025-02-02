import express from "express";

import prisma from "../utils/prismaClient.js";
import {auth, isOwner} from "../middlewares/auth.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
    try {
        const data = await prisma.post.findMany({
            include: {
                user: true,
                comments: true,
            },
            orderBy: {id: "desc"},
            take: 20
        });

        res.json({ok: true, data});
    } catch (err) {
        res.status(500).json({ok: false, error: err});
    }
})

router.get("/posts/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const data = await prisma.post.findFirst({
            where: {id: Number(id)},
            include: {
                user: true,
                comments: {
                    include: {user: true},
                },
            }
        });

        res.json({ok: true, data});
    } catch (err) {
        res.status(500).json({ok: false, error: err});
    }
})

router.delete("/posts/:id", auth, isOwner('post'), async (req, res) => {
    const {id} = req.params;

    const existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
    });

    if (!existingPost) {
        return res.status(404).json({ ok: false, error: "Post not found" });
    }

    await prisma.comment.deleteMany({
        where: {postId: Number(id)},
    })

    await prisma.post.delete({
        where: {id: Number(id)},
    })

    res.status(200).json({ok: true});
})

router.delete("/comments/:id", auth, isOwner('comment'), async (req, res) => {
    const {id} = req.params;

    await prisma.comment.delete({
        where: {id: Number(id)},
    })

    res.sendStatus(204);
})

export {router as contentRouter};

