import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDTO } from './dto/register.dto'
import { Public } from '../common/decorators/public.decorator'
import { LoginDTO } from './dto/login.dto'
import { GetUser } from 'src/common/decorators/getUser.decorator'
import { User } from '@prisma/client'
import { ResponseUtil } from 'src/common/utils/response.util'
import { EditProfileDTO } from './dto/editProfile.dto'
import { VerifyEmailDTO } from './dto/verifyEmail.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDTO) {
    const result = await this.authService.register(registerDto)

    return this.responseUtil.response({
      code: 201,
      message: 'Success created user!',
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const result = await this.authService.login(loginDTO)
    return this.responseUtil.response({
      code: 200,
      message: 'Login success!',
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getUser(@GetUser() user: User) {
    const result = await this.authService.getUser(user)
    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  async editProfile(
    @Body() editProfileDTO: EditProfileDTO,
    @GetUser() user: User
  ) {
    const result = await this.authService.editProfile(editProfileDTO, user)
    return this.responseUtil.response({
      code: 200,
      message: 'Success edit profile!',
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-email-verification')
  async sendEmailVerification(@GetUser() user: User) {
    await this.authService.sendEmailVerification(user)
    return this.responseUtil.response({
      code: 200,
      message: 'Success send email.',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async VerifyEmail(
    @Body() verifyEmailDTO: VerifyEmailDTO,
    @GetUser() user: User
  ) {
    await this.authService.VerifyEmail(verifyEmailDTO, user)
    return this.responseUtil.response({
      code: 200,
      message: 'Success verify email.',
    })
  }
}
