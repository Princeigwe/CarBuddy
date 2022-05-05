import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, TableInheritance, JoinColumn, JoinTable} from 'typeorm'
import {UserProfile} from '../../profiles/profiles.entity'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {UseType} from '../../enums/useType.enum'
import {CarStyle} from '../../enums/carStyle.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'
import {ExtraFeature} from './extraFeature.entity'
import {User} from '../../users/user.entity'

@Entity()
// @TableInheritance({ column: { type: "varchar", name: "type" } })
export class Car {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'bytea', nullable: true})
    file: string

    @Column({type: 'enum', enum: CarStyle, default: CarStyle.SEDAN})
    style: CarStyle

    @Column()
    releaseYear: number

    @Column({type: 'varchar', length: 60})
    brand: string

    @Column({type: 'varchar', length: 60})
    model: string

    @Column({type: 'enum', enum: UseType, default: UseType.FAIRLY_USED})
    useType: UseType // data type will be an enum

    @Column({type: 'int'})
    estimatedPrice: number

    @Column({type: 'enum', enum: CarAvailability, default: CarAvailability.PRIVATE})
    availability:CarAvailability

    @Column({type: 'int'})
    mileage: number

    @Column({type: 'varchar', length: 50})
    location: string

    @Column({type: 'varchar', length: 10})
    exteriorColour: string

    @Column({type: 'varchar', length: 10})
    interiorColour: string

    @Column({type: 'int'})
    milesPerGallon: number

    @Column({type: 'varchar', length: 30})
    engine: string

    @Column({type: 'enum', enum: DriveType, default: DriveType.FWD})
    driveType: DriveType

    @Column({type: 'enum', enum: FuelType, default: FuelType.GASOLINE})
    fuelType: FuelType

    @Column({type: 'enum', enum: TransmissionType, default: TransmissionType.AUTOMATIC})
    transmissionType: TransmissionType

    //  one-to-one relationship to ExtraFeature entity
    // if there is an update in in the ExtraFeature entity, it will be updated automatically in the database when Car entity is saved
    @OneToOne(() => ExtraFeature, (extraFeature) => extraFeature.carModel, {eager: true, cascade: true})
    extraFeature: ExtraFeature

    //  many cars can be linked to a UserProfile, and the UserProfile can access the Car entities by 'cars' attribute
    @ManyToOne(() => User, (user) => user.cars, {eager: true, onDelete:"CASCADE"})
    dealer: User

}