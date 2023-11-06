import { PickType } from '@nestjs/swagger';
import { PaginationResponse } from '../../../app/dao/responses/list.response';
import { Transform } from 'class-transformer';

export class FindUsersRequest extends PickType(PaginationResponse, [
  'page',
  'perPage',
]) {
  @Transform(({ value }) => parseInt(value))
  page: number;

  @Transform(({ value }) => parseInt(value))
  perPage: number;
}
