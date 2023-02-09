import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';

import { SettingsService } from "../../../services/settings.service";
import { ErrorService } from "../../../services/error.service";


export class Settings {

  async getTerms(req, res) {
    try {
      
      let service = new SettingsService();
      let getTerms = await service.getTerms()

      res.status(200).send({ success: true, data: getTerms, msg: "Fetched Successfull", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async getAboutus(req, res) {
  
    try {
      
      let service = new SettingsService();
      let getAbout = await service.getAboutus()

      res.status(200).send({ success: true, data: getAbout, msg: "Fetched Successfully", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }



}
