import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { castToEntity } from 'src/utils/helpers/type.helpers';
import { UpdateUserRequest } from './dao/requests/update-user.request';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ErrorResponse } from '../app/dao/responses/error.response';
import { JwtPayloadDto } from '../tokens/dao/jwt-payload.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ListResponse } from '../app/dao/responses/list.response';
import { FindUsersRequest } from './dao/requests/find-users.request';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Gets information about current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Search error.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization error.',
    type: ErrorResponse,
  })
  async findMe(@CurrentUser() { userId }: JwtPayloadDto): Promise<User> {
    return castToEntity(this.usersService.findByID(userId), User);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets information about user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Search error.',
    type: ErrorResponse,
  })
  async find(@Param('id') id: string): Promise<User> {
    return castToEntity(this.usersService.findByID(+id), User);
  }

  @Get()
  @ApiOperation({ summary: 'Gets information about users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: ListResponse<User>,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error.',
    type: ErrorResponse,
  })
  async findAll(
    @Query() { page, perPage }: FindUsersRequest,
    @Query() query: Record<string, any>,
  ): Promise<ListResponse<User>> {
    delete query['page'];
    delete query['perPage'];

    const users = await this.usersService.findAll({ ...query }, page, perPage);
    return castToEntity(users, ListResponse<User>);
  }

  @Put()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Updates current user' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Search error.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error.',
    type: ErrorResponse,
  })
  async update(
    @Body() updateUserRequest: UpdateUserRequest,
    @CurrentUser() user: JwtPayloadDto,
  ): Promise<User> {
    return castToEntity(
      this.usersService.update(user.userId, updateUserRequest),
      User,
    );
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Deletes current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Search error.',
    type: ErrorResponse,
  })
  async delete(@CurrentUser() user: JwtPayloadDto): Promise<User> {
    return castToEntity(this.usersService.delete(user.userId), User);
  }
}
