import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { Gender } from './enum.model';
import { transformID } from './helpers.model';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
      default: '',
    },
    lastName: {
      type: String,
      required: false,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    username: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: false,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function callback(next) {
  try {
    this.name = `${this.firstName} ${this.lastName}`;
    if (this.isModified('password') || this.isNew) {
      // This if statement is necessary as some user might register using Facebook
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        return next();
      }
      return next();
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * compare the stored hashed value of the password with the given value of the password
 * @param pw - password whose value has to be compare
 * @param cb - callback function
 * @Note We should not use arrow functions because we lose access to `this`
 */
UserSchema.methods.comparePassword = async function comparePassword(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    // todo handle error
  }
};

export default model('User', transformID(UserSchema));
