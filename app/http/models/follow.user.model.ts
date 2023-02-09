"use strict";
import { PrismaClient } from '@prisma/client'
import { IUser, IUserProfile } from './user.model';
export interface IFollows {
    id?: string;
    userId: IUser["id"];
    user: IUserProfile;
    followId: IUser["id"];
    following: IUserProfile;
    status: string;
}

export class ValidateFollow {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    public async validate(_follow: IFollows, { error, next }) {
        try {
            let validConnection = await this.alreadyFollowing({ userId: _follow.userId, followId: _follow.followId })
            this.alreadyFollowing({ userId: _follow.userId, followId: _follow.followId })
            if (validConnection != "Not following this user") return error(validConnection)
            return next(_follow);
        } catch (e) {
            return error(e);
        }
    }

    public async vaidateRequestAccept(_follow: IFollows, { error, next }) {
        try {
            let validConnection = await this.alreadyFollowing({ userId: _follow.followId, followId: _follow.userId })
            this.alreadyFollowing({ userId: _follow.followId, followId: _follow.userId })
            if (validConnection == "Request Already Sent") {
                return next();
            }
            return error(validConnection)
        } catch (e) {
            return error(e);
        }
    }

    public async validateUnFollow(_follow: IFollows, { error, next }) {
        try {
            let validConnection = await this.alreadyFollowing({ userId: _follow.userId, followId: _follow.followId })
            this.alreadyFollowing(_follow)
            if (validConnection == "Not following this user") return error(validConnection)
            return next(_follow);
        } catch (e) {
            return error(e);
        }
    }
    private alreadyFollowing(where): Promise<string> {
        return new Promise((resolve, reject) => {
            this.prisma.follows.findFirst({ where })
                .then(function (user) {
                    if (user) {
                        if (user.status == "PENDING") {
                            return resolve("Request Already Sent");
                        }
                        else if (user.status == "ACCEPTED") {
                            return resolve("Already following this user");
                        }
                    }
                    return resolve("Not following this user");
                })
                .catch(function (e) {
                    return reject(e.message);
                }).finally(() => {
                    this.prisma.$disconnect();
                })
        })
    }
}