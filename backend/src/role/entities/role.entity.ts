import { Exclude } from 'class-transformer';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
