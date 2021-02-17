import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { UpdateUserDto } from './models/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async all(@Query('page') page = 1): Promise<User[]> {
    return await this.userService.paginate(page);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne({ id: id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return await this.userService.update(+id, userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(+id);
  }
}
