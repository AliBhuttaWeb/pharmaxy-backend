import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';
import { DosageFormsService } from '../services/dosage-forms.service';
import { ConsoleController } from '@/common/decorators';

@ConsoleController('dosage-forms')
export class DosageFormsConsoleController {
    constructor(private readonly dosageFormService: DosageFormsService) {}

    @Get()
    findMany(@Query() query: DosageFormQueryDto) {
        return this.dosageFormService.findMany(query);
    }

    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.dosageFormService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateDosageFormDto) {
        return this.dosageFormService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateDosageFormDto) {
        return this.dosageFormService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.dosageFormService.delete(id);
    }
}
