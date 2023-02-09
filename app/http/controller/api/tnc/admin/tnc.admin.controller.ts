import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid'; 

import { ErrorService } from "../../../../services/error.service";
import { SettingsService } from "../../../../services/settings.service";
export class TermsAConditions {
    
    async createOrUpdate (req, res){
        try {
           const service = new SettingsService();
           const tnc = await service.getTerms();
           let result = {data:null , msg:null};
           
           if(!tnc){             
             result.data = await service.createTerms({termsandconditions: req.body.termsandconditions});
             result.msg = "Terms and Condition Has Been Created"
           }else{
             result.data = await service.updateTerms({id: tnc.id},{termsandconditions: req.body.termsandconditions});
             result.msg = "Terms and Condition Has Been Updated"
           }
 
           res.status(200).send({ 
               success: true, 
               msg: result.msg, 
               status: 200, 
               data: result.data, 
            });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async get (req, res){
        try {
           const service = new SettingsService();
           const data = await service.getTerms();
 
           res.status(200).send({ 
               success: true, 
               msg:"Fetched Successfully",
               status: 200, 
               data, 
            });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }}
}
