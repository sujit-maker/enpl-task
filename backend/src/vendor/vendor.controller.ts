import { Controller, Get, Post, Body, Param, Delete, Patch, Put, ParseIntPipe } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // Create a new vendor
  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  // Get all vendors
  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  @Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.vendorService.findOne(id);
}

@Put(':id')
async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVendorDto) {
  return this.vendorService.update(id, dto);
}

@Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number) {
  return this.vendorService.remove(id);
}

}
