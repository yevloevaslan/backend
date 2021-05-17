import {AboutProjectModel} from '../db/models';
import { IAboutProject } from '../entities/AboutProject.entity';


interface InputDataInformationAboutProject {
    project?: {
        photos: string[],
        description: string,
    }
    author?: {
        photos: string[],
        description: string,
    }
}

const createOrUpdateInformationAboutProject = async(data:InputDataInformationAboutProject): Promise<IAboutProject> => {
    const result = await AboutProjectModel.findOne();
    if (result) {
        const updateData: InputDataInformationAboutProject = {};
        if (data.project) updateData.project = data.project;
        if (data.author) updateData.author = data.author;
        await AboutProjectModel.updateOne({_id: result._id}, {$set: updateData});
    } else {
        await new AboutProjectModel(data).save();
    }
    return data as IAboutProject;
};

const getInformationAboutProject = async(): Promise<IAboutProject> => await AboutProjectModel.findOne({}, {_id:0});

export {
    createOrUpdateInformationAboutProject,
    getInformationAboutProject,
};