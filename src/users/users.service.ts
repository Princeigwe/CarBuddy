import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from 'src/users/user.entity'
import {Role} from '../enums/role.enum'
import { EventEmitter2 } from '@nestjs/event-emitter';
import {UserDeletedEvent} from '../events/user.deleted.event'

// export type User = any
@Injectable()
export class UsersService {

    constructor(
      @InjectRepository(User)  private userRepo: Repository<User>, // create repository for User Entity, and inject it as a dependency in the service.
      private eventEmitter: EventEmitter2
    ){}

    /**
     * 
     * @param role tried to pass the role parameter of type Role enum, but it gave strange error. Ended up making it optional
     */
    create(username: string, email:string, password:string, role?:Role){
        const user = this.userRepo.create({username, email, password, role}); // create a user instance in the User Repository
        return this.userRepo.save(user) // save the user instance
    }

    // get user instance with an ID
    findOneById( id: number) {      
      return this.userRepo.findOne(id)
    }

    findOne(condition: any) : Promise<User> {
      return this.userRepo.findOne(condition)
      
    }

    findEmail(email: string) {
      const user = this.userRepo.findOne({email})
      if (user) {return user}
      throw new NotFoundException('User not found')
    }

    findUsername(username: string) {
      return this.userRepo.findOne(username)
    }


    // get all user instances by email that was given
    find(email: string) {
      return this.userRepo.find({email})
    }

    // get all User instances
    async findAll() {
      return await this.userRepo.find()
    }

    // this method will be used when resetting the password
    async editPasswordByEmail(email: string, newPassword: string) {
      const user = await this.findEmail(email)
      user.password = newPassword
      this.userRepo.save(user)
      return user
    }

    //update one or more attributes of the user instance optionally, with the ID provided
    // async update( id: number, attrs: Partial<User>) {
    //   const user = await this.findOneById(id)
    //   // if there was no user with this ID, throw an error
    //   if (!user) { 
    //     throw new NotFoundException(`User with id: ${id} does not exist`)
    //   }
    //   // if user was found, make an update
    //   Object.assign(user, attrs) // make the update
    //   return this.userRepo.save(user) // save the update
    // }

    // remove a user instance
    async remove(id: number) {
      const user = await this.findOneById(id)
      // if user is not found, throw error
      if (!user){
        throw new NotFoundException(`User ${id} does not exist`)
      }
      // emit event
      this.eventEmitter.emit('user.deleted', new UserDeletedEvent(user.email))
      this.userRepo.remove(user) // remove the user entity

      return new HttpException('User Deleted', HttpStatus.GONE)
    }

    async removeAll() {
      const users = await this.userRepo.find()
      this.userRepo.remove(users)
      throw new NotFoundException(`Users not found`)
    }
}
