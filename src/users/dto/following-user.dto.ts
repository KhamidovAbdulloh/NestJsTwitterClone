import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FollowingDto {
  @ApiProperty({ example: "Put userId of who you want to follow"})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly targetUserId: string;
}
