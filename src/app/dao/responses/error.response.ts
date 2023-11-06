import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorResponse {
  @Expose()
  @ApiProperty({
    description: 'Error message',
    example: 'Error',
    nullable: false,
  })
  message: string;

  @Expose()
  @ApiProperty({
    description: 'Name of HTTP error with which requests was ended',
    example: 'Bad Request',
    nullable: false,
  })
  error: string;

  @Expose()
  @ApiProperty({
    description: 'HTTP code with which requests ended',
    example: 400,
    nullable: false,
  })
  statusCode: number;
}
