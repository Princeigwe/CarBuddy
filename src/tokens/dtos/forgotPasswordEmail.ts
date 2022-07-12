import {IsString, IsNotEmpty} from 'class-validator'

export class ForgotPasswordEmailDto {
    
    @IsNotEmpty()
    @IsString()
    email: string
}
