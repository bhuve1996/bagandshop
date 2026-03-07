import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('content')
@Unique(['key', 'locale'])
export class ContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ default: 'default' })
  locale: string;

  @Column({ type: 'text' })
  value: string;
}
