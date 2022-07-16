import { Injectable, NotFoundException } from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Token} from './token.entity'
import {jwtConstants} from '../auth/constants'
const crypto = require('crypto') // module used to generate cryptographic signature
import {transporter} from '../nodemailer/transporter'
import jwt from 'jsonwebtoken'
import {UsersService} from '../users/users.service'
import {randomBytes, scrypt as _scrypt} from 'crypto' // for password hashing and salting
import { promisify } from 'util' // convers a function to a Promise
const scrypt =promisify(_scrypt)


@Injectable()
export class TokensService {

    constructor ( 
        @InjectRepository(Token) private tokenRepo: Repository<Token>,
        private usersService: UsersService
    ) {}


    // function that generates crypto tokens that will later be assigned to an email fo password reset
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
    async confirmPasswordReset (password: string, confirmPassword: string, tokenString: string) {

        const tokenEntity = await this.tokenRepo.findOne({where: {tokenString: tokenString}})
        const minuteOfTokenIssuedDate = tokenEntity.dateIssued.getMinutes() // get the minute of the time token was issued
        const currentTimeMinute = new Date().getMinutes() // get the current time minute
        const validThroughMinute = minuteOfTokenIssuedDate + 2 // 2 here is 2 minutes


        // todo: write what happens when token issued minute is 58 or 59
        // if the valid token minute is less than the current timeMinute when the function is called,
        // or if token was issued on the 58th minute, delete it when this function is called in the first minute of the next hour
        // the token becomes invalid. delete token and respond with "invalid token message"
        if (validThroughMinute < currentTimeMinute || validThroughMinute - currentTimeMinute == 59) {
            await this.tokenRepo.remove(tokenEntity)
            throw new NotFoundException("This token has expired, kindly request for a new password reset token.")
        }

        const userEmail = tokenEntity.email
        // console.log(userEmail)

        // getting the user entity by email
        const user = await this.usersService.findEmail(userEmail)
        console.log( JSON.stringify(user['username']) )

        // resetting the password
        if (!user) {
            throw new NotFoundException("User with this email does not exist.")
        }

        if ( password !== confirmPassword) {
            return { message: "Passwords do not match" }
        }

        const newPassword = confirmPassword
        // hashing the new password

        // Generate a salt
        const salt = randomBytes(8).toString("hex")

        // Hash the password and salt together
        const newHash = (await scrypt(newPassword, salt, 32) as Buffer) // hash output will be of 32 characters [Buffer is result of hashing for TypeScript]

        // Join the hashed result together with the salt to be used as newPassword
        const result = salt + "." + newHash.toString("hex");

        await this.usersService.editPasswordByEmail(userEmail, result)
        return {
            message: "Password updated successfully"
        }
        // if (!tokenEntity) {
        //     throw new NotFoundException("Token is invalid, request for new password reset token")
        // }

        
        
        
    }

    // get all tokens
    async getTokens() {
        return this.tokenRepo.find()
    }

    async deleteTokenByEmail( email: string) {
        const token = await this.tokenRepo.findOne({where: {email: email}})
        this.tokenRepo.delete(token)
    } 

    async deleteTokens () {
        await this.tokenRepo.delete({})
        return {
            message: 'Token deleted'
        }
    }


    async changePassword (password: string, confirmPassword: string, email: string) {
        const user = this.usersService.findEmail(email)
        if(!user) {}
    }
}
