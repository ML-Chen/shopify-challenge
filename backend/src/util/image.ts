import { UploadedFile } from 'express-fileupload';
import storage from 'azure-storage';
import { uid } from 'uid';
import { CONNECTION_STRING_AZURE, CONTAINER_NAME_AZURE, STORAGE_ACCOUNT_NAME_AZURE } from '../util/secrets';

/**
 * Upload one or multiple images into Azure. This is helpful because express-fileupload gives you an UploadedFile | UploadedFile[]
 * @param files a single image file, or an array of image files
 * @returns the image URLs of the uploaded files
 */
export function uploadFileOrFiles(files: UploadedFile | UploadedFile[]): string[] {
    if (Array.isArray(files)) {
        return uploadFiles(files);
    } else {
        return [uploadFile(files)];
    }
}

/**
 * Upload multiple images into Azure
 * @param files image files
 * @returns the image URLs of the uploaded files
 */
export function uploadFiles(files: UploadedFile[]): string[] {
    return files.map(file => uploadFile(file));
}

/**
 * Upload single image into Azure
 * @param file image file
 */
export function uploadFile(file: UploadedFile): string {
    const blobSVC = storage.createBlobService(CONNECTION_STRING_AZURE);
    const imgRequest = file as UploadedFile;
    const uniqueID: string = uid(11);
    const index: number = imgRequest.name.lastIndexOf('.');
    let blobName = imgRequest.name.substring(0, index);
    blobName = blobName.concat('_', uniqueID, imgRequest.name.substring(index));

    blobSVC.createBlockBlobFromText(CONTAINER_NAME_AZURE, blobName, imgRequest.data, (error: Error) => {
        if (error) {
            console.error(`Error in createBlockBlobFromText: ${error}`);
            throw new Error(error.message);
        }
    });
    return `https://${STORAGE_ACCOUNT_NAME_AZURE}.blob.core.windows.net/${CONTAINER_NAME_AZURE}/${blobName}`;
}
