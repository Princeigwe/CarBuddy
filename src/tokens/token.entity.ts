import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm'
@Entity()
export class Token { 

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    tokenString: string

    @CreateDateColumn()
    dateIssued: Date

}
