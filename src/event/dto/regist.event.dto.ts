import { IsNotEmpty, IsString } from 'class-validator'

export class RegistEventDto {
  @IsNotEmpty()
  @IsString()
  reason: string

  @IsNotEmpty()
  @IsString()
  eventId: string
}
