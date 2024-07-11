import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsNotEmpty()
  @IsString()
  notes: string
}
