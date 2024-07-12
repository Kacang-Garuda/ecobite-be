import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { EventService } from './event.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetUser } from 'src/common/decorators/getUser.decorator'
import { User } from '@prisma/client'
import { RegistEventDto } from './dto/regist.event.dto'
import { UpdateVolunteerDto } from './dto/update-volunteer.dto'

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User
  ) {
    await this.eventService.createEvent(createEventDto, user)

    return this.responseUtil.response({
      code: 201,
      message: 'Success create event!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllEvents() {
    const result = await this.eventService.getAllEvents()

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('volunteer')
  async getAllMyVolunteers(@GetUser() user: User) {
    const result = await this.eventService.getAllMyVolunteers(user)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getEvent(@Param('id') id: string) {
    const result = await this.eventService.getEvent(id)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    await this.eventService.updateEvent(id, updateEventDto)

    return this.responseUtil.response({
      code: 200,
      message: 'Success update event!',
    })
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    await this.eventService.deleteEvent(id)

    return this.responseUtil.response({
      code: 200,
      message: 'Success delete event!',
    })
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('regist')
  async registEvent(
    @Body() registEventDto: RegistEventDto,
    @GetUser() user: User
  ) {
    await this.eventService.registEvent(registEventDto, user)

    return this.responseUtil.response({
      code: 201,
      message: 'Success apply event!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('volunteer/:id')
  async getAllVolunteers(@Param('id') id: string) {
    const result = await this.eventService.getAllVolunteers(id)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('volunteer/:id')
  async updateStatusVolunteer(
    @Param('id') id: string,
    @Body() updateVolunteerDto: UpdateVolunteerDto
  ) {
    await this.eventService.updateStatusVolunteer(id, updateVolunteerDto)

    return this.responseUtil.response({
      code: 200,
      message: `Success ${updateVolunteerDto.isAccepted ? 'accept' : 'reject'} volunteer`,
    })
  }
}
