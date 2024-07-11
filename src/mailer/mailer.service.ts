import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

interface MailerOptions {
  email: string
  subject: string
  html: string
}

@Injectable()
export class MailerService {
  private mailer!: Resend

  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY!)
  }

  async sendMail(option: MailerOptions) {
    await this.mailer.emails.send({
      from: 'EcoBite <no-reply@ecobite.biz.id>',
      to: option.email,
      ...option,
    })
  }
}
