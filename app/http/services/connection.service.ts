"use strict";
import { PrismaClient } from '@prisma/client';
import { IFollows } from '../models/follow.user.model';
import { IProfile } from '../models/profile.user.model';
import { IUser, IUserProfile } from '../models/user.model';
import { UserService } from './user.service';
const select = {
    id: true,
    user: { select: { profile: true } },
    userId: true,
    following: { select: { profile: true } },
    followId: true,
    status : true
};
interface IFollowsResolver {
    follows: IFollows[];
    // count: number;
}
interface IFollowFollowingResolver {
    profile: IProfile,
    followers: IUserProfile[],
    following: IUserProfile[],
}
interface IFollowCountResolver {
    profile: IProfile,
    followers: IUserProfile[],
    following: IUserProfile[],
    count: number
}
export class ConnectionService {
    private prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    create(_follow: IFollows): Promise<IFollows> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .create({
                    data: _follow, select
                })
                .then(async _user => {
                    resolve(_user)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    acceptRequest(where,data): Promise<IFollows>{
        return new Promise((resolve, reject) => {
            
            this.prisma.follows
                .update({where,data,select})
                .then(async (_follow) => {
                    //update following count of this use
                    let myUserService = new UserService()
                    let myUser = await myUserService.findOne({ id: _follow.userId })
                    this.prisma.profile
                        .update({
                            where: {
                                username: myUser.profile.username
                            },
                            data: {
                                following: Number(myUser.profile.following) + Number(1)
                            }
                        }).then(updated => console.log(updated))
                    //update followers count of other user 
                    let otherUser = await myUserService.findOne({ id: _follow.followId })
                    this.prisma.profile
                        .update({
                            where: {
                                username: otherUser.profile.username
                            },
                            data: {
                                followers: Number(otherUser.profile.followers) + Number(1)
                            }
                        }).then(updated => console.log(updated))
                        resolve(_follow)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())

        })
    }

    find(where): Promise<IFollowsResolver> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .findMany({ where, select })
                .then(async follows => {
                    // const followsCount = await this.prisma.connection.count({ where })
                    resolve({ follows })
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }


    findREQ(where): Promise<IFollows> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .findMany({ where, select })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    

    findOne(where): Promise<IFollows> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .findFirst({ where, select })
                .then(async follows => {
                    resolve(follows)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    findOneConnection(where): Promise<IFollows> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .findFirst({ where })
                .then(async follows => {
                    resolve(follows)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    parseUserBigIntJSON(_user): IFollowFollowingResolver {
        return JSON.parse(JSON.stringify(_user, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
            .replace(/"(-?\d+)n"/g, (_, a) => a))
    }
    findOneAndGetConnections(where, limit = null, page = null): Promise<IFollowCountResolver> {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findFirst({
                    where, select: {
                        profile: true,
                        followers: { // This is the block for the users who are following me and I get those users with the user select
                            select: { user: { select: { profile: true } } } ,
                            skip: limit * (page - 1) ? limit * (page - 1) : 0, take: limit ? limit : 50
                        },
                        following: { // This is the block for the users who I am following and I get those users with the following select
                            select: { following: { select: { profile: true } } } ,
                            skip: limit * (page - 1) ? limit * (page - 1) : 0, take: limit ? limit : 50
                        }
                    }
                })
                .then(async _follow => {
                    console.log(_follow);
                    
                    let { id } = where;
                    let orQuery = [
                        { followId: id },
                        { userId: id },
                    ]
                    let serializedFollow = this.parseUserBigIntJSON(_follow)
                    
                    const followsCount = await this.prisma.follows.count({ where: { OR: orQuery } })
                    resolve({ profile: serializedFollow.profile, followers: serializedFollow.followers, following: serializedFollow.following, count: followsCount })
                })
                .catch(error => { console.log(error); reject(error) })
                .finally(() => this.prisma.$disconnect())
        })
    }

    findWithLimit(where, limit = null, page = null): Promise<IFollowsResolver> {
        return new Promise((resolve, reject) => {
            this.prisma.follows
                .findMany({ where, select, skip: limit * (page - 1) ? limit * (page - 1) : 0, take: limit ? limit : 50 })
                .then(async follows => {
                    const followsCount = await this.prisma.follows.count({ where })
                    // resolve({ follows, count: followsCount })
                    resolve({ follows })
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    delete(where): Promise<IFollows> {
        return new Promise(async (resolve, reject) => {
            let oldFollow = await this.findOne(where)
            this.prisma.follows
                .delete({
                    where: { id: oldFollow.id },
                }).then(async _follow => {
                    //update following count of this user
                    let myUserService = new UserService()
                    let myUser = await myUserService.findOne({ id: _follow.userId })
                    this.prisma.profile
                        .update({
                            where: {
                                username: myUser.profile.username
                            },
                            data: {
                                following: BigInt(myUser.profile.following) - BigInt(1)
                            }
                        }).then(updated => console.log(updated))
                    //update followers count of other user 
                    let otherUser = await myUserService.findOne({ id: _follow.followId })
                    this.prisma.profile
                        .update({
                            where: {
                                username: otherUser.profile.username
                            },
                            data: {
                                followers: BigInt(otherUser.profile.followers) - BigInt(1)
                            }
                        }).then(updated => console.log(updated))
                    resolve(oldFollow)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

}