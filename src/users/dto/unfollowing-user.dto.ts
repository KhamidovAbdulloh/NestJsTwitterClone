import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UnFollowingDto {
  @ApiProperty({ example: 'Put userId of who you want to unfollow' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly targetUserId: string;
}
