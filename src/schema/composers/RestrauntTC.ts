import { composeMongoose } from 'graphql-compose-mongoose';
import { ResolverResolveParams } from 'graphql-compose';
import { RestrauntModel } from '../../database/model/restraunt.model';

export const RestrauntTC = composeMongoose(RestrauntModel);

export const searchRestraunts = RestrauntTC.mongooseResolvers
  .connection({ name: 'searchRestraunts' })
  .wrap((rp) => {
    rp.addArgs({
      queryString: {
        type: 'String',
        defaultValue: null,
        description: 'query string',
      },
    });
    return rp;
  })
  .wrapResolve(
    (next) =>
      (rp: ResolverResolveParams<unknown, any, { queryString: string | null; filter: any }>) => {
        const filters: any = {
          OR: [],
        };
        if (rp.args.queryString != null) {
          const { queryString } = rp.args;
          filters.OR = [
            {
              _operators: {
                name: { regex: new RegExp(queryString, 'i') },
              },
            },
            {
              _operators: { tags: { in: new RegExp(queryString, 'i') } },
            },
            {
              _operators: {
                street: { regex: new RegExp(queryString, 'i') },
              },
            },
          ];
        }
        if (!filters.OR.length) delete filters.OR;
        rp.args.filter = filters;
        return next(rp);
      },
  );
