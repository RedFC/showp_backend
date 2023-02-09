import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';
import { ErrorService } from "../../../services/error.service";
import { ReviewService } from "../../../services/review.service";


import {CustomStreamServer} from '../../../../constants/customStreamServer'
import { connect } from "mongoose";
import { ConnectionService } from "../../../services/connection.service";

export class Review {


    
// async create(req, res) {
//     try {

//         const reviewService = new ReviewService();
//         let Upload = new CustomStreamServer();

//         let Tags = JSON.parse(req.body.tags).map(x => {
//             return { where: { name: x }, create: { name: x } }
//         });
        
//         let Ratings = JSON.parse(req.body.ratings).map(x => {
//             return {message:x.message,productId:x.productId,stars:x.stars}
//         })

//         let Video = await Upload.uploadV1(req.file);

//         let _schemaReview = {
//                     media: Video,
//                     title: req.body.title,
//                     thumbnail: req.body.thumbnail,
//                     user: { connect: { id: req.user.id } },
//                     products: { connect: JSON.parse(req.body.productTags) },
//                     tags: {
//                         connectOrCreate: Tags
//                     }
//             }

//         let service = await reviewService.createReview(Ratings,_schemaReview);
//         if (service) {
//             res.status(200).send({ success: true, data: service, msg: "Review Has Been Created", status: 200 });
//         }


//     } catch (error) {
//         ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
//     }
// }

    async create(req, res) {
        try {
            const reviewService = new ReviewService();
            let Upload = new CustomStreamServer();

            let Tags = JSON.parse(req.body.tags).map(x => {
                return { where: { name: x }, create: { name: x } }
            });

            
            let Video = await Upload.uploadV1(req.file);

            let Main_schema = {
                stars: Number(req.body.stars),
                message: req.body.message,
                products: { connect: { id: req.params.id } },
                Review: {
                    create: {
                        media: Video,
                        title: req.body.title,
                        thumbnail: req.body.thumbnail,
                        user: { connect: { id: req.user.id } },
                        products: { connect: { id: req.params.id } },
                        tags: {
                            connectOrCreate: Tags
                        },
                        duration: req.body.duration,
                    }
                }
            }

            let service = await reviewService.createReview(Main_schema);
            if (service) {
                let myReviewService = new ReviewService();
                let getOneReview = await myReviewService.findOne({ id: service['Review']['id'] });
                if (getOneReview) {
                    reviewService.setSingleReviewData(getOneReview);
                }
                    res.status(200).send({ success: true, data: service, msg: "Review Has Been Created", status: 200 });
                }


        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async createReviewLike(req, res) {
        try {
            const reviewService = new ReviewService();
            const data = await reviewService.findOneReviewLike({ userId: req.user.id, reviewId: req.params.id });
            let service;
            let response;
            let _schema = {user:null, review:null}
            if(data){
                service = await reviewService.createReviewDislike({userId_reviewId:{reviewId:req.params.id, userId:req.user.id}});
                if (service) {
                    reviewService.dicreaseTrendSingleReviewData(req.params.id)
                    response = {msg: "Disliked"}
                }
            }else{
                _schema = { 
                    user : {connect :{id : req.user.id}},
                    review : {connect :{id : req.params.id}}
                }
                service = await reviewService.createReviewLike(_schema);
                if (service) {
                    reviewService.setTrendSingleReviewData(req.params.id)
                    response = {msg: "Liked"}
                }
            }
            let myReviewService = new ReviewService();
            let getOneReview = await myReviewService.findOne({ id: req.params.id });
            if (getOneReview) {
                reviewService.setSingleReviewData(getOneReview);
            }
            res.status(200).send({ success: true, data: response , status: 200 });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async getRandom(req, res) {

        try {
            const reviewService = new ReviewService();

            let GetAllReviews = await reviewService.getReviews({isActive : true});
            if (GetAllReviews.length) {
                
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max)
                }
                let randomInt = getRandomInt(GetAllReviews.length);
                let getId = GetAllReviews.map(x => {
                        return x.id
                })
                
                let GetOneRandomReviews = await reviewService.findOne({id : getId[randomInt],isActive : true});
                res.status(200).send(
                    {
                        success: true,
                        data: GetOneRandomReviews,
                        msg: "Successfully Fetched",
                        status: 200
                    });
            } else {
                res.status(200).send(
                    {
                        success: true,
                        data: [],
                        msg: "Successfully Fetched",
                        status: 200
                    });
            }

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }

    }

    async getAll(req, res) {

        try {
            const reviewService = new ReviewService();

            let GetAllReviews = await reviewService.getReviews({isActive : true});
            res.status(200).send(
                {
                    success: true,
                    data: GetAllReviews,
                    msg: "Successfully Fetched",
                    status: 200
                });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }

    }

    async getAlByUserId(req, res) {
        try {

            const reviewService = new ReviewService();
            let { id } = req.user;

            let GetReview = await reviewService.findReviewByUserId({ userId: id });
            res.status(200).send({ success: true, data: GetReview, msg: "Successfully Fetched", status: 200 });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async followingReviews(req,res) {
        try {
            
            let myConnectionService = new ConnectionService();
            
            let getCons = await myConnectionService.findOneAndGetConnections({ id: req.user.id });
            let getIds = getCons.following.map(x => {
                return x['following']['profile']['userId']
            })

            let myReviewService = new ReviewService();
            let search = req.query.search ? {
                some: {
                    category: {
                        OR: [{
                            id : {equals : req.query.search}
                        }]
                    }
                }
            } : {}
            let getReviews = await myReviewService.getReviews({
                products: {
                    categories:search  , userId: { in: getIds }
                }
            })

            res.status(200).send(
                {
                    success: true,
                    data: getReviews,
                    msg: "Successfully Fetched",
                    status: 200
                });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async foryou(req,res) {
        
        try {
            
            let myReviewService = new ReviewService();
            
            let getReviews = await myReviewService.getTrendingReviewsData('*review|analytics|search*');
            let DATA = [];
            console.log(getReviews);
            getReviews.map((x,y) => {
                myReviewService.getTrendingSingleReviewsData(`${x.Key}|review`).then(data => {
                    DATA.push(data);
                    if (getReviews.length == (y + 1)) {
                        res.status(200).send(
                            {
                                success: true,
                                data: DATA,
                                msg: "Successfully Fetched",
                                status: 200
                            });
                        DATA = []
                    }
                });
                
            })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }

    }

}
