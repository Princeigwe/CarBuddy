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
        request.session.passwordResetToken = (await forgotPasswordEmail).token

        // returning response of the forgotPasswordEmail method
        return forgotPasswordEmail

    }

    // @Post('confirm-password-reset')
    // async confirmPasswordReset ( @Session() session: Record<string, any>, @Body() body: ConfirmPasswordResetDto) {
    //     // var passwordResetToken = session.passwordResetToken
    //     // body.token = passwordResetToken
    //     return this.tokensService.confirmPasswordReset(body.token)
    // }

    @Get()
    async getTokens () {
        return this.tokensService.getTokens();
    }

    @Delete()
    async deleteTokens () {
        return this.tokensService.deleteTokens();
    }
}

