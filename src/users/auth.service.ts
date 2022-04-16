import {Injectable, BadRequestException, NotFoundException} from '@nestjs/common'
import { UsersService } from './users.service' // import UsersService to be used
import {randomBytes, scrypt as _scrypt} from 'crypto' // for password hashing and salting
import { promisify } from 'util' // convers a function to a Promise

const scrypt =promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signUp( username:string, email:string, password:string){
        // see if email is in use
        const users = await this.usersService.find(email)
        if (users.length){ // if there is an array of users with this email,throw an exception 
            throw new BadRequestException("Email in Use")
        }

        // Hash the user password
        // Generate a salt
        const salt = randomBytes(8).toString("hex")

        // Hash the password and salt together
        const hash = (await scrypt(password, salt, 32) as Buffer) // hash output will be of 32 characters [Buffer is result of hashing for TypeScript]

        // Join the hashed result together with the salt to be used as password
        const result = salt + "." + hash.toString("hex");
        
        // Create a new user and save it
        const user = await this.usersService.create( username, email, result); // creating user with email, and result as password

        // Return the new user
        return user
    }

    async signIn(email:string, password:string){
        const [user] = await this.usersService.find(email)
        if (!user) {
            throw new NotFoundException("User Not Found")
        }
        const [salt, storedHash] = user.password.split('.') // getting the user password from database
        const hash = await scrypt(password, salt, 32) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException("Invalid Credentials")
        }
        return user
    }
}