import {Schema, model, Document} from 'mongoose';
import {IFileEntity} from '../../entities/File.entity';

const File = new Schema({
    key: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const FileModel = model<IFileEntity&Document>('file', File);

