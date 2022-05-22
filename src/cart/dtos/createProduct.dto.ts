import {IsNumber} from 'class-validator'

export class CreateProductDto {

    @IsNumber()
    carId: number

    @IsNumber()
    quantity: number

}
