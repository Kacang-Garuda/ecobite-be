import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import { UpdateEventDto } from './dto/update-event.dto'
import { RegistEventDto } from './dto/regist.event.dto'
import { UpdateVolunteerDto } from './dto/update-volunteer.dto'

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto, user: User) {
    if (!user.isInstitution) {
      throw new BadRequestException(
        'Selain institusi tidak dapat membuat event!'
      )
    }

    return await this.prismaService.event.create({
      data: { userEmail: user.email, ...createEventDto },
    })
  }

  async getAllEvents() {
    return await this.prismaService.event.findMany()
  }

  async getEvent(id: string) {
    return await this.prismaService.event.findUnique({
      where: { id },
      include: { registeredUsers: true },
    })
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    return await this.prismaService.event.update({
      where: { id },
      data: { ...updateEventDto },
    })
  }

  async deleteEvent(id: string) {
    return await this.prismaService.event.delete({ where: { id } })
  }

  async registEvent(registEventDto: RegistEventDto, user: User) {
    const registeredEvent = await this.prismaService.registeredEvent.findFirst({
      where: { userEmail: user.email, eventId: registEventDto.eventId },
    })

    if (registeredEvent) {
      throw new BadRequestException('Anda sudah mendaftar acara ini.')
    }

    const event = await this.prismaService.event.findUnique({
      where: { id: registEventDto.eventId },
    })

    if (event.userEmail === user.email) {
      throw new BadRequestException('Tidak bisa mendaftar ke acara sendiri.')
    }

    return await this.prismaService.registeredEvent.create({
      data: { userEmail: user.email, ...registEventDto },
    })
  }

  async getAllVolunteers(id: string) {
    return this.prismaService.registeredEvent.findMany({
      where: { eventId: id },
      include: { user: true },
    })
  }

  async updateStatusVolunteer(
    id: string,
    updateVolunteerDto: UpdateVolunteerDto
  ) {
    await this.prismaService.registeredEvent.update({
      where: { id },
      data: { status: updateVolunteerDto.isAccepted ? 'ACCEPTED' : 'REJECTED' },
    })
  }

  async getAllMyVolunteers(user: User) {
    console.log('AHELAH')

    return await this.prismaService.registeredEvent.findMany({
      where: { userEmail: user.email },
      include: { event: true },
    })
  }
}
