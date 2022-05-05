import { IsOptional, IsString, IsNumber } from "class-validator";

export class ExtraFeatureDto {

    @IsOptional()
    @IsString()
    featureOne: string

    @IsOptional()
    @IsString()
    featureTwo: string

    @IsOptional()
    @IsString()
    featureThree: string

    @IsOptional()
    @IsString()
    featureFour: string

    @IsOptional()
    @IsNumber()
    carModelId: number
}