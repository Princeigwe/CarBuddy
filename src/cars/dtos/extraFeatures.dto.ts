import { IsOptional, IsString } from "class-validator";

export class ExtraFeatureDto {

    @IsString()
    @IsOptional()
    featureOne: string

    @IsString()
    @IsOptional()
    featureTwo: string

    @IsString()
    @IsOptional()
    featureThree: string

    @IsString()
    @IsOptional()
    featureFour: string

    @IsString()
    @IsOptional()
    featureFive: string

    @IsString()
    @IsOptional()
    featureSix: string
}