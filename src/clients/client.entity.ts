import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne} from 'typeorm';
import {Project} from "../projects/project.entity";
import {User} from "../users/user.entity";

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true
  })
  image: string;

  @ManyToOne(type => User, user => user.clients)
  creator: User

  @OneToMany(type => Project, project => project.client)
  projects: Project[]
}
