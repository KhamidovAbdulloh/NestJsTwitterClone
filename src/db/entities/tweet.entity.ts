import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity()
export class Tweet extends BaseEntity {
  @ApiProperty({ example: '53281bac-2dcd-4f70-a1a9-9b3119a9bbaa'})
  @PrimaryGeneratedColumn('uuid')
  tweetId!: string;

  @ApiProperty({ example: 'First of many Tweets'})
  @Column()
  text!: string;

  @ApiProperty({
    example: '2024-08-23T05:24:12.235Z'})
  @CreateDateColumn({ type: 'timestamptz' })
  date!: Date;

  @ManyToOne(() => User, (user: User): Tweet[] | undefined => user.tweets)
  user!: User;

  @OneToMany(() => Like, (like: Like): Tweet => like.tweet)
  likes?: Like[];
}
