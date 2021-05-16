import { FileModel } from '../db/models';

export const createFile = async (data: {key: string, path: string}): Promise<{data: null}> => {
    await FileModel.insertMany([{key: data.key, path: data.path}]);
    return {
        data: null,
    };
};