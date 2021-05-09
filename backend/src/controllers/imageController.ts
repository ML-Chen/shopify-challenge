import { Response, Request } from 'express';
import { rest } from 'lodash';
import { Image, ImageDocument } from '../models/Image';
import { uploadFileOrFiles } from '../util/image';

/**
 * Upload images
 * @route POST /images
 * Request body:
 * @param {string} req.body.data Stringified JSON of an array of  image details { password: string, public: boolean }.
 * @param {UploadedFile? | Array<UploadedFile>?} images
 */
export const addImages = (req: Request, res: Response) => {
    const imageDetails: Array<{ password: string, public: boolean}> = JSON.parse(req.body.data);
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
    Image.collection.insertMany(newImages)
        .then(mongoResponse => {
            res.status(201).json(mongoResponse.ops);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
};

/**
 * Delete images
 * @route DELETE /images
 * @param {string[]} req.body.images Uri of images to be deleted
 * @param {string} req.body.password Password
 */
export const deleteImages = async (req: Request, res: Response) => {
    const mongoResponse = await Image.deleteMany({
        password: req.body.password,
        uri: { $in: req.body.images }
    });
    res.json(mongoResponse);
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
 * @route GET /images
 * @param {string?} req.query.password
 */
export const getImages = (req: Request, res: Response) => {
    console.log(req.query.password);
    Image
        .find({
            $or: [{ public: true }, { password: req.query.password as string }]
        }, '_id uri public')
        .then(images => {
            res.status(200).json(images);
        });
};
