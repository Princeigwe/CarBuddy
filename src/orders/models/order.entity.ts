import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm'
import {OrderItem} from './orderItem.entity'

@Entity()
export class Order { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    readonly buyer: string

    @Column()
    readonly buyer_contact: string

    @Column()
    readonly buyer_email: string

    @CreateDateColumn()
    date_issued: Date

    @OneToMany(() => OrderItem, (item) => item.order, {eager: true} )
    items: OrderItem[]
}