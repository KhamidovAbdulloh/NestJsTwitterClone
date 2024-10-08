import { Body, Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiSecurity } from '@nestjs/swagger';

import { Like } from 'src/db/entities/like.entity';
import JwtAuthenticationGuard from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../types';
import { AddRemoveLikeDto } from './dto/add-remove-like.dto';
import { LikesService } from './likes.service';
import { GetLikeParams } from './params/get-like.params';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  tweetsService: any;
  constructor(private likesService: LikesService) {}

  @ApiSecurity('Authentication')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: "Add || Remove Like 'to/from' Tweet" })
  @ApiResponse({
    status: 201,
    description: 'Return updated array of Like of provided Tweet',
    type: [Like],
  })
  @Post()
  create(@Body() dto: AddRemoveLikeDto, @Req() request: RequestWithUser): Promise<Like[]> {
    const { user } = request;

    return this.likesService.addRemoveLike(dto, user);
  }

  @ApiOperation({ summary: 'Get all likes of Tweet' })
  @ApiResponse({ status: 200, description: 'Return array of likeIds and userIds', type: [Like] })
  @ApiProperty({
    type: String,
  })
  @Get(':tweetId')
  get(
    @Param()
    params: GetLikeParams,
  ): Promise<Like[]> {
    return this.likesService.getLikesAndUsersOnCertainTweet(params.tweetId);
  }
}
