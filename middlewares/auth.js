import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

export const auth = (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ok: false, msg: "token required"});
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);

    if (!user) {
        return res.status(401).json({ok: false, msg: "Invalid token"});
    }

    res.locals.user = user;

    next();
}

/**
 * @param {('post' | 'comment')} type
 */
export const isOwner = (type) => {
    return async (req, res, next) => {
        const {id} = req.params;
        const user = res.locals.user;

        if(type === 'post') {
            const post = await prisma.post.findUnique({where: {id: Number(id)}});

            if(post.userId === user.id) return next();
        }

        if (type === "comment") {
            const comment = await prisma.comment.findUnique({
                where: { id: Number(id) },
                include: {
                    post: true,
                },
            });
            if (comment.userId === user.id || comment.post.userId === user.id)
                return next();
        }

        res.status(403).json({ msg: "Unauthorize to delete" });
    }
}

