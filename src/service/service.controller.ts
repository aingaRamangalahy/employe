import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateServiceDto } from './create-service.dto';
import { Service } from './service.schema';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
  constructor(private service: ServiceService) {}

  @Get()
  getAllServices(): Promise<Service[]> {
    return this.service.getAllServices();
  }

  @Get('/:id')
  // @Roles('admin')
  getServiceById(@Param('id') id: string): Promise<Service> {
    return this.service.getServiceById(id);
  }

  @Post()
  // @Roles('admin')
  createService(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.service.createService(createServiceDto);
  }

  @Put('/:id')
  // @Roles('admin')
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.service.updateService(id, updateServiceDto);
  }

  @Delete('/:id')
  // @Roles('admin')
  deleteService(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.deleteService(id);
  }
}
