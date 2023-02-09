"use strict";
import { PrismaClient } from '@prisma/client';
// import { Review } from '../models/review.product.model'
// import { Rating } from '../models/rating.product.model'
import { Product } from '../models/product.model'
import { IUser } from '../models/user.model'
import { RedisService } from '../../cache/redis.service';
import { IReview,IReviewUpdate } from '../models/review.user.model';
// import { IReviewLike } from '../models/reviewLike.model';

let select = {
stars:true,
message:true,
user:true,
seller:true,
product:true,
RatingStatus:true  
}


interface IReviewRatingResolver{
    stars: Number,
    message: String,
    product: { connect: { id: Product['id'] } },
    user: { connect: { id: IUser['id'] } },
    seller: { connect: { id: IUser['id'] } },
}

export class UserReviewService extends RedisService {

    private prisma;
    constructor() {
        super()
        this.prisma = new PrismaClient();
        // this.prisma.userRating.update({where:{
        //     userId_sellerId:{
        //         sellerId:,
        //         userId:
        //     }
        // }})
        // this
        // this.prisma.userRating.update()
    }

    createUserReview(data: IReviewRatingResolver): Promise<IReview> {
        return new Promise((resolve, reject) => {
            this.prisma.userRating
                .create({data, select })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

    findOne(where): Promise<IReview> {
        return new Promise((resolve, reject) => {
            this.prisma.userRating
                .findFirst({where})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }
    update(where, event: IReviewUpdate): Promise<IReview> {
        return new Promise((resolve, reject) => {
            this.prisma.userRating
                .update({ where, data: event, select })
                .then(event => resolve(event))
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

    findReviews(where): Promise<IReview> {
        return new Promise((resolve, reject) => {
            this.prisma.userRating
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
    deleteReview(where): Promise<void | string> {
        return new Promise((resolve, reject) => {
            this.prisma.userRating
                .deleteMany({ where })
                .then(() => resolve())
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        })
    }

}