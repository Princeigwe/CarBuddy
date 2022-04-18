import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import {User} from '../users/user.entity'

@Entity()
export class UserProfile { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    age: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    status: string

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