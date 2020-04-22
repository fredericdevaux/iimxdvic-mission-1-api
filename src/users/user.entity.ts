import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';
import {Project} from "../projects/project.entity";
import {Client} from "../clients/client.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;
  @Column()
  country: string;
  @Column()
  birthDate: string;
  @Column({
    unique: true
  })
  siret: string;


  @OneToMany(type => Project, project => project.creator)
  projects: Project[];

  @OneToMany(type => Client, client => client.creator)
  clients: Client[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
