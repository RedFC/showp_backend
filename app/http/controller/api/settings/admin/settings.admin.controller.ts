import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';

import { SettingsService } from "../../../../services/settings.service";
import { ErrorService } from "../../../../services/error.service";


export class AdminSettings {

  async createTerms(req, res) {
  
    try {
      
      let settingsService = new SettingsService();
      
      let createupdatetermsandconditions = await settingsService.createTerms({termsandconditions : req.body.termsandconditions});
      
      res.status(200).send({ success: true, data: createupdatetermsandconditions, msg: "AboutUs Successfully Created", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async updateTerms(req,res) {
    
    try {
      
      let settingsService = new SettingsService();
      
      let updatetermsandconditions = await settingsService.updateTerms({id : req.params.id},{termsandconditions : req.body.termsandconditions});
      
      res.status(200).send({ success: true, data: updatetermsandconditions, msg: "AboutUs Successfully Created", status: 200 });


    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  // About Us

  async createAboutus(req, res) {

    try {
      
      let settingsService = new SettingsService();
      
      let createAboutsUs = await settingsService.createAboutus({ aboutus: req.body.aboutus });
      
      res.status(200).send({ success: true, data: createAboutsUs, msg: "AboutUs Successfully Created", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }


  async updateAboutus(req,res) {
    
    try {
      
      let settingsService = new SettingsService();
      
      let createAboutsUs = await settingsService.updateAboutus({id : req.params.id},{aboutus : req.body.aboutus});
      
      res.status(200).send({ success: true, data: createAboutsUs, msg: "AboutUs Successfully Created", status: 200 });


    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  // ReturnPolicy

  // async createReturnPolicy(req, res) {
  
  //   try {
      
  //     let settingsService = new SettingsService();
      
  //     let createAboutsUs = await settingsService.createAboutus({ aboutus: req.body.aboutus });
      
  //     res.status(200).send({ success: true, data: createAboutsUs, msg: "AboutUs Successfully Created", status: 200 });

  //   } catch (error) {
  //     ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
  //   }

  // }


}
