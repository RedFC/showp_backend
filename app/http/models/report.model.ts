"use strict";

export interface ReportProduct {
  id : String,	
  reportId : String
  reportedBy  : String
  message: String
  status : String
}

export interface ReportReview {
  id : String,	
  reportId : String
  reportedBy  : String
  message: String
  status : String
}

export interface ReportUser {
  id : String,	
  reportId : String
  reporter  : String
  message: String
  status : String
}