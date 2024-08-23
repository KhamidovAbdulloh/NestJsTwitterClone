import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateBgImageDto {
  @ApiProperty({example: 'https://appleinsider.ru/wp-content/uploads/2017/04/macbook-pro-test.jpg'})
  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true }, { message: 'Not valid URL address' })
  readonly bgImage: string;
}
