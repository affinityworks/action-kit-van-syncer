import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User"

@Entity()
export class Phone {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  vanId: number

  @Column()
  akId: number

  @Column()
  number: string

  @Column()
  type: string

  @ManyToOne((type) => User, (user) => user.phones)
  user: User
}
