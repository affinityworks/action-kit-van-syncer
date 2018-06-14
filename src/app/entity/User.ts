import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Phone} from "./Phone"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  vanId: number

  @Column()
  akId: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  age: number

  @Column()
  email: string

  @OneToMany((type) => Phone, (phone) => phone.user)
  phones: Phone[]
}
