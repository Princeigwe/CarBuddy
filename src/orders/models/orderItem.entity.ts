import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'
import {Order} from './order.entity'


@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne( ()=> Order, (order) => order.items, {onDelete: "CASCADE"} )
    order: Order

    @Column()
    readonly vehicleType: string

    @Column()
    readonly releaseYear: number

    @Column()
    readonly brand: string

    @Column()
    readonly model: string

    @Column()
    readonly quantity: number

    @Column()
    readonly useType: string

    @Column()
    readonly estimatedPrice: number

    @Column()
    readonly mileage: number

    @Column()
    readonly location: string

    @Column()
    readonly exteriorColour: string

    @Column()
    readonly interiorColour: string

    @Column()
    readonly milesPerGallon: number

    @Column()
    readonly engine: string

    @Column()
    readonly driveType: string

    @Column()
    readonly fuelType: string

    @Column()
    readonly transmissionType: string

    @Column()
    readonly dealer: string

    @Column()
    readonly dealer_contact: string

    @Column()
    readonly dealer_email: string
}