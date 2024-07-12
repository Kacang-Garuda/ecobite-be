import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator'
import { EncryptionUtil } from 'src/common/utils/encryption.util'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly encryption: EncryptionUtil,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const rawToken = this.extractTokenFromHeader(request)

    if (!rawToken) {
      throw new UnauthorizedException('token not provided')
    }

    try {
      const { token, expiredAt } = await this.prisma.token.findUniqueOrThrow({
        where: {
          token: rawToken,
        },
      })

      if (!token) {
        throw new UnauthorizedException(`Invalid Token`)
      }

      if (new Date(expiredAt) < new Date()) {
        throw new UnauthorizedException('Token expired')
      }

      const userEmail = this.encryption.decrypt(token)

      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      })

      request['user'] = user
    } catch (err) {
      throw new UnauthorizedException(err.message)
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
