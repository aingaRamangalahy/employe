import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { SignInPayload } from './interfaces/signin-payload.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/interfaces/user.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // async signUp(authCredentialsDto: AuthCredentialsDto): Promise<SignInPayload> {
  //   const user = await this.userModel.create(authCredentialsDto);
  //   await user.save({ validateBeforeSave: false });
  //   const tokenPayload: JwtPayload = {
  //     neme: user.name,
  //     role: user.role,
  //     _id: user._id,
  //   };
  //   const accessToken = await this.jwtService.sign(tokenPayload);
  //   return {
  //     _id: user._id,
  //     pseudo: user.pseudo,
  //     email: user.email,
  //     role: user.role,
  //     accessToken,
  //   };
  // }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SignInPayload> {
    const { name, password } = authCredentialsDto;
    const user = await this.userModel.findOne({ name }).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid login or password');
    }
    const tokenPayload: JwtPayload = { name, role: user.role, _id: user._id };
    const accessToken = await this.jwtService.sign(tokenPayload);

    return {
      _id: user._id,
      name: user.name,
      role: user.role,
      accessToken,
    };
  }

  // async forgotPassword(
  //   forgotPasswordDto: ForgotPasswordDto,
  // ): Promise<{ message: string }> {
  //   const { email, app } = forgotPasswordDto;
  //   const user = await this.userModel.findOne({ email, deleted: false });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   const resetToken = await this.generatePasswordResetToken(user);
  //   const resetUrl = this.generateResetPasswordUrl(resetToken, app);
  //   try {
  //     //TODO:send email
  //     //   console.log('reset url', resetUrl);
  //     //   await this.mailService.sendResetTokenUrlEmail(user.email, resetUrl);
  //     return { message: 'Reset password url sent to email' };
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Email not sent');
  //   }
  // }

  // async resetPassword(
  //   resetToken: string,
  //   newPassword: string,
  // ): Promise<{ message: string }> {
  //   const resetPasswordToken = crypto
  //     .createHash('sha256')
  //     .update(resetToken)
  //     .digest('hex');
  //   const user = await this.userModel.findOne({
  //     resetPasswordToken,
  //     resetPasswordExpire: { $gt: Date.now() },
  //     deleted: false,
  //   });
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   user.password = newPassword;
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   return { message: 'password reset successfully' };
  // }

  // async generatePasswordResetToken(
  //   user: Document<any, any, User> &
  //     User & {
  //       _id: string;
  //     },
  // ): Promise<string> {
  //   const resetToken = crypto.randomBytes(20).toString('hex');
  //   user.resetPasswordToken = crypto
  //     .createHash('sha256')
  //     .update(resetToken)
  //     .digest('hex');
  //   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10min
  //   await user.save({ validateBeforeSave: false });
  //   return resetToken;
  // }

  // generateResetPasswordUrl(resetToken: string, app: string) {
  //   let baseUrl;
  //   switch (app) {
  //     case 'bo':
  //       baseUrl = keys.BASE_BO_URL;
  //       break;
  //     case 'fo':
  //       baseUrl = keys.BASE_FO_URL;
  //       break;
  //     default:
  //       throw new BadRequestException('Unkown app');
  //   }
  //   const resetUrl = `${baseUrl}/auth/resetpassword/${resetToken}`;
  //   return resetUrl;
  // }
}
