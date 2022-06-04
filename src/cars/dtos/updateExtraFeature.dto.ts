import { IsOptional, IsString, IsNumber } from "class-validator";
import {ApiProperty} from "@nestjs/swagger"

export class UpdateExtraFeatureDto {

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    featureOne: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    featureTwo: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    featureThree: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    featureFour: string

}