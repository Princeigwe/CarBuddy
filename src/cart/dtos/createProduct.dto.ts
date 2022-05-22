import {IsString, IsNumber} from 'class-validator'

export class CreateProductDto {

    @IsString()
    productName: string

    @IsNumber()
    quantity: number

    @IsNumber()
    price: number

}
