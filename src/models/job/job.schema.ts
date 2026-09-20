import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import {
  JOBLEVEL,
  JOBLOCATION,
  WORKINGTIME,
} from "src/common/types";

@Schema({ timestamps: true })
export class Job {

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  jobTitle!: string;


  @Prop({
    type: String,
    enum: JOBLOCATION,
    default: JOBLOCATION.ONSITE,
  })
  jobLocation!: JOBLOCATION;


  @Prop({
    type: String,
    enum: WORKINGTIME,
    default: WORKINGTIME.FULL_TIME,
  })
  workingTime!: WORKINGTIME;


  @Prop({
    type: String,
    enum: JOBLEVEL,
    required: true,
  })
  seniorityLevel!: JOBLEVEL;


  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  jobDescription!: string;


  @Prop({
    type: [String],
    default: [],
  })
  technicalSkills!: string[];


  @Prop({
    type: [String],
    default: [],
  })
  softSkills!: string[];


  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  addedBy!: Types.ObjectId;


  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  updatedBy!: Types.ObjectId;


  @Prop({
    type: Boolean,
    default: false,
  })
  closed!: boolean;


  @Prop({
    type: Types.ObjectId,
    ref: "Company",
    required: true,
  })
  companyId!: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
});

JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });