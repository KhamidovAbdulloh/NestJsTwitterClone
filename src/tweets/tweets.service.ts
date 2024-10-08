import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from 'src/db/entities/tweet.entity';
import { User } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { Like } from '../db/entities/like.entity';
import { SimpleMessageResponse } from '../types';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  async createTweet(dto: CreateTweetDto, user: User): Promise<Tweet> {
    const newTweet: Tweet = this.tweetRepository.create(dto);
    newTweet.user = user;

    return this.tweetRepository.save(newTweet);
  }

  async createInitialTweet(user: User): Promise<Tweet> {
    const newTweet: Tweet = this.tweetRepository.create({
      text: `Hi! My name is ${user.firstName}. This is my first Tweet`,
    });
    newTweet.user = user;

    return this.tweetRepository.save(newTweet);
  }

  async deleteTweetById(tweetId: string, user: User): SimpleMessageResponse {
    const foundedTweet: Tweet | null = await this.tweetRepository.findOne({
      where: { tweetId },
      relations: { user: true, likes: true },
    });

    if (!foundedTweet) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not found Tweet with this id',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundedTweet.user.userId !== user.userId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User can delete only owns Tweets',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (foundedTweet.likes?.length) {
      await this.likeRepository.delete(foundedTweet.likes.map(({ likeId }) => likeId));
    }

    await this.tweetRepository.delete({ tweetId });

    return { message: `Tweet <<${foundedTweet.text}>> was deleted successfully` };
  }

  async updateTweetById(tweetId: string, dto: UpdateTweetDto, user: User): Promise<Tweet> {
    const foundedTweet: Tweet | null = await this.tweetRepository.findOne({
      where: { tweetId },
      relations: { user: true },
    });

    if (!foundedTweet) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet with such id not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundedTweet.user.userId !== user.userId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User can update only owns tweets!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    foundedTweet.text = dto.text;

    return this.tweetRepository.save(foundedTweet);
  }

  async getTweetListById(userId: string): Promise<Tweet[]> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: { userId },
    });

    if (!foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not found User with this id',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const foundedTweets: Tweet[] = await this.tweetRepository.find({
      where: {user: {userId}},
      relations: {likes: {user: true}}
    });

    return foundedTweets;
  }
}
