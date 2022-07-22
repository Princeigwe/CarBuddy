import { Controller, Post, Body, Get, Delete, Request, Session, Redirect, Render, Response, UseGuards } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ForgotPasswordEmailDto } from './dtos/forgotPasswordEmail';
import { request } from 'https';
import {ConfirmPasswordResetDto} from './dtos/confirmPasswordReset';
import {ApiParam, ApiTags, ApiConsumes, ApiOperation} from '@nestjs/swagger'
import { response } from 'express';
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {RolesGuard} from '../roles.guards'
import {Role} from '../enums/role.enum'
import { Roles } from '../roles.decorator';


@Controller('tokens')
@ApiTags('Tokens')
export class TokensController {

    constructor(private tokensService: TokensService) {}

    @ApiOperation({summary: "This action is used to send the password reset url to the user's email"})
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
    @ApiOperation({summary: "This action confirms the new password"})
    @Post('confirm-password-reset')
    @Redirect('http://localhost:3000/cars/public') // change url to production url in production environment
    async confirmPasswordReset ( @Body() body: ConfirmPasswordResetDto) {
        return this.tokensService.confirmPasswordReset(body.password, body.confirmPassword, body.tokenString)
    }

    // anly the admin can access all token created
    @ApiOperation({summary: "This action confirms the new password by the admin"})
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getTokens () {
        return this.tokensService.getTokens();
    }

    // anly the admin can delete all tokens created, but token will be deleted automatically after password reset
    @ApiOperation({summary: "The admin can delete all tokens created, but token will be deleted automatically after password reset"})
    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteTokens () {
        return this.tokensService.deleteTokens();
    }
}

