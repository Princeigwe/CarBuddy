import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import {User} from '../users/user.entity'
import {MaritalStatus} from '../enums/maritalStatus.enum'
import {Car} from '../cars/models/cars.entity'

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

    @Column({
        type: "enum",
        enum: MaritalStatus,
        default: MaritalStatus.SINGLE
    })
    maritalStatus: MaritalStatus

    @Column()
    telephone: string

    @Column()
    address: string

    /** 
        one to one relationship to User entity, with ability to call this entity for user entity
    */
    @OneToOne(() => User, (user) => user.profile, {cascade: true, onDelete: "CASCADE", eager: true}) // User Entity will be referenced to in the database because [cascade:true]
    @JoinColumn() // this entity owns the relationship [Foreign Key column]
    user: User

    /**
     *  this userProfile can access Car entities under it, and each Car can access the user profile from 'dealer' attribute
     */
    @OneToMany(()=>Car, (car) => car.dealer)
    cars: Car[]
}