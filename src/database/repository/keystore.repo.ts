import { Types } from 'mongoose';

import Keystore, { KeystoreModel } from '../model/keystore.model';
import User from '../model/user.model';

export default class KeystoreRepo {
  public static findforKey(client: User, key: string): Promise<Keystore | null> {
    return KeystoreModel.findOne({ client: client, primaryKey: key, status: true }).exec();
  }

  public static remove(id: Types.ObjectId): Promise<Keystore | null> {
    return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec();
  }

  public static find(
    client: string,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client: client as any,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    })
      .lean<Keystore>()
      .exec();
  }

  public static async create(
    client: string,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore> {
    const now = new Date();
    const keystore = await KeystoreModel.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    });
    return keystore.toObject() as Keystore;
  }
}
