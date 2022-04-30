import { IsOptional, IsString, IsNumber } from "class-validator";

export class ExtraFeatureDto {

    @IsString()
    featureOne: string

    @IsString()
    featureTwo: string

    @IsString()
    featureThree: string

    @IsString()
    featureFour: string

    @IsNumber()
    carModelId: number
}