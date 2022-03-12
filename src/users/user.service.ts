import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAudit } from './interfaces/user-audit.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserAudit') private userAuditModel: Model<UserAudit>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find({ role: { $ne: 'admin' } });
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async createUser(user: User, creator: User): Promise<User> {
    const newUser = new this.userModel(user);

    if (newUser.salaire > 5000) {
      newUser.salaire = 5000;
    }
    if (newUser.salaire < 1000) {
      newUser.salaire = 1000;
    }

    const newAudit: UserAudit = {
      user: newUser.name,
      what: 'CREATE',
      who: creator.name,
      oldSalaire: 0,
      newSalaire: newUser.salaire,
    };
    const audit = new this.userAuditModel(newAudit);
    await audit.save();
    return await newUser.save();
  }

  async updateUser(userId: string, user: User, updater: User): Promise<User> {
    const verifyUser = await this.getUserById(userId);

    if (user.salaire > 5000) {
      user = { ...user, salaire: 5000 };
    }
    if (user.salaire < 1000) {
      user = { ...user, salaire: 1000 };
    }

    const newAudit: UserAudit = {
      user: verifyUser.name,
      what: 'UPDATE',
      who: updater.name,
      oldSalaire: verifyUser.salaire,
      newSalaire: user.salaire,
    };
    const audit = new this.userAuditModel(newAudit);
    await audit.save();
    return await this.userModel.findByIdAndUpdate(verifyUser._id, user, {
      new: true,
    });
  }

  async deleteUser(
    userId: string,
    deleter: User,
  ): Promise<{ message: string }> {
    const user = await this.getUserById(userId);
    await this.userModel.findByIdAndDelete(user._id);
    const newAudit: UserAudit = {
      user: user.name,
      what: 'DELETE',
      who: deleter.name,
      oldSalaire: user.salaire,
      newSalaire: 0,
    };
    const audit = new this.userAuditModel(newAudit);
    await audit.save();
    return { message: `user with id :"${userId}" deleted successfully` };
  }

  async getAllUsersAudit(): Promise<any> {
    const audits = await this.userAuditModel.find().populate('user', 'who');
    return audits;
  }
}
