import {Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm'
import {Car} from './cars.entity'

@Entity()
export class ExtraFeature {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    featureOne: string

    @Column({nullable: true})
    featureTwo: string

    @Column({nullable: true})
    featureThree: string

    @Column({nullable: true})
    featureFour: string

    @OneToOne( () => Car, (car) => car.extraFeature, {onDelete: 'CASCADE'})
    @JoinColumn()
    carModel: Car
}