import * as _ from "lodash";
import * as fs from "fs";
import moment from "../../../../modules/moment";
import { UserService } from "../../../services/user.service";
import { RedisService } from "../../../../cache/redis.service";
import { AuthService } from "../../../services/auth.service";
import { IProfile, ValidateProfile } from "../../../models/profile.user.model";
import { ErrorService } from "../../../services/error.service";
import short from 'short-uuid';
import { IUser, IUserCreateProfile, IUserEdit, IUserProfile, ValidateUser } from "../../../models/user.model";
import { Cloudinary } from "../../../../constants/cloudinary";
import { ConnectionService } from "../../../services/connection.service";
import { ProductImages } from "../productImages/productImages.controller";
export class User extends RedisService {
    constructor() {
        super();
    }
    async Exists(req,res) {
        try {
            const myUserService = new UserService();
            let user = await myUserService.findOne({ profile: { phoneNo: res.phoneNo } });
            if (user) {
                let {gcm_id,platform} = req.body
                let userValidationService = new ValidateUser();
                    userValidationService.validateGCM(user, gcm_id, {
                        error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                        next: uniqueGCM => {
                            let myAuthService = new AuthService();
                            myAuthService.generateAuthToken(
                                { id: user.id, role: user.role },
                                async (token) => {
                                    myUserService.redisSetUserData(token, moment(moment().add(48, "hours")).fromNow_seconds())
                                    if (!uniqueGCM) {
                                        let _user = await myUserService.findOneAndUpdate(
                                            { id: user.id },
                                            { gcm: { create: [{ id: gcm_id, platform }] } }
                                        )
                                        myUserService.redisUpdateUser(_user)
                                        _user["access_token"] = token;
                                        let success = {
                                            success: true,
                                            msg: "Logged in successfully",
                                            isExists : true,
                                            user: _user,
                                        };
                                        res.status(200).send(success);
                                        return;
                                    } else {
                                        let _user = _.clone(user);
                                        myUserService.redisUpdateUser(_user)
                                        _user["access_token"] = token;
                                        let success = {
                                            success: true,
                                            msg: "Logged in successfully",
                                            isExists : true,
                                            user: _user,
                                        };
                                        res.status(200).send(success);
                                        return;
                                    }
                                })
                        }
                    })
            } else {
                res.send({
                    isExists : false
                })
            }
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }
    async register(req, res) {
        try {
            const ImageUploads = new ProductImages();
            let GCM = req.body.gcm_id;
            let PLATFORM = req.body.platform;
            let _profile = {
                username: req.body.username.toString(),
                name: req.body.name,
                phoneNo: res.phoneNo,
                about: req.body.about
            }
            delete req.body.username;
            delete req.body.name;
            delete req.body.about;
            delete req.body.gcm_id;
            delete req.body.platform
            delete req.body.token
            let user = req.body;
            const myValidateProfile = new ValidateProfile();
            myValidateProfile.validate(_profile, {
                error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                next: async (profile: IProfile) => {
                    user.profile = { create: profile }
                    const myUserService = new UserService();
                    if (req.query.test==null) {
                        if (req.files.length) {
                                    ImageUploads.Imageuploader(
                                        (error) => {
                                          ErrorService.handler(res, error.status, error);
                                
                                        }, req,
                                        async (uploader) => {
                                            if (uploader.length) {
                                                let images = uploader.map(x => {
                                                return { profileImage: x.path }
                                                });
                                                _profile['profileImage'] = images[0].profileImage
                                            }
                                        });
                                        let userData = await myUserService.create(user, profile);
                                        if (userData) {
                                            // delete userData['profile'];
                                            let userValidationService = new ValidateUser();
                                                userValidationService.validateGCM(userData, GCM, {
                                                    error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                                                    next: uniqueGCM => {
                                                        let myAuthService = new AuthService();
                                                        myAuthService.generateAuthToken(
                                                            { id: userData.id, role: userData.role },
                                                            async (token) => {
                                                                myUserService.redisSetUserData(token, moment(moment().add(48, "hours")).fromNow_seconds())
                                                                if (!uniqueGCM) {
                                                                    let _user = await myUserService.findOneAndUpdate(
                                                                        { id: userData.id },
                                                                        { gcm: { create: [{ id: GCM, platform:PLATFORM }] } }
                                                                    )
                                                                    myUserService.redisUpdateUser(_user)
                                                                    _user["access_token"] = token;
                                                                    let success = {
                                                                        success: true,
                                                                        msg: "Logged in successfully",
                                                                        isExists : true,
                                                                        user: _user,
                                                                    };
                                                                    res.status(200).send(success);
                                                                    return;
                                                                } else {
                                                                    let _user = _.clone(userData);
                                                                    myUserService.redisUpdateUser(_user)
                                                                    _user["access_token"] = token;
                                                                    let success = {
                                                                        success: true,
                                                                        msg: "Logged in successfully",
                                                                        isExists : true,
                                                                        user: _user,
                                                                    };
                                                                    res.status(200).send(success);
                                                                    return;
                                                                }
                                                            })
                                                    }
                                                })
                                        }
                                } else {
                                    ErrorService.handler(res, 500, { success: false, msg: "Files Not Found", status: 500 });
                                }
                    } 
                    
                }
            })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    social_register(req, res) {
        try {
            const ImageUploads = new ProductImages();
            let GCM = req.body.gcm_id;
            let PLATFORM = req.body.platform;
            let _profile = {
                username: req.body.username.toString(),
                name: req.body.name,
                phoneNo: res.phoneNo,
                about: req.body.about,
                profileImage : req.body.profileImage
            }
            delete req.body.username;
            delete req.body.name;
            delete req.body.about;
            delete req.body.gcm_id;
            delete req.body.platform
            delete req.body.token;
            delete req.body.profileImage
            let user = req.body;
            const myValidateProfile = new ValidateProfile();
            myValidateProfile.validate(_profile, {
                error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                next: async (profile: IProfile) => {
                    user.profile = { create: profile }
                    const myUserService = new UserService();
                    if (req.query.test==null) {
                        if (req.files.length) {
                                    ImageUploads.Imageuploader(
                                        (error) => {
                                          ErrorService.handler(res, error.status, error);
                                
                                        }, req,
                                        async (uploader) => {
                                            if (uploader.length) {
                                                let images = uploader.map(x => {
                                                return { profileImage: x.path }
                                                });
                                                _profile['profileImage'] = images[0].profileImage
                                            }
                                        });
                                }
                                let userData = await myUserService.create(user, profile);
                                        if (userData) {
                                            // delete userData['profile'];
                                            let userValidationService = new ValidateUser();
                                                userValidationService.validateGCM(userData, GCM, {
                                                    error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                                                    next: uniqueGCM => {
                                                        let myAuthService = new AuthService();
                                                        myAuthService.generateAuthToken(
                                                            { id: userData.id, role: userData.role },
                                                            async (token) => {
                                                                myUserService.redisSetUserData(token, moment(moment().add(48, "hours")).fromNow_seconds())
                                                                if (!uniqueGCM) {
                                                                    let _user = await myUserService.findOneAndUpdate(
                                                                        { id: userData.id },
                                                                        { gcm: { create: [{ id: GCM, platform:PLATFORM }] } }
                                                                    )
                                                                    myUserService.redisUpdateUser(_user)
                                                                    _user["access_token"] = token;
                                                                    let success = {
                                                                        success: true,
                                                                        msg: "Logged in successfully",
                                                                        isExists : true,
                                                                        user: _user,
                                                                    };
                                                                    res.status(200).send(success);
                                                                    return;
                                                                } else {
                                                                    let _user = _.clone(userData);
                                                                    myUserService.redisUpdateUser(_user)
                                                                    _user["access_token"] = token;
                                                                    let success = {
                                                                        success: true,
                                                                        msg: "Logged in successfully",
                                                                        isExists : true,
                                                                        user: _user,
                                                                    };
                                                                    res.status(200).send(success);
                                                                    return;
                                                                }
                                                            })
                                                    }
                                                })
                                        }
                    } 
                    
                }
            })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    login(req, res) {
        try {
            let { username, phoneNo, role } = req.body;
            let orQuery = []
            if (username != null && username != "" && username != undefined) orQuery.push({ profile: { username } })
            if (phoneNo != null && phoneNo != "" && phoneNo != undefined) orQuery.push({ profile: { phoneNo } })
            let myUserService = new UserService();
            myUserService.findOneAdmin({
                blocked: false, role, OR: orQuery
            })
                .then(user => {
                    if (!user) {
                        ErrorService.handler(res, 400, {
                            success: false,
                            msg: "No user with this account exists!",
                            status: 400
                        })
                    } else {
                        // NEED TO DO PHONE NUMBER VERIFY HERE
                        myUserService.sendCode(user.profile.phoneNo)
                            .then(message => {
                                res.status(200).send({ success: true, user, msg: "Verification code sent to your phone number", status: 200 });
                            }).catch((error) => {
                                ErrorService.handler(res, 500, { success: false, msg: "There was an error in verifying SMS code", raw: error.message, status: 500 });
                            })
                    }
                }).catch(error => ErrorService.handler(res, 400, error))
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async logout(req, res) {
        try {
            let success = await super.deleteUserStateToken(req.auth)
            if (success) {
                let myUserService = new UserService();
                myUserService.findOneAndUpdate(
                    { id: req.user.id },
                    { gcm: { deleteMany: [{ id: req.body.gcm_id }] }, }
                ).then((_user) => {
                    myUserService.redisUpdateUser(_user)
                    var success = {
                        success: true,
                        msg: "Logged out successfully",
                    };
                    res.status(200).send(success);
                }).catch((error) => {
                    res
                        .status(500)
                        .send({ success: false, msg: error.message });
                    return;
                });
            }
            return;
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async get(req, res) {
        try {
            let limit = _.toInteger(req.query.limit);
            let page = _.toInteger(req.query.page);
            let { key, id } = req.query;
            let myUserService = new UserService();
            if (id != null && id != "" && id != undefined) {
                let user = await myUserService.findOne({ id })
                myUserService.redisUpdateUser(user);
                res.send({
                    success: true, user: user.profile
                })
            } else {
                let orQuery = [
                    { email: { contains: key, mode: "insensitive", } },
                    { profile: { username: { contains: key, mode: "insensitive", } } },
                    { profile: { name: { contains: key, mode: "insensitive", } } }
                ]
                let { users, count } = await myUserService.findWithLimit({ blocked: false, role: "USER", OR: orQuery }, limit, page)
                let user_profiles = users.map(x => x.profile)
                users.map(user => myUserService.redisUpdateUser(user))
                res.send({
                    success: true, users: user_profiles,
                    page: page,
                    pages: Math.ceil(count / limit),
                    count
                });
            }
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async update(req, res) {
        try {
            const { username, name, about } = JSON.parse(JSON.stringify(req.body));
            const files = JSON.parse(JSON.stringify(req.files));
            console.log(username, name, about)
            let user: IUserEdit = {
                profile: {
                    update: {
                        username,
                        name,
                        about,
                    }
                }
            }
            if (files.image != null) {
                const file = files.image;
                const image: any = async (path) => {
                    const cloudinary = new Cloudinary()
                    return await cloudinary.uploads(path, "image");
                }
                const { path } = file[0];
                const imgURL = await image(path);
                fs.unlink(path, () => { console.log(`Deleted ${path}`) });
                user.profile.update["profileImage"] = imgURL.url;
            }

            const myUserService = new UserService();
            let updatedUser = await myUserService.findOneAndUpdate({ id: req.user.id }, user)
            myUserService.redisUpdateUser(updatedUser)
            res.send({
                success: true, user: updatedUser, msg: "User updated successfully"
            });
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async createReturnPolicy(req, res) {
  
        try {
        
            const myUserService = new UserService();
            
            let _schema = {
                returnpolicy: req.body.returnpolicy,
                user: { connect: { id: req.user.id } }
            }
            
            let createReturnPolicies = await myUserService.CreateReturnPolicies(
                req.user.id,
                _schema.returnpolicy,
                _schema.user
            );
        
            res.status(200).send({ success: true, data: createReturnPolicies, msg: "Updated Your Return Policies", status: 200 });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }

    }

    async getReturnPolicy(req, res) {
  
        try {
        
            const myUserService = new UserService();
            
            let getReturnPolicy = await myUserService.getReturnPolicies({id : req.user.id})
        
            res.status(200).send({ success: true, data: getReturnPolicy, status: 200 });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }

    }

    verify(req, res) {
        try {
            let { phoneNo, code, gcm_id, platform } = req.body
            let myUserService = new UserService();
            myUserService.checkCode(phoneNo, code)
                .then(user => {
                    let userValidationService = new ValidateUser();
                    userValidationService.validateGCM(user, gcm_id, {
                        error: message => ErrorService.handler(res, 400, { success: false, msg: message, status: 400 }),
                        next: uniqueGCM => {
                            let myAuthService = new AuthService();
                            myAuthService.generateAuthToken(
                                { id: user.id, role: user.role },
                                async (token) => {
                                    myUserService.redisSetUserData(token, moment(moment().add(48, "hours")).fromNow_seconds())
                                    if (!uniqueGCM) {
                                        let _user = await myUserService.findOneAndUpdate(
                                            { id: user.id },
                                            { gcm: { create: [{ id: gcm_id, platform }] } }
                                        )
                                        myUserService.redisUpdateUser(_user)
                                        _user["access_token"] = token;
                                        let success = {
                                            success: true,
                                            msg: "Logged in successfully",
                                            user: _user,
                                        };
                                        res.status(200).send(success);
                                        return;
                                    } else {
                                        let _user = _.clone(user);
                                        myUserService.redisUpdateUser(_user)
                                        _user["access_token"] = token;
                                        let success = {
                                            success: true,
                                            msg: "Logged in successfully",
                                            user: _user,
                                        };
                                        res.status(200).send(success);
                                        return;
                                    }
                                })
                        }
                    })
                }).catch(error => {
                    ErrorService.handler(res, 500, { success: false, msg: "There was an error in verifying SMS code", raw: error.message, status: 500 });
                })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }
    
}
