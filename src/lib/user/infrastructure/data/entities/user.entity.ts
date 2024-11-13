import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
@Index(['email'], {
  unique: true,
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  name: string;

  // city
  @Column('varchar')
  city: string;

  // latitude
  @Column('decimal')
  latitude: number;

  // longitude
  @Column('decimal')
  longitude: number;
}
