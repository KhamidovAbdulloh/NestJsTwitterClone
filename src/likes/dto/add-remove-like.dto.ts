import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddRemoveLikeDto {
  @ApiProperty({example: '53281bac-2dcd-4f70-a1a9-9b3119a9bbaa'})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly tweetId: string;
}
