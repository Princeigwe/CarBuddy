import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne} from 'typeorm'
import {UserProfile} from '../../profiles/profiles.entity'
import {ExtraFeature} from './extraFeature.entity'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {DriverType} from '../../enums/driveType.enum'
import {UseType} from '../../enums/useType.enum'
import {CarStyle} from '../../enums/carStyle.enum'

@Entity()
export class Car {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'enum', enum: CarStyle, default: CarStyle.SEDAN})
    style: CarStyle

    @Column({type: 'bytea'})
    image: Buffer

    // @Column({type: 'bytea'})
    // image: string

    @Column({type: 'int', length: 4})
    releaseYear: number

    @Column({type: 'varchar', length: 60})
    brand: string

    @Column({type: 'varchar', length: 60})
    model: string

    @Column({type: 'enum', enum: UseType, default: UseType.FAIRLY_USED})
    useType: UseType // data type will be an enum

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0.0})
    estimatedPrice: number

    @Column()
    isAvailable:boolean

    @Column({type: 'int', length: 6})
    mileage: number

    @Column({type: 'varchar', length: 50})
    location: string

    @Column({type: 'varchar', length: 10})
    exteriorColour: string

    @Column({type: 'varchar', length: 10})
    interiorColour: string

    @Column({type: 'int', length: 6})
    milesPerGallon: number

    @Column({type: 'varchar', length: 30})
    engine: string

    @Column({type: 'enum', enum: DriverType, default: DriverType.FWD})
    driveType: string

    @Column({type: 'enum', enum: FuelType, default: FuelType.GASOLINE})
    fuelType: string

    @Column({type: 'enum', enum: TransmissionType, default: TransmissionType.AUTOMATIC})
    transmissionType: TransmissionType

    /**
     * many cars can be linked to a UserProfile, and the UserProfile can access the Car entities by 'cars' attribute
     */
    @ManyToOne(()=>UserProfile, (userProfile) => userProfile.cars)
    dealer: UserProfile

    // one-to-one relationship to ExtraFeature entity
    @OneToOne(() => ExtraFeature, (extraFeature) => extraFeature.carModel)
    extraFeature: ExtraFeature

}