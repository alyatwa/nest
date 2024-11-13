import { Controller, Post, Body, Get, Param, HttpStatus, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { GetUserUseCase } from '../../domain/usecases/get-user.usecase';
import { CreateUserUseCase } from '../../domain/usecases/create-user.usecase';
import { CreateUsersDto } from '../dto/create-user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Get('/:userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'userId', required: true, type: 'string' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    try {
      const user = await this.getUserUseCase.execute(userId);
      return {
        data: user,
        message: 'User fetched successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while fetching the user',
        error: error.message,
      };
    }
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Create user' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUsersDto) {
    try {
      const user = await this.createUserUseCase.execute(body);
      return {
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while creating the user',
        error: error.message,
      };
    }
  }
}
