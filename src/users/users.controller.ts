import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Put, Req, UseGuards } from '@nestjs/common/decorators';
import { ApiExcludeEndpoint, ApiOperation, ApiProperty, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from 'src/db/entities/user.entity';
import JwtAuthenticationGuard from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateBgImageDto } from './dto/update-bgImage.dto';
import { UsersService } from './users.service';
import { FollowingDto } from './dto/following-user.dto';
import { UnFollowingDto } from './dto/unfollowing-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Create new User' })
  @ApiResponse({ status: 201, description: 'Return created User', type: User })
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Return all Users', type: [User] })
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get User by username' })
  @ApiResponse({ status: 200, description: 'Return User info', type: User })
  @ApiProperty({
    type: String,
  })
  @Get(':username')
  getByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update User`s avatar' })
  @ApiResponse({ status: 200, description: 'Return updated User', type: User })
  @Put('/avatar')
  updateAvatar(@Body() dto: UpdateAvatarDto, @Req() request: RequestWithUser): Promise<User> {
    const { user } = request;
    return this.usersService.updateUserAvatar(dto, user);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update User`s bgImage' })
  @ApiResponse({ status: 200, description: 'Return updated User', type: User })
  @Put('/bgImage')
  updateBgImage(@Body() dto: UpdateBgImageDto, @Req() request: RequestWithUser): Promise<User> {
    const { user } = request;
    return this.usersService.updateUserBgImage(dto, user);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Follow user' })
  @ApiResponse({ status: 201, description: 'Returns followings of User', type: [User] })
  @Post('/follow')
  follow(@Body() dto: FollowingDto, @Req() request: RequestWithUser): Promise<User[]> {
    const { user } = request;
    return this.usersService.followUser(dto, user);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Unfollow user' })
  @ApiResponse({ status: 201, description: 'Returns followings of User', type: [User] })
  @Post('/unfollow')
  unfollow(@Body() dto: UnFollowingDto, @Req() request: RequestWithUser): Promise<User[]> {
    const { user } = request;
    return this.usersService.unFollowUser(dto, user);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get followers' })
  @ApiResponse({ status: 201, description: 'Returns followers of User', type: [User] })
  @Get('follow/followers')
  getFollowers(@Req() request: RequestWithUser): Promise<User[]> {
    const { user } = request;
    return this.usersService.getFollowers(user);
  }

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get followings' })
  @ApiResponse({ status: 201, description: 'Returns followings of User', type: [User] })
  @Get('follow/followings')
  getFollowings(@Req() request: RequestWithUser): Promise<User[]> {
    const { user } = request;
    return this.usersService.getFollowings(user);
  }
}
