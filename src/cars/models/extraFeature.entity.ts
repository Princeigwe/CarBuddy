import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ChildEntity} from 'typeorm'
import {Car} from './cars.entity'

// @Entity()
@ChildEntity()
export class ExtraFeature extends Car {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true, length: 20})
    featureOne: string

    @Column({nullable: true, length: 20})
    featureTwo: string

    @Column({nullable: true, length: 20})
    featureThree: string

    @Column({nullable: true, length: 20})
    featureFour: string

    @Column({nullable: true, length: 20})
    featureFive: string

    @Column({nullable: true, length: 20})
    featureSix: string

    // one-to-one relationship with Car entity
    // @OneToOne( () => Car, (car) => car.extraFeature)
    // @JoinColumn()
    // carModel: Car
}