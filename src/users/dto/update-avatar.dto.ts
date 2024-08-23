import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateAvatarDto {
  @ApiProperty({example: 'https://i.pinimg.com/originals/a0/fa/2b/a0fa2b00c30009684be5364c77d98331.jpg'})
  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true }, { message: 'Not valid URL address' })
  readonly avatar: string;
}
