import { Injectable } from '@nestjs/common'
import Cryptr = require('cryptr')

@Injectable()
export class EncryptionUtil {
  private cryptr: Cryptr

  constructor() {
    const secretKey = process.env.SECRET_KEY as string
    const saltLength = parseInt(process.env.SALT_LENGTH as string)

    this.cryptr = new Cryptr(secretKey, {
      encoding: 'base64',
      pbkdf2Iterations: 10000,
      saltLength: saltLength,
    })
  }

  encrypt(data: string): string {
    return this.cryptr.encrypt(data)
  }

  decrypt(encryptedString: string): string {
    return this.cryptr.decrypt(encryptedString)
  }
}
