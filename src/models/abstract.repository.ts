import {
  Model,
  HydratedDocument,
  QueryFilter,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export class AbstractRepository<T> {
  constructor(private readonly model: Model<T>) {}

  public async create(item: Partial<T>): Promise<HydratedDocument<T>> {
    const doc = new this.model(item);
    return (await doc.save()) as HydratedDocument<T>; // cast the actual save() result
  }

  public async getOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter, projection, options);
  }

  public async updateOne(
    filter: QueryFilter<T>,
    updateQuery?: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filter, updateQuery, options);
  }

  public async findOneAndUpdate(
    filter: QueryFilter<T>,
    updateQuery: UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filter, updateQuery, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  public async getAll(
    filter: QueryFilter<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter, projection, options);
  }

  public async count(filter: QueryFilter<T> = {}): Promise<number> {
  return this.model.countDocuments(filter);
}

public findOneQuery(filter: QueryFilter<T>) {
  return this.model.findOne(filter);
}
}