import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async updateUser(userId: string, user: User): Promise<User> {
    const verifyUser = await this.getUserById(userId);
    return await this.userModel.findByIdAndUpdate(verifyUser._id, user, {
      new: true,
    });
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.getUserById(userId);
    await this.userModel.findByIdAndDelete(user._id);
    return { message: `user with id :"${userId}" deleted successfully` };
  }
}
