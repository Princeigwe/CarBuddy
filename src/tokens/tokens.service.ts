import { Injectable } from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Token} from './token.entity'

import {jwtConstants} from '../auth/constants'
const crypto = require('crypto') // module used to generate cryptographic signature

import {transporter} from '../nodemailer/transporter'

// what im trying to do here is to send jwt tokens as password reset tokens.

// function to convert an object to a string and to Buffer Base64
const toBase64 = obj => {
    const str = JSON.stringify(obj)
    return Buffer.from(str).toString('base64')
}

// function to replace special strings in the URL
const replaceSpecialChars = b64string => {
    return b64string.replace(/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
            case '=':
                return '';
            case '+':
                return '-';
            case '/':
                return '_';
        }
    
    })
}

// defining the jwt header which describes the cryptographic operation in signing the token
const header = {
    alg: 'HS256', // the encryption algorithm
    typ: 'JWT'  // the type of header of the token
}

// convert header to base64URL
const b64Header = toBase64(header)
const jwtB64Header = replaceSpecialChars(b64Header) // defining the header of a JWT




@Injectable()
export class TokensService {

    constructor ( 
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
    ) {}


    /**
     * It creates a JWT token, saves it in the database, and sends it to the user's email address
     * @param {string} email - the email of the user requesting for password reset
     * @returns an object with a message property.
     */
    async forgotPasswordEmail (email: string) {

        // defining JWT payload that contains the necessary user information
        const payload ={
            //todo: remember to set the iss to deployed API url for production environment
            iss: 'http://localhost:3000', // the issuer of the token
            exp: 800000, // token expiry time in milliseconds
            email: email,
            isHuman: true
        }

        // convert payload to base64URL
        const b64Payload = toBase64(payload)
        const jwtB64Payload = replaceSpecialChars(b64Payload)
        // return jwtB64Payload

        // function to create signature of jwt token.
        // Thi is created  by joining the header and the payload of the token, both base64 encoded...
        // and hashing the result with a hashing algorithm and a secret key
        const createSignature = ( jwtB64Header, jwtB64Payload, secret ) => {
            // generate a Hmac signature using sha256 algorithm
            let signature = crypto.createHmac('sha256', secret)

            // hash the string that will be generated from the jwtB64Payload and jwtB64Header
            signature.update(jwtB64Header + '.' + jwtB64Payload)

            signature = signature.digest('base64') // convert to base64 to make it usable
            signature = replaceSpecialChars(signature) // replacing any special characters in signature

            return signature
        }

        const secret = jwtConstants.secret
        const signature = createSignature(jwtB64Header, jwtB64Payload, secret)
        const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature // the complete JWT token that will be used to reset password

        // add the jwt token related to the email in the database
        let passwordToken = this.tokenRepository.create({ email, jsonWebToken})
        this.tokenRepository.save(passwordToken)

        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: `${email}`,
            subject: "Password Reset",
            html: '<p>Click <a href="http://localhost:3000/api/password-recover/' + jsonWebToken + '">here</a> to reset your password</p>'
        }

        await transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.error(err);
            }else {
                console.log('Message sent: ' + info.response)
            }
                transporter.close()
        })

        // API response
        return {
            "message" : " Please check your email to reset password. "
        }

    }

    // this function resets the user email password with the help of the token,
    // but first the token associated with the user email will have to be fetched from the Token database
    async resetPassword (password: string, confirmPassword: string) {

    }

    // get all tokens
    async getTokens() {
        return this.tokenRepository.find()
    }
}
