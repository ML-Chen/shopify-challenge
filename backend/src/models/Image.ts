import mongoose, { Model, Schema, Document } from 'mongoose';

export interface ImageDocument extends Document {
    password: string;
    uri: string;
    public: boolean;
}

const imageSchema = new Schema<ImageDocument>({
    password: Schema.Types.String,
    uri: {
        type: Schema.Types.String,
        required: true
    },
    public: {
        type: Schema.Types.Boolean,
        required: true
    }
}, { timestamps: true });

export const Image: Model<ImageDocument> = mongoose.model<ImageDocument>('Image', imageSchema);
