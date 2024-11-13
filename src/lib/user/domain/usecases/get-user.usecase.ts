import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/data/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserUseCase {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  /**
   * Executes the use case to retrieve a user by their ID.
   *
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} The user entity if found.
   * @throws {Error} If the user is not found or if there is an error during retrieval.
   */
  async execute(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'name', 'email', 'city'],
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}
