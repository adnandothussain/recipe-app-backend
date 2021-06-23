export function transformID(schema: any) {
  // eslint-disable-next-line func-names
  schema.virtual('id').get(function () {
    return this._id.toHexString();
  });

  schema.set('toJSON', {
    virtuals: true,
    transform(_, obj) {
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
    },
  });

  return schema;
}
