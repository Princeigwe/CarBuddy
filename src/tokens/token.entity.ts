import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Token { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    jsonWebToken: string
}
