import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';
import { ReportService } from "../../../services/report.service";
import { ErrorService } from "../../../services/error.service";

export class Report {
  
  async create(req,res) {
  
    try {
      
      let Service = new ReportService();
      let _schema = {
        user: { connect: { id: req.user.id } },
        review : {connect : { id : req.body.review}},
        message : req.body.message
      }
      let createService = await Service.createReviewReport(_schema)
      res.status(200).send({ success: true, user: createService, msg: "Reported Successfully", status: 200 });
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async getMyReports(req,res) {
  
    try {
      
      let Service = new ReportService();
      
      let createService = await Service.findAll({reportedBy : req.user.id})
      res.status(200).send({ success: true, user: createService, msg: "Successfully Fetched", status: 200 });
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async getAllReports(req,res) {
  
    try {
      
      let Service = new ReportService();
      
      let createService = await Service.findAll()
      res.status(200).send({ success: true, user: createService, msg: "Successfully Fetched", status: 200 });
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }


}
