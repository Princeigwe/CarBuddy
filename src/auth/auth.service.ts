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


    @UseInterceptors(ClassSerializerInterceptor)
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

    public getCookieWithJwtToken(userId: number){
        const payload = {userId}
        const token = this.jwtService.sign(payload)
        return token
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}
