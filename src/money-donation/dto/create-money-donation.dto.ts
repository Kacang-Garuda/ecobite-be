import { IsNotEmpty, IsString } from 'class-validator'

export class CreateMoneyDonationDto {
  @IsNotEmpty()
  @IsString()
  payment: string

  @IsNotEmpty()
  @IsString()
  recipientEmail: string
}
