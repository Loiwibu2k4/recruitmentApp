import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HelpersService } from './../helpers/helpers.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly helpersService: HelpersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (user) {
            if(await this.helpersService.decodePassword(password, user.password)){
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const payload = { 
            sub: 'token login', 
            iss: 'from server',
            name: user.name,
            _id: user._id,
            email: user.email,
            role: user.role
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, user._id.toString());
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED'))
        });
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            user: {
                role: user.role ,
                _id: user._id,
                email: user.email,
                name: user.name,
            }
        }
    }    
    createRefreshToken = (payload: object | Buffer): string => {
        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')) / 1000,
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });
        return refresh_token;
    }

    verifyLastestToken = async ( _id: string, refresh_token: string ): Promise<boolean> => {
        try {
            const user = await this.usersService.findById(_id);
            if(user.refreshToken == refresh_token) return true;
            else return false;
        } catch (error) {
            throw new HttpException('Find user happen error', 400);
        }
    }

    handleRefresh = async (refresh_token: string): Promise<boolean | object> => {
        const existUser = await this.usersService.findByRefreshToken(refresh_token);
        if(existUser) {
            const { _id, name, email, role } = existUser;
            return {
                _id,
                name,
                email,
                role
            };
        } else {
            return false;
        }
    };

    logout = async (user: IUser, res: Response) => {
        await this.usersService.updateUserToken('', user._id.toString());
        res.clearCookie('refresh_token');
        return "ok";
    }
}