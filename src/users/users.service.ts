import { Injectable, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from 'src/users/user.entity'

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)  private repo: Repository<User> // create repository for User Entity, and inject it as a dependency in the service.
    ){}

    create(email:string, password:string){
        const user = this.repo.create({email, password}); // create a user instance in the User Repository
        return this.repo.save(user) // save the user instance
    }

    // get user instance with an ID
    findOne( id: number ) {      
      return this.repo.findOne(id)
    }

    // get all user instances by email that was given
    find(email: string) {
      return this.repo.find({email})
    }

    // get all User instances
    async findAll() {
      return await this.repo.find()
    }

    //update one or more attributes of the user instance, with the ID provided
    async update( id: number, attrs: Partial<User>) {
      const user = await this.findOne(id)
      // if there was no user with this ID, throw an error
      if (!user) { 
        throw new NotFoundException(`User with ${id} does not exist`)
      }
      // if user was found, make an update
      Object.assign(user, attrs) // make the update
      return this.repo.save(user) // save the update
    }

    // remove a user instance
    async remove(id: number) {
      const user = await this.findOne(id)
      // if user is not found, throw error
      if (!user){
        throw new NotFoundException(`User ${id} does not exist`)
      }
      return this.repo.remove(user) // remove the user entity
    }
}
