import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
  NotFoundException,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { User } from '../user/models/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response, Request } from 'express';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationGuard } from './authentication.guard';
import * as bcrypt from 'bcryptjs';
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<User> {
    const user = await this.userService.findOne({ email: body.email });

    if (user) throw new BadRequestException('user exsit !');

    if (body.password !== body.password_confirm)
      throw new BadRequestException('passwords do not match !');
    const hashed = await bcrypt.hash(body.password, 12);
    return this.userService.create({ ...body, password: hashed });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    const user = await this.userService.findOne(email);

    if (!user) throw new NotFoundException('user not found');
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid credentials!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthenticationGuard)
  @Get('me')
  async me(@Res() response: Response, @Req() request: Request) {
    const data = await this.jwtService.verifyAsync(request.cookies['jwt']);
    return this.userService.findOne({ id: data['id'] });
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'succes' };
  }
}
