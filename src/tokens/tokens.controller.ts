import { Controller, Post, Body, Get, Delete, Request, Session, Redirect, Render, Response } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ForgotPasswordEmailDto } from './dtos/forgotPasswordEmail';
import { request } from 'https';
import {ConfirmPasswordResetDto} from './dtos/confirmPasswordReset';
import { response } from 'express';


@Controller('tokens')
export class TokensController {

    constructor(private tokensService: TokensService) {}

    @Post('forgot-password')
    async forgotPasswordEmail ( @Body() body: ForgotPasswordEmailDto, @Request() request) {
        var forgotPasswordEmail = await this.tokensService.forgotPasswordEmail(body.email)

        // setting a session object
        request.session.passwordResetToken =  forgotPasswordEmail.token.tokenString 
        request.session.save()
        console.log(request.session.passwordResetToken)

        // returning response of the forgotPasswordEmail method
        return forgotPasswordEmail

    }

    
    @Get('password-reset/:tokenString')
    async sessionResetToken(@Request() request, @Response() response) {
        console.log("tokenString: ", request.session.passwordResetToken)
        return response.render('password-reset', {tokenString: request.session.passwordResetToken})
    }

    // after password reset, redirect to public cars endpoint
    @Post('confirm-password-reset')
    @Redirect('http://localhost:3000/cars/public') // change url to production url in production environment
    async confirmPasswordReset ( @Body() body: ConfirmPasswordResetDto) {
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

