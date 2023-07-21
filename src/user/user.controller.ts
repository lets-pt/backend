import {
  Body,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Req,
  Param,
} from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserRequestDto } from './dto/user.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from './user.schema';

@Controller('user')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: User) {
    return user.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  signUp(@Body() userRequestDTO: UserRequestDto) {
    return this.userService.signUp(userRequestDTO);
  }

  @ApiOperation({summary: '아이디 중복 확인'})
  @Post('doubleCheckId/:id')
  doubleCheckId(@Param('id') id: string) {
    return this.userService.isUserExistId(id);
  }

  @ApiOperation({summary: '닉네임 중복 확인'})
  @Post('doubleCheckName/:name')
  doubleCheckName(@Param('name') name: string) {
    return this.userService.isUserExistName(name);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'logout';
  }
}
