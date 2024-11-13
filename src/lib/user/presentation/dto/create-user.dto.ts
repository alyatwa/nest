import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Max, Min, IsEmail } from 'class-validator';

export class CreateUsersDto {
  //email
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  //name
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Latitude', type: 'number', example: '30', required: true })
  @IsNumber({}, { message: 'Latitude should be a number' })
  @IsNotEmpty({ message: 'Latitude is required' })
  @Min(-90, { message: 'Latitude should be greater than or equal to -90' })
  @Max(90, { message: 'Latitude should be less than or equal to 90' })
  latitude: number;

  @ApiProperty({ description: 'Longitude', type: 'number', example: '31', required: true })
  @IsNumber({}, { message: 'Longitude should be a number' })
  @IsNotEmpty({ message: 'Longitude is required' })
  @Min(-180, { message: 'Longitude should be greater than or equal to -180' })
  @Max(180, { message: 'Longitude should be less than or equal to 180' })
  longitude: number;
}
