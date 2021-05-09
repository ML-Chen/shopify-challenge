import { Response, Request } from 'express';
import { Image, ImageDocument } from '../models/Image';
import { uploadFileOrFiles } from '../util/image';

/**
 * Upload images
 * @route POST /images
 * Request body:
 * @param {string} req.body.json Stringified JSON of an array of  ImageDocuments (see Image.ts).
 * @param {UploadedFile? | Array<UploadedFile>?} images
 */
export const addImages = async (req: Request, res: Response) => {
    const imageDetails: Omit<ImageDocument, keyof Document>[] = JSON.parse(req.body.json);
    const imageUrls = uploadFileOrFiles(req.files.images);
    const newImages = [];
    for (let i = 0; i < imageDetails.length; i++) {
        const newImage = new Image({
            password: imageDetails[i].password,
            uri: imageUrls[i],
            public: imageDetails[i].public
        });
        newImages.push(newImage);
    }
    await Image.collection.insertMany(newImages);
    res.send('Images uploaded!');
};

/**
 * Delete images
 * @route DELETE /images
 * @param {string[]} req.body.images Uri of images to be deleted
 * @param {string} req.body.password Password
 */
export const deleteImages = async (req: Request, res: Response) => {
    await Image.deleteMany({
        password: req.body.password,
        uri: { $in: req.body.images }
    });
    res.send('Deleted images');
};

/**
 * Delete images
 * @route DELETE /images/all
 * @param {string} req.body.password Password
 */
export const deleteAllImages = async (req: Request, res: Response) => {
    await Image.deleteMany({
        password: req.body.password,
    });
    res.send('Deleted all images with the password');
};

/**
 * Get all images that are either public or have the password
 * @param {string?} req.body.password
 */
export const getImages = async (req: Request, res: Response) => {
    const images = Image.find({
        $or: [{ public: true, password: req.body.password }]
    });
};
