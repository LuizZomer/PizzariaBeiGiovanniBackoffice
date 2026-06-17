import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from 'src/guards/authUser.guard';

@Controller('contact')
@UseGuards(AuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() contact: CreateContactDto) {
    return this.contactService.create(contact);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() contact: UpdateContactDto) {
    return this.contactService.update(id, contact);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
