import {IsNumber} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'


export class CreateProductDto {

    @ApiProperty({description: 'The id of the car for the cart item'})
    @IsNumber()
    carId: number

    @ApiProperty({description: 'The quantity of the car in the cart'})
    @IsNumber()
    quantity: number

}
