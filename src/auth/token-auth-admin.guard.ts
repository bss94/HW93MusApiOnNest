import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TokenAuthAdminGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headerValue = request.get('Authorization');
    if (!headerValue) {
      return false;
    }
    const [, token] = headerValue.split(' ');
    if (!token) {
      return false;
    }
    const user = await this.userModel.findOne({ token });
    if (!user) {
      return false;
    }
    return user.role === 'admin';
  }
}
