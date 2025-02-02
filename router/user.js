import express from "express";

import prisma from "../utils/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {username, password} = req.body;


    if(!username || !password){
        return res.status(400).json({ok: false});
    }

    const user = await prisma.user.findUnique({where:{username}});

    if(user) {

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {
            const token = jwt.sign(user, process.env.JWT_SECRET);
            res.status(200).json({ok: true, token});
        }
    }

    res.status(400).json({ok: false, msg: "Incorrect username or password"});
})

router.get("/users", async (req, res) => {
    try {
        const data = await prisma.user.findMany({
            include: {posts: true, comments: true},
            orderBy: {id: "desc"},
            take: 20
        });

        res.json({ok: true, data});
    } catch (err) {
        res.status(500).json({ok: false, data: err});
    }
})

router.get("/users/:id", async (req, res) => {
    const {id} = req.params.id;
    try {
        const data = await prisma.user.findFirst({

            where: {id: Number(id)},
            include: {posts: true, comments: true},
        });

        res.json({ok: true, data});
    } catch (err) {
        res.status(500).json({ok: false, data: err});
    }
})

router.post("/users", async (req, res) => {
    const {name, username, bio, password} = req.body;

    if(!name || !username || !bio || !password) {
        return res.status(400).json({ok: false, msg: "Missing required field"});
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {name, username, bio, password: hash},
    });

    res.json({ok: true, data: user});
})

export { router as userRouter }