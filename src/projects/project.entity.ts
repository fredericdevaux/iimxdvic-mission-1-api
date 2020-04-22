import {Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, BaseEntity, JoinTable} from 'typeorm';
import { User } from '../users/user.entity';
import {Client} from "../clients/client.entity";

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  deadline: string

  @Column({ default: () => "NOW()" })
  created_at: Date;

  @ManyToOne(type => User, user => user.projects)
  creator: User

  @ManyToOne(type => Client, client => client.projects)
  client: Client
}
