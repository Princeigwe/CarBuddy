import { Injectable } from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Token} from './token.entity'

import {jwtConstants} from '../auth/constants'
const crypto = require('crypto') // module used to generate cryptographic signature

import {transporter} from '../nodemailer/transporter'
import jwt from 'jsonwebtoken'


@Injectable()
export class TokensService {

    constructor ( 
        @InjectRepository(Token) private tokenRepo: Repository<Token>,
    ) {}


    /**
     * It creates a JWT token, saves it in the database, and sends it to the user's email address
     * @param {string} email - the email of the user requesting for password reset
     * @returns an object with a message property.
     */

    async randomPasswordResetString (size = 54) {
        return crypto.randomBytes(size).toString('base64').slice(0, size);
    }

    async forgotPasswordEmail (email: string) {

        const tokenString = await this.randomPasswordResetString()

        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: `${email}`,
            subject: "Password Reset",
            html: '<p>Click <a href="http://localhost:3000/tokens/confirm-password-reset/' + tokenString + '">here</a> to reset your password</p>'
        }

        await transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.error(err);
            }else {
                console.log('Message sent: ' + info.response)
            }
            transporter.close()
        })

        // if there's a token that is related to the email already in the database, delete it
        let oldToken = await this.tokenRepo.find({where: {email: email}})
        if (oldToken) {
            await this.tokenRepo.remove(oldToken)
        }

        // create new token
        const token = this.tokenRepo.create({email, tokenString})
        await this.tokenRepo.save(token)

        return {
            message : " Please check your email to reset password.",
            token: token
        }
    }


    // this function resets the user email password with the help of the token,
    // but first the token associated with the user email will have to be fetched from the Token database
    async confirmPasswordReset (password: string, confirmPassword: string) {

    }

    // get all tokens
    async getTokens() {
        return this.tokenRepo.find()
    }

    async deleteTokens () {
        await this.tokenRepo.delete({})
        return {
            message: 'Token deleted'
        }
    }
}
