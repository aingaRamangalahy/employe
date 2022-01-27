import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';

@Injectable()
export class ServiceService {
  constructor(@InjectModel('Service') private ServiceModel: Model<Service>) {}

  async getAllServices(): Promise<Service[]> {
    return this.ServiceModel.find();
  }

  async getServiceById(ServiceId: string): Promise<Service> {
    const Service = await this.ServiceModel.findOne({ _id: ServiceId });
    if (!Service) {
      throw new NotFoundException();
    }
    return Service;
  }

  async createService(Service: Service): Promise<Service> {
    const newService = new this.ServiceModel(Service);
    return await newService.save();
  }

  async updateService(ServiceId: string, Service: Service): Promise<Service> {
    const verifyService = await this.getServiceById(ServiceId);
    return await this.ServiceModel.findByIdAndUpdate(
      verifyService._id,
      Service,
      {
        new: true,
      },
    );
  }

  async deleteService(ServiceId: string): Promise<{ message: string }> {
    const Service = await this.getServiceById(ServiceId);
    await this.ServiceModel.findByIdAndDelete(Service._id);
    return { message: `Service with id :"${ServiceId}" deleted successfully` };
  }
}
