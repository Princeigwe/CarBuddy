import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
import {Exclude} from 'class-transformer'
import {UserProfile} from '../profiles/profiles.entity'
import { Role } from "../enums/role.enum";
import {Car} from '../cars/models/cars.entity'
// import {Cart} from '../cart/models/cart.entity'

@Entity() // marking User as a database table
export class User {
    // defining user properties 
    @PrimaryGeneratedColumn() // marking id as primary key column 
    id: number;

    @Column({type: "enum", enum: Role, default: Role.User})
    role: Role;

    @Column() // marking email column
    email: string;

    @Column({unique: true}) // marking username column
    username: string;

    @Exclude() // exclude the password when printing the API response
    @Column() // marking password column
    password: string;

    /** 
        one to one relationship, with ability to call user entity from userProfile entity
    */
    @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
    profile: UserProfile;

    @OneToMany(() => Car, (car) => car.dealer) 
    cars: Car[];

    // @OneToOne( () => Cart, (cart) => cart.owner)
    // cart:Cart
}