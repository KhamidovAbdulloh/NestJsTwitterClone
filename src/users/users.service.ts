import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { User } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { TweetsService } from '../tweets/tweets.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateBgImageDto } from './dto/update-bgImage.dto';
import { FollowingDto } from './dto/following-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly tweetsService: TweetsService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });

    if (foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User with such username is already exist!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser: User = this.userRepository.create(dto);
    await this.userRepository.save(newUser);
    await this.tweetsService.createInitialTweet(newUser);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();

    return users;
  }

  async getUserByUsername(username: string): Promise<User> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with such username not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return foundedUser;
  }

  async getById(userId: string): Promise<User> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: { userId },
      relations: {
        tweets: true,
        likes: {
          tweet: true,
        },
      },
    });

    if (!foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return foundedUser;
  }

  async updateUserAvatar(dto: UpdateAvatarDto, user: User): Promise<User> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
    });

    if (!foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    foundedUser.avatar = dto.avatar;

    return this.userRepository.save(foundedUser);
  }

  async updateUserBgImage(dto: UpdateBgImageDto, user: User): Promise<User> {
    const foundedUser: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
    });

    if (!foundedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    foundedUser.bgImage = dto.bgImage;

    return this.userRepository.save(foundedUser);
  }

  async followUser(dto: FollowingDto, user: User) {
    const currentUser: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
      relations: {
        followings: true,
      },
    });

    if (!currentUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const followingUser: User | null = await this.userRepository.findOne({
      where: {
        userId: dto.targetUserId,
      },
    });

    if (!followingUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    currentUser.followings.push(followingUser);
    await this.userRepository.save(currentUser);

    return this.userRepository
      .findOne({
        where: {
          userId: user.userId,
        },
        relations: {
          followings: true,
        },
      })
      .then((currentUser) => {
        if (!currentUser) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'User with this id does not exist',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        return currentUser.followings;
      });
  }

  async unFollowUser(dto: FollowingDto, user: User) {
    const owner: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
      relations: {
        followings: true,
      },
    });

    if (!owner) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const unFollowingUser: User | null = await this.userRepository.findOne({
      where: {
        userId: dto.targetUserId,
      },
    });

    if (!unFollowingUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    owner.followings = owner.followings.filter((user) => user.userId !== unFollowingUser.userId);

    await this.userRepository.save(owner);

    return this.userRepository
      .findOne({
        where: {
          userId: user.userId,
        },
        relations: {
          followings: true,
        },
      })
      .then((currentUser) => {
        if (!currentUser) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'User with this id does not exist',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        return currentUser.followings;
      });
  }

  async getFollowers(user: User): Promise<User[]> {
    const owner: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
      relations: {
        followers: true,
      },
    });

    if (!owner) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return owner.followers;
  }

  async getFollowings(user: User): Promise<User[]> {
    const owner: User | null = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
      relations: {
        followings: true,
      },
    });

    if (!owner) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return owner.followings;
  }
}
