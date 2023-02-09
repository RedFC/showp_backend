import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';
import { ReportService } from "../../../../services/report.service";
import { ErrorService } from "../../../../services/error.service"; 

export class Report {

  async HandelReportRequest(req,res) {
  
    try {
      
      let Service = new ReportService();
      let createService = await Service.updateReport({id : req.body.reportId},{status : "APPROVED", review :{ update : {isActive : false} } })
      res.status(200).send({ success: true, user: createService, msg: "Reported Approved", status: 200 });
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

}
