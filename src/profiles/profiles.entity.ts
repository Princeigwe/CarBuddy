import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import {User} from '../users/user.entity'


export enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced"
}

@Entity()
export class UserProfile { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    // @Column({
    //     type: "enum",
    //     enum: MaritalStatus,
    //     default: MaritalStatus.SINGLE
    // })
    // maritalStatus: MaritalStatus

    @Column()
    maritalStatus: string

    @Column()
    telephone: string

    @Column()
    address: string

    /** 
        one to one relationship to User entity, with ability to call this entity for user entity
    */
    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn() // this entity owns the relationship
    user: User
}