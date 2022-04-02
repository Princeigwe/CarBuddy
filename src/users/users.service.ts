import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from 'src/users/user.entity'

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)  private repo: Repository<User> // inject the User Repository that was defined by TypeORM
    ){}

    create(email:string, password:string){
        const user = this.repo.create({email, password}); // create a user instance in the User Repository
        return this.repo.save(user) // save the user instance
    }
}
