import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = unknown> {
  @ApiProperty({
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    example: 'Operation completed successfully.',
  })
  message!: string;

  @ApiProperty()
  data!: T | null;

  @ApiProperty({
    example: '2026-07-20T15:30:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/users',
  })
  path!: string;
}