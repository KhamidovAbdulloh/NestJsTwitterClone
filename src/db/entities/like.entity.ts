import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';

@Entity()
export class Like extends BaseEntity {
  @ApiProperty({ example: '53281bac-2dcd-4f70-a1a9-9b3119a9bbaa'})
  @PrimaryGeneratedColumn('uuid')
  likeId!: string;

  @ManyToOne(() => Tweet, (tweet: Tweet): Like[] | undefined => tweet.likes)
  tweet!: Tweet;

  @ManyToOne(() => User, (user: User): Like[] | undefined => user.likes)
  user!: User;
}
