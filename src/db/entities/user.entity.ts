import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Like } from './like.entity';
import { Tweet } from './tweet.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ example: '53281bac-2dcd-4f70-a1a9-9b3119a9bbaa'})
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @ApiProperty({ example: 'ZeroMax'})
  @Column({ unique: true })
  username!: string;

  @Column()
  @Exclude()
  password!: string;

  @ApiProperty({ example: 'Vito'})
  @Column()
  firstName!: string;

  @ApiProperty({ example: 'Carleone'})
  @Column()
  lastName!: string;

  @ApiProperty({ example: 'Rome, Italy'})
  @Column()
  location!: string;

  @ApiProperty({example: 'https://i.pinimg.com/originals/a0/fa/2b/a0fa2b00c30009684be5364c77d98331.jpg', nullable: true })
  @Column({ nullable: true })
  avatar!: string;

  @ApiProperty({example: 'https://appleinsider.ru/wp-content/uploads/2017/04/macbook-pro-test.jpg', nullable: true})
  @Column({ nullable: true })
  bgImage!: string;

  @ApiProperty({example: '2024-08-23T05:24:12.235Z'})
  @CreateDateColumn({ type: 'timestamptz' })
  joined!: Date;

  @OneToMany(() => Tweet, (tweet: Tweet): User => tweet.user)
  tweets?: Tweet[];

  @OneToMany(() => Like, (like: Like): User => like.user)
  likes?: Like[];

  @ManyToMany(() => User, (user: User): User[] => user.followings, { cascade: true })
  @JoinTable({
    name: 'followers',
    joinColumn: {
      name: 'userId',
    },
    inverseJoinColumn: {
      name: 'followerId',
    },
  })
  followers: User[];

  @ManyToMany(() => User, (user: User): User[] => user.followers)
  followings: User[];
}
