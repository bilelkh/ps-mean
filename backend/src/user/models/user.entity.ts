import { Exclude } from 'class-transformer';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  @Exclude()
  password: string;
}
