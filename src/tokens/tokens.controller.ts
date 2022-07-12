import { Controller, Post, Body, Get } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ForgotPasswordEmailDto } from './dtos/forgotPasswordEmail';

@Controller('tokens')
export class TokensController {

    constructor(private tokensService: TokensService) {}

    @Post('forgot-password')
    async forgot ( @Body() body: ForgotPasswordEmailDto) {
        return this.tokensService.forgotPasswordEmail(body.email)
    }

    @Get()
    async getTokens () {
        return this.tokensService.getTokens();
    }
}

