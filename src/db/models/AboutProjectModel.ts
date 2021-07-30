import {Schema, model, Document} from 'mongoose';
import { IAboutProject } from '../../entities/AboutProject.entity';

const AboutProject = new Schema({
    project: {
        photos: [String],
        description: String,
    },
    author: {
        photos: [String],
        description: String, 
    },
    banner: String
});

export const AboutProjectModel = model<Document&IAboutProject>('about_project', AboutProject);