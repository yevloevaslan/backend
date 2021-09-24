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
    banner?: string
}

interface getInfoResult {
    data: IAboutProject
}

interface infoAboutProjectResultData {
    data: IAboutProject
}

const createOrUpdateInformationAboutProject = async(data:InputDataInformationAboutProject): Promise<infoAboutProjectResultData> => {
    const result = await AboutProjectModel.findOne();
    if (result) {
        const updateData: InputDataInformationAboutProject = {};
        if ('project' in data) updateData.project = data.project;
        if ('author' in data) updateData.author = data.author;
        if ('banner' in data) updateData.banner = data.banner;
        await AboutProjectModel.updateOne({_id: result._id}, {$set: updateData});
    } else {
        await new AboutProjectModel(data).save();
    }
    return {
        data: {
            project: data.project,
            author: data.author,
            banner: data.banner,
        },
    };
};

const getInformationAboutProject = async(): Promise<getInfoResult> =>{
    const result = await AboutProjectModel.findOne({}, {_id: 0});
    if (!result) return {
        data: {
            author: {
                description: '',
                photos: [],
            },
            project: {
                description: '',
                photos: [],
            },
            banner: '',
        },
    };
    return {
        data: result,
    };
};
    

export {
    createOrUpdateInformationAboutProject,
    getInformationAboutProject,
};