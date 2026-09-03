import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true })
export class Company {
    readonly _id!: Types.ObjectId;

   
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
    })
    companyName!: string;

   
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    description!: string;

  
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    industry!: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    address!: string;


    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    numberOfEmployees!: string;

   
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    })
    companyEmail!: string;

    
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy!: Types.ObjectId;

  
    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        required: false,
    })
    logo?: {
        secure_url: string;
        public_id: string;
    };

    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        required: false,
    })
    coverPic?: {
        secure_url: string;
        public_id: string;
    };

    // 10. HRs Array
    @Prop({
        type: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'User',
            },
        ],
        default: [],
    })
    HRs!: Types.ObjectId[];

    @Prop({ type: Date })
    bannedAt!: Date;


    @Prop({ type: Date })
    deletedAt!: Date;

  
    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        required: false,
    })
    legalAttachment?: {
        secure_url: string;
        public_id: string;
    };

  
    @Prop({
        type: Boolean,
        default: false,
    })
    approvedByAdmin!: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);