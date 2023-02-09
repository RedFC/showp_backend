"use strict";

import { IUser, Role } from "../models/user.model";
import * as Joi from "joi";
import { IFollows } from "../models/follow.user.model";
import { Product } from '../models/product.model';
import { IReview } from '../models/review.user.model';

interface UserRegister extends IUser {
    email: string;
    password: string;
    phoneNo: number;
    name: string
    gcm_id: string[],
    platform: string,
}
interface UserLogin extends IUser {
    email: string;
    password: string;
    role: Role;
    gcm_id: string[],
    platform: string,
}
interface UserSocialLogin extends IUser {
    token: string;
    gcm_id: string[];
    platform: string;
}

interface UserUpdate extends IUser {
    username: string;
    name: string;
    about: string;
}

interface ConnectionFollow extends IFollows { 
    followId: string;
}
export class Validator {
    constructor() { }

    //************************ VALIDATE USER REGISTER DATA ***********************//
    validateRegisterData(data: UserRegister) {
        const schema = Joi.object().keys({
            token: Joi.string().required(),
            username: Joi.string(),
            name: Joi.string(),
            profileImage: Joi.string(),
            about: Joi.string().required(),
            email: Joi.string(),
            gcm_id: Joi.string().required(),
            platform : Joi.string().required()
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER VERIFY DATA ***********************//
    validateVerifyData(data: UserRegister) {
        const schema = Joi.object().keys({
            phoneNo: Joi.number().required(),
            code: Joi.number().required(),
            gcm_id: Joi.string(),
            platform: Joi.string(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER LOGIN DATA ***********************//
    validateLoginData(data: UserLogin) {
        const schema = Joi.object().keys({
            username: Joi.string(),
            phoneNo: Joi.string(),
            role: Joi.string().required(),
        });
        return Joi.validate(data, schema);
    }
    //************************ VALIDATE USER UPDATE DATA ***********************//
    validateUserUpdateData(data: UserUpdate) {
        const schema = Joi.object().keys({
            username: Joi.string(),
            name: Joi.string(),
            about: Joi.string(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE ADMIN USER UPDATE DATA ***********************//
    validateAdminUserUpdateData(data: UserUpdate) {
        const schema = Joi.object().keys({
            email: Joi.string(),
            id: Joi.string().required(),
            blocked: Joi.boolean(),
            username: Joi.string(),
            name: Joi.string(),
            about: Joi.string(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE ADMIN USER UPDATE DATA ***********************//
    validateConnectionFollowData(data: ConnectionFollow) {
        const schema = Joi.object().keys({ 
            followId:Joi.string().required()
        });
        return Joi.validate(data, schema);
    }


    //************************ VALIDATE PRODUCT CREATE ***********************//

    validateProductCreate(data: Product) {
        const schema = Joi.object().keys({
            title : Joi.string().required(),
            description : Joi.string().required(),
            baseCost : Joi.number().required(),
            currency : Joi.string().required(),
            refundable: Joi.boolean().required(),
            tags: Joi.array().items(Joi.string().required()).required(),
            categories: Joi.array().items(Joi.object().keys({ id: Joi.string().required() })).required(),
            quantity : Joi.number().integer().min(1).required()
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE PRODUCT UPDATE ***********************//

    validateProductUpdate(data: Product) {
        const schema = Joi.object().keys({
            title : Joi.string(),
            description : Joi.string(),
            baseCost : Joi.number(),
            currency : Joi.string(),
            refundable: Joi.boolean(),
            tags: Joi.array(),
            categories: Joi.array(),
            quantity : Joi.number().integer().min(1),
            disconnectedTags: Joi.array(),
            disconnectedCategories: Joi.array(),
            disconnectedImages : Joi.array()
        })
        return Joi.validate(data, schema);
    }


    //************************ VALIDATE Rating & Reviews CREATE ***********************//
    

    validateReatingAndReviews(data) {
        const schema = Joi.object().keys({
            stars: Joi.number().min(0).max(5).required(),
            message: Joi.string().required(),
            title: Joi.string().required(),
            thumbnail: Joi.string().required(),
            tags : Joi.array().items(Joi.string().required().label("At least One Tag Is Required")).required(),
            duration : Joi.string().required()
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE Comment CREATE ***********************//

    validateCommentJoi(data) {
        const schema = Joi.object().keys({
            comment: Joi.string().required(),
            review: Joi.string().required(),
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE Comment Update ***********************//

    validateCommentUpdateJoi(data) {
        const schema = Joi.object().keys({
            comment: Joi.string(),
            review: Joi.string()
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE Orders Create ***********************//
    
    validateOrderCreateJoi(data) {
        const schema = Joi.object().keys({
            fullname: Joi.string().required(),
            email: Joi.string().required(),
            number:Joi.string().required(),
            shippingAddress:Joi.string().required(),
            product: Joi
                    .object()
                    .keys({
                        id: Joi
                            .string()
                            .required(), qty: Joi
                            .number()
                            .integer()
                            .required()
                    })
                .required()
        })
        return Joi.validate(data, schema);
    }


    //************************ VALIDATE Return Policy ***********************//

    validateReturnPolicyJoi(data) {
        const schema = Joi.object().keys({
            returnpolicy: Joi.string().required(),
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE Terms And Condition Policy ***********************//

    validateTermsAndConditionJoi(data) {
        const schema = Joi.object().keys({
            termsandconditions: Joi.string().required(),
        })
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE user review from seller ***********************//
    validateSellerReview(data) {
        const schema = Joi.object().keys({
            stars: Joi.number().required(),
            message: Joi.string().required(),
            productId:Joi.string().required()
        })
        return Joi.validate(data, schema);
    }
    //************************ VALIDATE user review from seller ***********************//
    validateSellerReviewUpdate(data) {
        const schema = Joi.object().keys({
            stars: Joi.number().required(),
            message: Joi.string().required(),
            productId:Joi.string().required()
        })
        return Joi.validate(data, schema);
    }
}
