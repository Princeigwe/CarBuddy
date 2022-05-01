import {Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm'
import {Car} from './cars.entity'

@Entity()
export class ExtraFeature {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    featureOne: string

    @Column()
    featureTwo: string

    @Column()
    featureThree: string

    @Column()
    featureFour: string

    @OneToOne( () => Car, (car) => car.extraFeature, {cascade: true})
    @JoinColumn()
    carModel: Car
}