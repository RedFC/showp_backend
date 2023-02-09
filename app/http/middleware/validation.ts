import compose from "composable-middleware"
import { Validator } from "../controller/validate";
import { ProductService } from '../services/product.service';
import { ReviewService } from "../services/review.service";
import { CommentsService } from "../services/comments.service";
import { UserService } from "../services/user.service";
import { OrderService } from "../services/order.service";
import { ReportService } from "../services/report.service";
import { UserReviewService } from "../services/reviewUser.service";
// import { ReviewService } from "../services/review.service";
import Admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyDfD_I0_PSUz6Tw-v25p2ZdxYnYcdvAy_A",
    authDomain: "showpp-544cb.firebaseapp.com",
    databaseURL: "https://showpp-544cb-default-rtdb.firebaseio.com",
    projectId: "showpp-544cb",
    storageBucket: "showpp-544cb.appspot.com",
    messagingSenderId: "175165712023",
    appId: "1:175165712023:web:8cf8d7ebac8eb434b56bd2",
    measurementId: "G-Y23LQS4C6R"
};
Admin.initializeApp(firebaseConfig);

export class ValidationMiddleware extends Validator {
    constructor() {
        super();
    }
    validateUserRegistration() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateRegisterData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                })
        )
    }
    validateUserVerify() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateVerifyData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                })
        )
    }
    validateUserLogin() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateLoginData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
        )
    }
    validateUserUpdate() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateUserUpdateData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
        )
    }

    validateAdminUserUpdate() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateAdminUserUpdateData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
        )
    }

    validateAcceptFlow() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateConnectionFollowData(req.body)
                        .then(data => {
                            req.body.userId = req.user.id;
                            next();
                        }).catch(error => {
                            console.log(error)
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
                .use((req, res, next) => {
                    if (req.body.userId == req.body.followId) {
                        res.status(409).send({ success: false, msg: "Not allowed to perform this action" })
                    }else{
                        next();
                    }
                })
        )
    }

    validateConnectionFollow() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateConnectionFollowData(req.body)
                        .then(data => {
                            req.body.userId = req.user.id;
                            next();
                        }).catch(error => {
                            console.log(error)
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
                .use((req, res, next) => {
                    if (req.body.userId == req.body.followId) {
                        res.status(409).send({ success: false, msg: "Not allowed to perform this action" })
                    }else{
                        next();
                    }
                }).use(async (req, res, next) => {
                    const service = new UserService()
                    const user = await service.findOne({id: req.body.followId})
                    if (!user) {
                        return res.status(409).send({ success: false, msg: "No user was found by the ginven followId" })
                    }else{
                        next();
                    }
                })
        )
    }


    validateBlockRequest() {
        return (
            compose()
                .use((req, res, next) => {
                    
                let TokenId = req.user.id;
                let paramsId = req.params.id;
                
                if (TokenId == paramsId){
                    return res.status(409).send({ success: false, msg: "Not Allowed To Perform This Action" });
                } else {
                    next();
                }
            })
        )
    }

    validateCategory() {
        return (compose()
            .use(async (req, res, next) => {
                if (!req.body.name) {
                    return res.status(409).send({ success: false, msg: "Name Is Required" });
                } else {

                    let productService = new ProductService();
                    let name = req.body.name;
                    let getCategory = await productService.getOneCategory({ name: name.toLowerCase() });
                    if (getCategory) {
                        return res.status(409).send({ success: false, msg: "Category Exists" });
                    } else {
                        next();
                    }

                }
            })
        )
    }

    validateSubCategory() {
        return (compose()
            .use(async (req, res, next) => {
                if (!req.body.name) {
                    return res.status(409).send({ success: false, msg: "Name Is Required" });
                }
                else if(!req.body.categoryId) {
                    return res.status(409).send({ success: false, msg: "CategoryId Is Required" });
                }
                else {

                    let productService = new ProductService();
                    let name = req.body.name;
                    let CategoryId = req.body.categoryId;
                    let getsubCategory = await productService.getOneSubCategory({ name: name.toLowerCase() , categoryId : CategoryId });
                    if (getsubCategory) {
                        return res.status(409).send({ success: false, msg: "Same SubCategory Exists with in Same Category" });
                    } else {
                        next();
                    }
                }
            })
        )
    }

    validateProductCreate() {
        return (compose()
        .use(async (req,res,next) => {
                console.log(req.body)
                let Service = new UserService();
                let getReturnPolicies = await Service.getReturnPolicies({ id: req.user.id });
                if (getReturnPolicies) {
                    next();
                }
                else {
                        var errors = {
                            success: false,
                            msg: "Please Make Your Return Policies First",
                        };
                        console.log(errors)
                        return res.status(400).send(errors);
                }
            })
            .use((req, res, next) => {

                let myProductService = new ProductService()
                let Category = JSON.parse(req.body.categories);
                let subCat = [];
                let getOneSub = Category.map((x) => {
                    return { id: x.id } 
                })
                myProductService.getManySubCategory({AND:getOneSub}).then(result => {
                    if (result.length) {
                        next()
                    } else {
                        console.log("There Was A Error In Category")
                        var errors = {
                            success: false,
                            msg: "There Was A Error In Category",
                            data: "Category Error",
                        };
                        res.status(400).send(errors);
                        return;
                    }
                }).catch((error) => {
                    console.log(error)
                    var errors = {
                        success: false,
                        msg: error.details[0].message
                    };
                    res.status(400).send(errors);
                    return;
                })
            })
            .use((req, res, next) => {
                    super.validateProductCreate(req.body)
                    .then(data => {
                        next();
                    }).catch(error => {
                        console.log(error)
                        var errors = {
                            success: false,
                            msg: error.details[0].message,
                            data: error.name,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            })
        )
    }

    validateProductUpdate() {
        return (compose()
            .use((req,res,next) => {
                super.validateProductUpdate(req.body)
                .then(data => {
                    next();
                }).catch(error => {
                    console.log(error)
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                })

            })
        )
    }

    validateProductRecord() {
        return (compose()
            .use(async (req, res, next) => {
                let productService = new ProductService();
                let getProduct = await productService.getOneProduct({ id: req.params.id });
                if (!getProduct) { 
                    return res.send({ success: true, status: 409, msg: "Record Not Found" })
                }
                else if(getProduct.userId != req.user.id){
                    return res.send({ success: true, status: 409, msg: "Not Allowed To Perform This Action" })
                }
                else {
                    res.productqty = getProduct.quantity;
                    next();
                }
            })
        )
    }

    validateRatingAndReviewsCreate() {
        return (
            compose()
                .use((req,res,next) => {
                    super.validateReatingAndReviews(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            console.log(error)
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
                })
                .use((req,res,next) => {
                    const productService = new ProductService();
                    productService.getOneProduct({ id: req.params.id }).then((data) => {
                        if (data != null) {
                            console.log("!! WOrking");
                            next();
                        } else {
                            console.log("Product not Found")
                            var errors = {
                                success: false,
                                msg: "Product Not Found",
                            };
                            res.status(400).send(errors);
                            return;
                        }
                    }).catch((error) => {
                        console.log(error.message)
                        var errors = {
                            success: false,
                            msg: error.message,
                        };
                        res.status(400).send(errors);
                        return;
                    })
                })
        )
    }

    validateCommentCreate() {
        return (
            compose().use((req,res,next) => {
                super.validateCommentJoi(req.body)
                    .then(data => {
                        next();
                    }).catch(error => {
                        console.log(error)
                        var errors = {
                            success: false,
                            msg: error.details[0].message,
                            data: error.name,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            }).use(async (req,res,next) => {
                let reviewservice = new ReviewService();
                let getOneReview = await reviewservice.findOne({ id: req.body.review });
                console.log(getOneReview);
                if (getOneReview) {
                    next();
                } else {
                    console.log("Not Found");
                        var errors = {
                            success: false,
                            msg: "Review Not Found"
                        };
                        return res.status(400).send(errors);
                }
            })
        )
    }

    validateCommentFind() {
        return (
            compose().use(async (req,res,next) => {
                let commentService = new CommentsService();
                let findOne = await commentService.findOne({ id: req.params.id });
                if (findOne) {
                    next();
                } else {
                    console.log("Comment Not Found")
                        var errors = {
                            success: false,
                            msg: "Comment Not Found"
                        };
                        res.status(400).send(errors);
                        return;
                }
            })
        )
    }

    validateCommentUpdate() {
        return (
            compose().use((req,res,next) => {
                super.validateCommentUpdateJoi(req.body)
                    .then(data => {
                        next();
                    }).catch(error => {
                        console.log(error)
                        var errors = {
                            success: false,
                            msg: error.details[0].message,
                            data: error.name,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            })
        )
    }


    validateProductFound() {
        return (
            compose.use((req,res,next) => {
                const productService = new ProductService();
                    productService.getOneProduct({ id: req.params.id }).then((data) => {
                        if (data != null) {
                            console.log("!! WOrking");
                            next();
                        } else {
                            console.log("Product not Found")
                            var errors = {
                                success: false,
                                msg: "Product Not Found",
                            };
                            res.status(400).send(errors);
                            return;
                        }
                    }).catch((error) => {
                        console.log(error.message)
                        var errors = {
                            success: false,
                            msg: error.message,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            })
        )
    }
    
    validateOrders() {
        return (
            compose().use((req,res,next) => {
                super.validateOrderCreateJoi(req.body)
                    .then(data => {
                        next();
                    }).catch(error => {
                        console.log(error)
                        var errors = {
                            success: false,
                            msg: error.details[0].message,
                            data: error.name,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            })  
            .use(async(req,res,next)=>{
                const productService = new ProductService()
                const findProduct = await productService.getOneProduct({id:req.body.product.id,userId:req.user.id})
                if(findProduct){
                    var errors = {
                        success: false,
                        msg: "user cannot order his own product"
                    };
                    res.status(400).send(errors);
                    return;
                }
                else{
                    next()
                }
            })
        )
    }

    validateOrderUpdate() {
        return (
            compose().use(async (req,res,next) => {
                let Orderservices = new OrderService();
                let getProduct = await Orderservices.findOne({
                    id : req.params.id,
                    OrderDetails:
                    {
                        product:
                        {
                            userId: req.user.id  
                        }
                    }
                })
                if (getProduct) {
                    next()
                } else {
                        var errors = {
                            success: false,
                            msg: "You Done Have Any Orders"
                        };
                        res.status(400).send(errors);
                        return;
                }
            })  
        )
    }

    validateIncomingFile() {
        return (
            compose().use((req,res,next) => {

                if (!req.file) {
                    return res.send({
                        success: false,
                        msg: "File Is Required To Perform This Action"
                    })
                } else {
                    next();
                }
    
            })
        )
    }

    validateReturnPolicy() {
        return (
            compose().use((req,res,next) => {

                super.validateReturnPolicyJoi(req.body)
                    .then(data => {
                        next();
                    }).catch(error => {
                        console.log(error)
                        var errors = {
                            success: false,
                            msg: error.details[0].message,
                            data: error.name,
                        };
                        res.status(400).send(errors);
                        return;
                    })
            })
        )
    }

    validateReport() {
        return (
            compose()
                .use(async (req,res,next) => {
                    let Service = new ReviewService();
                    let GetOne = await Service.findOne({ products: { userId: req.user.id } });
                    if (GetOne) {
                        next();
                    } else {
                        var errors = {
                            success: false,
                            msg: "You Are Not Allowed To Perform This Action"
                        };
                        return res.status(400).send(errors);
                    }
                })
                .use(async (req,res,next) => {
                    let Service = new ReviewService();
                    let GetOne = await Service.findOne({ id : req.body.review});
                    if (GetOne) {
                        next();
                    } else {
                        var errors = {
                            success: false,
                            msg: "Review Not Found"
                        };
                        return res.status(400).send(errors);
                    }
                })
        )
    }

    validateReportget() {
        return (
            compose()
                .use(async (req,res,next) => {
                    let Service = new ReportService();
                    let getOne = await Service.findOne({ id: req.body.reportId });
                    if (getOne) {
                        next()
                    } else {
                        var errors = {
                            success: false,
                            msg: "Report Not Found"
                        };
                        return res.status(400).send(errors);
                    }

                })
        )
    }

    validateToken() {
        return (
            compose()
                .use((req,res,next) => {
                    Admin
                        .auth()
                        .verifyIdToken(req.body.token)
                        .then((decodedToken) => {
                            const uid = decodedToken.uid;
                            let split = decodedToken.phone_number.split("+");
                            res.phoneNo = split[1];
                            next();
                          })
                          .catch((error) => {
                            var errors = {
                                success: false,
                                msg: error.message
                            };
                            return res.status(400).send(errors);
                          });
                })
        )
    }

    validateReviewLikeParams() {
        return (
         compose().use(
               async (req,res,next) => {
                   try {
                       
                   } catch (error) {
                       
                   }
                    const reviewLike = new ReviewService()
                    const data = await reviewLike.findOne({id: req.params.id});
                    console.log(data, "kooo");
                    if(data){
                        next();
                    }else{
                        var errors = {
                            success: false,
                            msg: "Review Not Found"
                        };
                        return res.status(400).send(errors);
                    }                                        
                })
        )
    }
    validateReview(){
        return(
            compose()
            .use(async(req,res,next)=>{
                let reviewService = new ReviewService();
                let findReview = await reviewService.findOne({userId:req.user.id,productId:req.params.id})
                if(findReview){
                    var errors = {
                        success: false,
                        msg: "you already reviewed this product"
                    };
                    return res.status(400).send(errors);
                }
                else{
                    next()
                }
                
            })
            .use(async(req,res,next)=>{
                let Orderservices = new OrderService();
                let getOrders =await Orderservices.findAll({userId:req.user.id})
                let productIds=[];
                let status=[];
                let checkProductId = getOrders.forEach(element => {
                    productIds.push(element.OrderDetails.product.id)
                    if(element.OrderDetails.product.id===req.params.id && element.status=="COMPLETED"){
                        status.push(true);
                    }
                    else{
                        status.push(false);       
                    }
                });             
                let result=status.some(e=>e===true)
                let checkProductIsPurchased=productIds.some(e=>e==req.params.id)
                console.log(productIds);
                console.log(checkProductIsPurchased);
                    
                if(!checkProductIsPurchased){
                    var errors = {
                        success: false,
                        msg: "you can't review this product you need to purchase it first"
                    };
                    return res.status(400).send(errors);
                }
                else if(result){
                    next()
                }
                else{
                    var errors = {
                        success: false,
                        msg: "your order status is in pending state"
                    };
                    return res.status(400).send(errors);
                }
            })
        )
    }
    ValidateSellerReview(){
        return(
            compose()
            .use((req,res,next)=>{
                super.validateSellerReview(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            console.log(error)
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        })
            })
            .use(async(req,res,next)=>{
                console.log(req.user.id);
                
                const productService = new ProductService()
                const findProduct = await productService.getOneProduct({id:req.body.productId,userId:req.user.id})
                // console.log(findProduct);
                if(findProduct==null){
                    var errors = {
                        success: false,
                        msg: "product does not belong to you"
                    };
                    return res.status(400).send(errors);
                }
                // let sellerProduct =findProduct.id;
                // if(findProduct){
                let Orderservices = new OrderService();
                let getOrders =await Orderservices.findAll({userId:req.params.id})
                let productIds=[];
                let status=[];
                let checkProductId = getOrders.forEach(element => {
                    productIds.push(element.OrderDetails.product.id)
                    if(element.OrderDetails.product.id===req.body.productId && element.status=="COMPLETED"){
                        status.push(true);
                    }
                });             
                let result=status.some(e=>e===true)
                let checkProductIsPurchased=productIds.some(e=>e==req.body.productId)
                console.log(productIds);
                console.log(checkProductIsPurchased);
                    
                if(!checkProductIsPurchased){
                    var errors = {
                        success: false,
                        msg: "user does not purchased this product"
                    };
                    return res.status(400).send(errors);
                }
                else if(result){
                    next()
                }
                else{
                    var errors = {
                        success: false,
                        msg: "user order status is in pending state"
                    };
                    return res.status(400).send(errors);
                }
            
            })
            .use(async(req,res,next)=>{
                const userReview= new UserReviewService();
                // console.log(req.user.id);
                if(req.params.id===req.user.id){
                    var errors = {
                        success: false,
                        msg: "user can't review himself"
                    };
                    return res.status(400).send(errors);
                }
                let checkReview =await userReview.findOne({userId:req.params.id,sellerId:req.user.id,productId:req.body.productId})
                // console.log(checkReview);
                if(checkReview){
                    var errors = {
                        success: false,
                        msg: "you already reviewed this user"
                    };
                    return res.status(400).send(errors);
                }
                else{
                    next()
                }
            })
        )
    }
    ValidateSellerReviewUpdate(){
        return(
            compose()
            .use((req,res,next)=>{
                super.validateSellerReviewUpdate(req.body)
                .then(data => {
                    next();
                }).catch(error => {
                    console.log(error)
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                })
            })
        )
    }


    validateTermsAndCondition() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateTermsAndConditionJoi(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                            };
                            res.status(400).send(errors);
                            return;
                        });
                })
        )
    }

}
