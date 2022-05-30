import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm'
import {OrderItem} from './orderItem.entity'

@Entity()
export class Order { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    readonly buyer: string

    @Column()
    readonly buyerContact: string

    @Column()
    readonly buyerEmail: string

    @Column()
    totalPrice: number

    @CreateDateColumn()
    date_issued: Date

    @OneToMany(() => OrderItem, (item) => item.order, {eager: true} )
    items: OrderItem[]
}