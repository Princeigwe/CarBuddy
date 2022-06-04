import { IsOptional, IsString, IsNumber } from "class-validator";
import {ApiProperty} from '@nestjs/swagger' // package to describe PATCH body parameters


export class ExtraFeatureDto {

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

    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    carModelId: number
}