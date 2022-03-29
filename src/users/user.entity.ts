import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity() // marking User as a database table
export class User {
    // defining user properties 
    @PrimaryGeneratedColumn() // marking id as primary key column 
    id: number;

    @Column() // marking email column
    email: string;

    @Column() // marking password column
    password: string;
}