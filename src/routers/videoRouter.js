import express from "express"
import { watch,
  getUpload,
  postUpload,
  getEdit,
  postEdit
} from '../controllers/videoController'

const videoRouter = express.Router()

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);


export default videoRouter;