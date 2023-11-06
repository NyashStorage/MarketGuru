import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationResponse {
  @Min(1)
  @IsInt()
  @IsOptional()
  @Expose()
  @ApiProperty({
    example: 1,
    default: 1,
    nullable: false,
  })
  page: number;

  @Min(1)
  @Max(100)
  @IsInt()
  @IsOptional()
  @Expose()
  @ApiProperty({
    description: 'Number of suitable items on one page',
    example: 20,
    default: 20,
    nullable: false,
  })
  perPage: number;

  @Expose()
  @ApiProperty({
    description: 'Number of suitable items in database',
    example: 20,
    nullable: false,
  })
  total: number;

  @Expose()
  @ApiProperty({
    example: 100,
    nullable: false,
  })
  totalPages: number;
}

export class ListResponse<T> {
  @Expose()
  @ApiProperty({
    nullable: false,
  })
  data: T[];

  @Expose()
  @Type(() => PaginationResponse)
  @ApiProperty({
    nullable: false,
  })
  pagination: PaginationResponse;
}
