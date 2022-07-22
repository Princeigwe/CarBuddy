import {Injectable, BadRequestException, NotFoundException, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common'
import { UsersService } from '../users/users.service' // import UsersService to be used
import {randomBytes, scrypt as _scrypt} from 'crypto' // for password hashing and salting
import { promisify } from 'util' // convers a function to a Promise
import {JwtService} from '@nestjs/jwt'
import {Role} from '../enums/role.enum'
import {CartService} from '../cart/cart.service'

import {EventEmitter2} from '@nestjs/event-emitter'
import {UserRegisteredEvent} from '../events/user.registered.event'

const scrypt =promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService,
        private eventEmitter: EventEmitter2
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    /**
     * This function takes in a username, email, password, and role, and creates a new user with the
     * given email and password, and returns the user's id, email, username, and role.
     * @param {string} username - string, email: string, password: string, role: Role
     * @param {string} email - the email of the user
     * @param {string} password - string - the password that the user entered
     * @param {Role} role - Role - this is the role of the user. It is an enum.
     * @returns {
     *         "id": "5f5d8f8f8f8f8f8f8f8f8f8f",
     *         "email": "test@test.com",
     *         "username": "test",
     *         "role": "user"
     *     }
     */
    async register(username:string, email:string, password:string, role: Role){
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
        const user = await this.usersService.create(username, email, result,  role); // creating user with email, and result as password

        // emitting an event. "user.registered is the name of the event"
        this.eventEmitter.emit('user.registered', new UserRegisteredEvent(user.email)) // new UserRegisteredEvent(user.email) is the payload that will be used for creating cart
        
        // return user;
        return {'id': user.id, 'email': user.email, 'username': user.username, 'role': user.role}
    }


    /* A decorator that is used to serialize the response. */
    @UseInterceptors(ClassSerializerInterceptor)
    /**
     * It takes an email and password, finds the user in the database, and then compares the password
     * to the stored hash. If the password is correct, it returns the user
     * @param {string} email - The email address of the user.
     * @param {string} password - The password to hash.
     * @returns The user object is being returned.
     */
    async getAuthenticatedUser(email:string, password:string){
        const [user] = await this.usersService.find(email)
        if (!user) {
            throw new NotFoundException("Invalid Credentials")
        }
        const [salt, storedHash] = user.password.split('.') // getting the user password from database
        const hash = await scrypt(password, salt, 32) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException("Invalid Credentials")
        }
        // return user
        return {'id': user.id, 'email': user.email, 'username': user.username, 'role': user.role}
    }

    /**
     * It takes a userId, creates a payload object with the userId, and then uses the jwtService to
     * sign the payload and return the token
     * @param {number} userId - The userId of the user that is being logged in.
     * @returns A JWT token
     */
    public getCookieWithJwtToken(userId: number){
        const payload = {userId}
        const token = this.jwtService.sign(payload)
        return token
    }

    /**
     * It returns a string that contains the cookie name, the cookie value, the cookie path, and the
     * cookie expiration date
     * @returns A string that is the cookie for log out.
     */
    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }


     // this function changes the user's password when authenticated already
    async changePassword (password: string, confirmPassword: string, email: string) {
        const user = this.usersService.findEmail(email)
        if(!user) {
            throw new NotFoundException("This account does not exist")
        }
        else if ( password !== confirmPassword) {
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

        await this.usersService.editPasswordByEmail(email, result)
        return {
            message: "Password updated successfully"
        }
    }
}
