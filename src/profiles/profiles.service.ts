import { Injectable, NotFoundException, HttpException, HttpStatus, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import {Not, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {UserProfile} from './profiles.entity'
import {MaritalStatus} from '../enums/maritalStatus.enum'
import {User} from '../users/user.entity';

@Injectable()
export class ProfilesService {

    constructor(
        @InjectRepository(UserProfile)  private userProfileRepo: Repository<UserProfile>
    ){}
    
    @UseInterceptors(ClassSerializerInterceptor)
    async createUserProfile(firstName: string, lastName: string, age: number, maritalStatus: MaritalStatus, telephone: string, address: string, user: User)
        {
            const userProfile = this.userProfileRepo.create({firstName, lastName, age, maritalStatus, telephone, address, user: user});
            await this.userProfileRepo.save(userProfile)
            return userProfile
        }

    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
        return await this.userProfileRepo.find()
    }

    async getUserProfileById(id: number) {
        const userProfile = await this.userProfileRepo.findOne(id)
        if (!userProfile) {
            throw new NotFoundException("Profile not found")
        }
        return userProfile;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    findFirstName(firstName: string) {
        const userProfile = this.userProfileRepo.find({firstName})
        if (!userProfile) {
            throw new NotFoundException(`Profile with ${firstName} not found`)
        }
        return userProfile
    }

    async updateUserProfileById(id: number, attrs: Partial<UserProfile>) {
        const userProfile = await this.getUserProfileById(id);
        if (!userProfile) { 
            throw new NotFoundException("Profile does not exist") 
        }
        Object.assign(userProfile, attrs);
        return this.userProfileRepo.save(userProfile)
    }

    async deleteUserProfileById(id:number) {
        const userProfile = await this.getUserProfileById(id)
        if (!userProfile) {
            throw new NotFoundException("Profile does not exist")
        }
        this.userProfileRepo.delete(userProfile)
        return new HttpException('Profile Deleted', HttpStatus.FORBIDDEN)
    }

}
