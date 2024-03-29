import { Body, Controller, Get, Post, Render, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { User } from 'src/decorators/user.decorator';
import { IUser } from './../users/users.interface';
import { Cookies } from 'src/decorators/Cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ){}

  @ResponseMessage('user login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) response: Response
  ){
    return this.authService.login(req.user._doc, response);
  }

  @ResponseMessage('register a new user')
  @Public()
  @Post('/register')
  async register(
    @Body()
    registerUserDTO: RegisterUserDTO
  ) {
    return await this.usersService.register(registerUserDTO);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  async account(
    @User() user: IUser
  ) {
    return { user }
  }

  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  async handleRefresh(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const isExist = await this.authService.handleRefresh(refreshToken);
    if(isExist) {
      return await this.authService.login(isExist as any, response);
    } else throw new UnauthorizedException('Pls Login again');
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @User() user: IUser,
  ) {
    return await this.authService.logout(user, res);
  }
}