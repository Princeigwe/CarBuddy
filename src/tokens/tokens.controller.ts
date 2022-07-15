import { Controller, Post, Body, Get, Delete, Request, Session } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ForgotPasswordEmailDto } from './dtos/forgotPasswordEmail';
import { request } from 'https';
import {ConfirmPasswordResetDto} from './dtos/confirmPasswordReset';

@Controller('tokens')
export class TokensController {

    constructor(private tokensService: TokensService) {}

    @Post('forgot-password')
    async forgotPasswordEmail ( @Body() body: ForgotPasswordEmailDto, @Request() request) {
        var forgotPasswordEmail = this.tokensService.forgotPasswordEmail(body.email)

        // setting a session object
        request.session.passwordResetToken = { passwordResetToken : (await forgotPasswordEmail).token.tokenString }
        console.log(request.session.passwordResetToken)

        // returning response of the forgotPasswordEmail method
        return forgotPasswordEmail

    }

    @Post('confirm-password-reset')
    async confirmPasswordReset ( @Body() body: ConfirmPasswordResetDto, @Request() request) {
        // getting the token from the session, and use it in the body data
        var passwordResetToken = request.session.passwordResetToken["passwordResetToken"]
        body.tokenString = passwordResetToken
        console.log(body.tokenString)

        return this.tokensService.confirmPasswordReset(body.password, body.confirmPassword, body.tokenString)
    }

    @Get()
    async getTokens () {
        return this.tokensService.getTokens();
    }

    @Delete()
    async deleteTokens () {
        return this.tokensService.deleteTokens();
    }
}

