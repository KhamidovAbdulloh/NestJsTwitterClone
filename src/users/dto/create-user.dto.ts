import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Abu_Max2000'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly username: string;

  @ApiProperty({ example: 'UcantCa4me'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly password: string;

  @ApiProperty({ example: 'Abu'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName: string;

  @ApiProperty({ example: 'Max'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName: string;

  @ApiProperty({ example: 'Tashkent, Uzbekistan'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly location: string;
}
