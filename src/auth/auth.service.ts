import { BadRequestException, Injectable } from '@nestjs/common'
import { RegisterDTO } from './dto/register.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { compare, hash } from 'bcrypt'
import { EncryptionUtil } from 'src/common/utils/encryption.util'
import { LoginDTO } from './dto/login.dto'
import { User } from '@prisma/client'
import { EditProfileDTO } from './dto/editProfile.dto'
import { MailerService } from 'src/mailer/mailer.service'
import { VerifyEmailDTO } from './dto/verifyEmail.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly mailerService: MailerService
  ) {}

  private TIME_UNIT = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  async register(registerDTO: RegisterDTO) {
    const { email, password, ...registerData } = registerDTO

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException('Email already used.')
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.SALT_LENGTH)
    )

    const encryptedEmail = this.encryptionUtil.encrypt(email)
    const tokenIssuedTime = Date.now()

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        ...registerData,
        token: {
          create: {
            token: encryptedEmail,
            type: 'AUTHENTICATION',
            expiredAt: new Date(
              tokenIssuedTime +
                this._getExpiry(process.env.TOKEN_EXPIRED ?? '30m')
            ),
          },
        },
      },
      include: {
        foodDonations: true,
        donateFood: true,
        receiveFood: true,
        donateMoney: true,
        receiveMoney: true,
        events: true,
        registeredEvents: true,
      },
    })

    const token = await this.prismaService.token.findFirst({
      where: {
        userEmail: user.email,
        isExpired: false,
        type: 'AUTHENTICATION',
      },
    })

    const {
      password: _dontPassPassword,
      createdAt: _hideCreatedAt,
      updatedAt: _hideUpdatedAt,
      ...userWithoutPassword
    } = user

    return { user: userWithoutPassword, token: token.token }
  }

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO

    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        foodDonations: true,
        donateFood: true,
        receiveFood: true,
        donateMoney: true,
        receiveMoney: true,
        events: true,
        registeredEvents: true,
      },
    })

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    if (!(await compare(password, user.password as string))) {
      throw new BadRequestException('Invalid credentials')
    }

    await this.prismaService.token.updateMany({
      where: {
        userEmail: user.email,
        isExpired: false,
        type: 'AUTHENTICATION',
      },
      data: { isExpired: true },
    })

    const encryptedEmail = this.encryptionUtil.encrypt(user.email)
    const tokenIssuedTime = Date.now()
    const token = await this.prismaService.token.create({
      data: {
        userEmail: user.email,
        token: encryptedEmail,
        type: 'AUTHENTICATION',
        expiredAt: new Date(
          tokenIssuedTime + this._getExpiry(process.env.TOKEN_EXPIRED ?? '30m')
        ),
      },
    })

    const {
      password: _hidePassword,
      createdAt: _hideCreatedAt,
      updatedAt: _hideUpdatedAt,
      ...userWithoutPassword
    } = user

    return { user: userWithoutPassword, token: token.token }
  }

  async getUser(user: User) {
    const getUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
      include: {
        foodDonations: true,
        donateFood: true,
        receiveFood: true,
        donateMoney: true,
        receiveMoney: true,
        events: true,
        registeredEvents: true,
      },
    })

    const { password: _hidePassword, ...restUser } = getUser

    return restUser
  }

  async editProfile(editProfileDTO: EditProfileDTO, user: User) {
    const updatedUser = await this.prismaService.user.update({
      where: { email: user.email },
      data: { ...editProfileDTO },
      include: {
        foodDonations: true,
        donateFood: true,
        receiveFood: true,
        donateMoney: true,
        receiveMoney: true,
        events: true,
        registeredEvents: true,
      },
    })

    const { password: _hidePassword, ...restUser } = updatedUser
    return restUser
  }

  async sendEmailVerification(user: User) {
    const getUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    })

    if (getUser.isEmailVerified) {
      throw new BadRequestException('Email Anda sudah terverifikasi!')
    }

    const encryptedEmail = this.encryptionUtil.encrypt(user.email)
    const tokenIssuedTime = Date.now()
    const token = await this.prismaService.token.create({
      data: {
        userEmail: user.email,
        token: encryptedEmail,
        type: 'VERIFY_EMAIL',
        expiredAt: new Date(
          tokenIssuedTime +
            this._getExpiry(process.env.VERIFY_EMAIL_TOKEN_EXPIRED ?? '30m')
        ),
      },
    })

    await this.mailerService.sendMail({
      email: getUser.email,
      subject: '[NO-REPLY] Verify Your Email!',
      html: `
      <p>Verify your account here!</p>
      <strong>
        <a href="${process.env.CLIENT_URL}/confirmation?token=${token.token}">Click Here</a>
      </strong>
      `,
    })
  }

  async VerifyEmail(verifyEmailDTO: VerifyEmailDTO, user: User) {
    const token = await this.prismaService.token.findUnique({
      where: { token: verifyEmailDTO.token },
    })

    if (!token) {
      throw new BadRequestException('Verifikasi gagal. Silahkan coba lagi!')
    }

    if (token.isExpired || new Date() > token.expiredAt) {
      await this.prismaService.token.update({
        where: { token: token.token },
        data: { isExpired: true },
      })

      throw new BadRequestException('Verifikasi gagal. Silahkan coba lagi!')
    }

    const loginUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    })

    const decryptedEmailFromToken = this.encryptionUtil.decrypt(token.token)

    if (loginUser.email !== decryptedEmailFromToken) {
      throw new BadRequestException('Verifikasi gagal. Silahkan coba lagi!')
    }

    await this.prismaService.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { email: loginUser.email },
        data: { isEmailVerified: true },
      })

      await prisma.token.updateMany({
        where: { userEmail: loginUser.email, type: 'VERIFY_EMAIL' },
        data: { isExpired: true },
      })
    })
  }

  private _getExpiry(data: string): number {
    const duration = parseInt(data.substring(0, data.length - 1))
    const unit = data[data.length - 1]
    return duration * this.TIME_UNIT[unit]
  }
}
