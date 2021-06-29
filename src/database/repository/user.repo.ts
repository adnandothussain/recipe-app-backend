import { Types } from 'mongoose';

import User, { UserModel } from '../model/user.model';
// import Role, { RoleModel } from '../model/Role';
// import { InternalError } from '../../core/ApiError';
import KeystoreRepo from './keystore.repo';
import Keystore from '../model/keystore.model';

export default class UserRepo {
  // contains critical information of the user
  public static async findById(id: Types.ObjectId) {
    return (
      (
        await UserModel.findOne({ _id: id, status: true })
          .select('+email +password')
          // .populate({
          //   path: 'roles',
          //   match: { status: true },
          // })
          // .lean()
          .exec()
      )?.toJSON()
    );
  }

  public static findByEmail(email: string): Promise<User | null> {
    return (
      UserModel.findOne({ email: email, status: true })
        .select('+email +password')
        // .populate({
        //   path: 'roles',
        //   match: { status: true },
        //   select: { code: 1 },
        // })
        .lean<User>()
        .exec()
    );
  }

  public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    // roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    // Roles not needed right now
    // const role = await RoleModel.findOne({ code: roleCode })
    //   .select('+email +password')
    //   .lean<Role>()
    //   .exec();
    // if (!role) throw new InternalError('Role must be defined');

    // user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser, accessTokenKey, refreshTokenKey);
    return { user: createdUser.toJSON(), keystore: keystore };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user.id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  public static async updateInfo(user: User) {
    user.updatedAt = new Date();
    return (
      await UserModel.findByIdAndUpdate(user.id, { $set: { ...user } }, { new: true }).exec()
    )?.toJSON();
  }
}
