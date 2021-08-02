export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const transformJSON = {
  toJSON: {
    virtuals: true,
    transform: function (_: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
};

export const defaultModelOptions = {
  ...transformJSON,
  timestamps: true,
  versionKey: false,
};
