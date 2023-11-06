import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  @ApiProperty({
    description: 'Access token to protected API sections',
    example: 'JWT',
    nullable: false,
  })
  accessToken: string;
}

export class TokensResponse extends PickType(TokenResponse, ['accessToken']) {
  @Expose()
  @ApiProperty({
    description: 'Token for refreshing access token',
    example: 'JWT',
    nullable: false,
  })
  refreshToken: string;
}
