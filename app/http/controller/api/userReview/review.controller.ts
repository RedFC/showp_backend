import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';
import { ErrorService } from "../../../services/error.service";
import { UserReviewService } from "../../../services/reviewUser.service";
import { IReview,IReviewUpdate } from '../../../models/review.user.model';


// import {CustomStreamServer} from '../../../../constants/customStreamServer'
// import { connect } from "mongoose";

export class Review {

    async create(req, res) {
        try {
            const reviewService = new UserReviewService();
            let Main_schema = {
                stars: Number(req.body.stars),
                message: req.body.message,
                product:{connect: { id: req.body.productId }},
                user: { connect: { id: req.params.id } },
                seller: { connect: { id: req.user.id } },
            }

            let service = await reviewService.createUserReview(Main_schema);
                if (service) {
                    res.status(200).send({ success: true, data: service, msg: "Review Has Been Created", status: 200 });
                }


        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }
    async getAll(req, res) {

        try {
            const reviewService = new UserReviewService();
            let GetAllReviews = await reviewService.findReviews({productId:req.params.id,sellerId:req.user.id})
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
    async updateReview(req,res){
        try {
            let body:IReviewUpdate={
                stars:req.body.stars,
                message:req.body.message,
                RatingStatus:"Edited"
                }
                const reviewService = new UserReviewService();
                let GetReview = await reviewService.findOne({productId:req.body.productId,sellerId:req.user.id,userId:req.params.id})  
                console.log(GetReview);
                if(GetReview==null){
                   return res.status(200).send(
                        {
                            success: true,
                            msg: "user only update his reviews",
                            status: 200
                        }
                        );
                }
                let updateReview= await reviewService.update({userId_sellerId_productId:{productId:req.body.productId,sellerId:req.user.id,userId:req.params.id}},body)
                res.status(200).send(
                {
                    success: true,
                    data: updateReview,
                    msg: "Successfully Updated",
                    status: 200
                }
                );
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async deleteReview(req, res) {
        try {
            const reviewService = new UserReviewService();
            let findReview = await reviewService.findOne({productId: req.body.productId, sellerId: req['user'].id,userId:req.body.userId})
            console.log(findReview);
            
            if(findReview==null){
               return res.status(200).send(
                    {
                        success: true,
                        msg: "no review found with this userId",
                        status: 200
                    });
            }
            let deleteReview = await reviewService.deleteReview({ productId: req.body.productId, sellerId: req['user'].id,userId:req.body.userId })
            res.status(200).send(
                {
                    success: true,
                    data: deleteReview,
                    msg: "Successfully Deleted!",
                    status: 200
                });
            
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }


}
