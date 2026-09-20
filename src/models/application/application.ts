  import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
  import { Types } from "mongoose";
  import { APPLICATIONSTATUS } from "src/common/types";

  @Schema({ _id: false })
  export class UserCV {

    @Prop({
      type: String,
      required: true,
    })
    secure_url!: string;

    @Prop({
      type: String,
      required: true,
    })
    public_id!: string;
  }

  @Schema({ timestamps: true })
  export class Application {

    @Prop({
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    })
    jobId!: Types.ObjectId;


    @Prop({
      type: Types.ObjectId,
      ref: "User",
      required: true,
    })
    userId!: Types.ObjectId;


    @Prop({
      type: UserCV,
      required: true,
    })
    userCV!: UserCV;


    @Prop({
      type: String,
      enum: APPLICATIONSTATUS,
      default: APPLICATIONSTATUS.PENDING,
    })
    status!: APPLICATIONSTATUS;
  }

  export const ApplicationSchema =
    SchemaFactory.createForClass(Application);