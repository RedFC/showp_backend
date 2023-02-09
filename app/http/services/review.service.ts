"use strict";
import { PrismaClient } from '@prisma/client';
import { Review } from '../models/review.product.model'
import { Rating } from '../models/rating.product.model'
import { Product } from '../models/product.model'
import { IUser } from '../models/user.model'
import { RedisService } from '../../cache/redis.service';
import { Itags } from '../models/tag.model';
import { IReviewLike } from '../models/reviewLike.model';
import * as _ from "lodash";

let select = {
    id : true,
    media: true,
    title: true,
    thumbnail: true,
    duration:true,
    createdAt : true,
    user: { include: { profile: true } },
    tags: true,
    ReviewLike:true,
    rating: {
        select: {
            stars: true,
            message: true
        }
    },
    products: {
        select: {
            title: true,
            description: true,
            baseCost: true,
            currency: true,
            images:true
        }
    },
    Comments: {
        select: {
            comment: true,
            userId: true,
            createdAt: true,
            updatedAt:true,
            user : {include:{profile:true}}
        }
    },
    _count: {
        select: {
            Comments:true,
            ReviewLike:true
        }
    }
    
}

interface IReviewRatingResolver{
    stars: Number,
    message: String,
    products: { connect: { id: Product['id'] } },
    Review: {
        create: {
            media: any,
            title: String,
            thumbnail: String,
            duration: String,
            user: { connect: { id: IUser['id'] } },
            products: { connect: { id: Product['id'] } },
            tags: {
                connectOrCreate: [where: [name: Itags['name']], create: [name: Itags['name']]]
            },
        }
    }
}
interface IReviewLikeResolver{
    user : { connect : {id : IUser['id']}},
    review : {connect : {id : Review['id']}}
}

export class ReviewService extends RedisService {

    private prisma;
    constructor() {
        super()
        this.prisma = new PrismaClient();
    }

    // createReview(dataRating :IRatingResolver,dataReview: IReviewResolver): Promise<Review> {
    //     return new Promise((resolve, reject) => {
            
    //         let createRating = this.prisma.rating.createMany({ data : dataRating })
    //         let createReview = this.prisma.review.create({ data : dataReview })
    //             this.prisma.$transaction([createRating,createReview])
    //             .then(data => {
    //                 resolve(data)
    //             })
    //             .catch(error => reject(error))
    //             .finally(() => this.prisma.$disconnect())
    //     });
    // }


    createReview(data: IReviewRatingResolver): Promise<Review> {
        return new Promise((resolve, reject) => {
            this.prisma.rating
                .create({
                    data, include: {
                        Review: {
                            include: {
                                user: { include: { profile: true } },
                                tags:true,
                                rating: {
                                    select: {
                                        stars: true,
                                        message: true
                                    }
                                },
                                products: {
                                    select: {
                                        title: true,
                                        description: true,
                                        baseCost: true,
                                        currency: true
                                    }
                                },
                                Comments: {
                                    select: {
                                        comment: true,
                                        userId: true,
                                    }
                                },
                                _count: {
                                    select: {
                                        Comments:true
                                    }
                                }
                            }
                }}})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    createReviewLike(data:IReviewLikeResolver):Promise<IReviewLike>{
        return new Promise((resolve, reject) => {
            this.prisma.reviewLike
                .create({data,select:{userId:true,reviewId:true}})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    createReviewDislike(where):Promise<IReviewLike>{
        return new Promise((resolve, reject) => {
            this.prisma.reviewLike
                .delete({where})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    findOneReviewLike(where): Promise<IReviewLike> {
        return new Promise((resolve, reject) => {
            this.prisma.reviewLike
                .findFirst({
                    where
                })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

    getReviews(where?,skip?,take?): Promise<Review[]> {
        return new Promise((resolve, reject) => {
            this.prisma.review
                .findMany({
                    where,skip,take,select
                })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

    

    // getReviews(where): Promise<Review[]> {
    //     return new Promise((resolve, reject) => {
    //         this.prisma.review
    //             .findMany({
    //                 where,select
    //             })
    //             .then(data => {
    //                 resolve(data)
    //             })
    //             .catch(error => reject(error))
    //             .finally(() => this.prisma.$disconnect())
    //     })
    // }

    findReviewByUserId(where): Promise<Review> {
        return new Promise((resolve, reject) => {
            this.prisma.review
                .findMany({
                    where, select
                })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

    findOne(where): Promise<Review> {
        return new Promise((resolve, reject) => {
            this.prisma.review
                .findFirst({
                    where,select
                })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

    setSingleReviewData(data) {
        this.setData(data, `${data.id}|review`, 0)
        .catch((error) => { throw error })
    }

    async setTrendSingleReviewData(data) {
        let getdata = await this.getData(`${data}|review|analytics|search`);
        if (getdata != null && getdata != "" && getdata != undefined) {
            this.setData(data !== null ? getdata + 1 : 1, `${data}|review|analytics|search`,86400)
            .catch((error) => { throw error })
        } else {
            this.setData(data !== null ? _.toInteger(data) + 1 : 1, `${data}|review|analytics|search`,86400)
            .catch((error) => { throw error })
        }
    }

    async dicreaseTrendSingleReviewData(data) {
        let getdata = await this.getData(`${data}|review|analytics|search`);
        if (getdata != null && getdata != "" && getdata != undefined) {
            this.setData(getdata - 1, `${data}|review|analytics|search`,86400)
            .catch((error) => { throw error })
        }
    }

    async getTrendingReviewsData(data) {
        let a = await this.searchDataReview(data)
        return a
    }

    getTrendingSingleReviewsData(data) {
       return this.getData(data)
    }

}