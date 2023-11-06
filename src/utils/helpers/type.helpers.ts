import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Converts regular object to typed object by removing unnecessary fields.
 */
export async function castToEntity<T>(
  target: Promise<any> | any,
  Entity: ClassConstructor<T>,
): Promise<T> {
  return plainToInstance(Entity, await target, {
    excludeExtraneousValues: true,
    strategy: 'exposeAll',
  });
}
