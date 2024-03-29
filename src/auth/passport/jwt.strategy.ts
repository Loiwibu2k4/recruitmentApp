import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './../auth.service';
import { Cookies } from 'src/decorators/Cookies.decorator';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  jwt: string
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
      passReqToCallback: true
    });
  }
  
  async validate(req: Request, payload: IUser) {
    const { _id, name, email, role } = payload;
    const rawToken = req.headers['authorization'].split(' ')[1];
    const verify = await this.authService.verifyLastestToken( _id.toString(), rawToken);
    if(verify) return { _id, name, email, role };
    else throw new UnauthorizedException('Token invalid or expired');
  }
}