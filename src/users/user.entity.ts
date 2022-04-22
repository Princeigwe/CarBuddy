import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import {Exclude} from 'class-transformer'
import {UserProfile} from '../profiles/profiles.entity'

@Entity() // marking User as a database table
export class User {
    // defining user properties 
    @PrimaryGeneratedColumn() // marking id as primary key column 
    id: number;

    @Column() // marking email column
    email: string;

    @Column() // marking username column
    username: string;

    @Column() // marking password column
    @Exclude() // exclude the password when printing the API response
    password: string;

    /** 
        one to one relationship, with ability to call user entity from userProfile entity
    */
    @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
    profile: UserProfile[];
}