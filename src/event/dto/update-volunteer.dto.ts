import { IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateVolunteerDto {
  @IsNotEmpty()
  @IsBoolean()
  isAccepted: boolean
}
