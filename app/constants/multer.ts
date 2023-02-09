import Multer from "multer";
import compose from "composable-middleware"
import fs from 'fs';
import path from 'path'; 

// This implementation requires busboy-body-parser initialized in app
interface IFields {
    name: string;
}
const fileStorage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // for folder name
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(
            null,
            `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
        );
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"||
        file.mimetype === "video/mp4"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);

    }
};
export const upload = Multer({ storage: fileStorage, fileFilter: fileFilter });


export class Uploader {
    static dest: string = './public/images';
    public static fields(names: IFields[]) {
        return (
            compose()
                .use((req, res, next) => {
                    if (req.files == null) { next(); } else {
                        names.forEach(o => {
                            if (req.files[o.name] != null) {
                                Uploader.fileFilter(req.files[o.name], (error, status) => {
                                    if (!status) res.send( { success: false, msg: error, status: 500 })
                                    Uploader.fileStorage(req.files[o.name], (error, status, files) => {
                                        if (!status) res.send( { success: false, msg: error, status: 500 })
                                        req.body.files = files;
                                        next();
                                    })
                                })
                            }
                        })
                    }
                })
        )
    }

    public static async fileStorage(files, cb) {
        let filePaths = await Promise.all(files.map(async file => {
            let filePath = path.join(Uploader.dest, `${new Date().toISOString().replace(/:/g, "-")}-${file.name}`);
            await fs.writeFileSync(filePath, file.data);
            return filePath;
        }))
        cb(null, true, filePaths);
    }

    public static fileFilter(files, cb) {
        files.forEach(file => {
            if (
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/jpg" &&
                file.mimetype !== "image/jpeg"
            ) {
                cb("Image uploaded is not of type jpg/jpeg or png", false);
            }
        });
        cb(null, true);
    }
}