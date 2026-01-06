import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/ common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    // The user object comes from the JWT payload
    return this.usersService.findOneById(user.userId);
  }
}
