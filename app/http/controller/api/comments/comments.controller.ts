import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';
import { ErrorService } from "../../../services/error.service";
import { CommentsService } from "../../../services/comments.service";


export class Comments {

  async create(req, res) {
  
    try {
      
      let CommentService = new CommentsService();

      let _schema = {
        comment: req.body.comment,
        user : { connect: { id: req.user.id } },
        reviews : {connect : [{id : req.body.review}]}
      }

      let createComment = await CommentService.createComment(_schema);
      res.status(200).send({ success: true, data: createComment, msg: "Comment posted", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }


  async update(req, res) {
  
    try {
      
      let CommentService = new CommentsService();

      let _schema = {
        comment: req.body.comment
      }

      let UpdateComment = await CommentService.updateComment({id : req.params.id},_schema);
      res.status(200).send({ success: true, data: UpdateComment, msg: "Comment Updated", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async delete(req, res) {
    try {
      
      let CommentService = new CommentsService();

      let deleteComment = await CommentService.deleteComment({id : req.params.id});
      res.status(200).send({ success: true, data: deleteComment, msg: "Comment Deleted", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }



}
