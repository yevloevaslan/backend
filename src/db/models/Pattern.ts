import { Schema, model, Document } from 'mongoose';
import {Pattern, PatternOne, PatternTwo, PatternThree, PatternFour, PatternFive} from '../../entities/Pattern';

export interface PatternModel extends Pattern, Document {
title: string,
description: string,
params: PatternOne | PatternTwo | PatternThree | PatternFour | PatternFive
}

const Pattern = new Schema({
title: {
type: String,
required: true,
},
description: {
type: String,
required: true,
},
text: {
type: String,
required: true,
},
photos: {
type: [String],
required: true
},
sound: {
type: String,
required: true,
},
answer: {
type: String,
required: true,
},
answers: {
type: [String],
required: true,
}
}, {
timestamps: true,
strict: false
});

export const PatternModel = model<PatternModel>('pattern', Pattern);