import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';
import { DosageFormsService } from '../services/dosage-forms.service';
import { ConsoleController, Permissions } from '@/common/decorators';
import { DOSAGE_FORMS_PERMISSIONS } from '@/common/constants';

@ConsoleController('dosage-forms')
export class DosageFormsConsoleController {
    constructor(private readonly dosageFormService: DosageFormsService) {}

    @Get()
    @Permissions(DOSAGE_FORMS_PERMISSIONS.DOSAGE_FORM_VIEW_LIST.name)
    findMany(@Query() query: DosageFormQueryDto) {
        return this.dosageFormService.findMany(query);
    }

    @Get(':id')
    @Permissions(DOSAGE_FORMS_PERMISSIONS.DOSAGE_FORM_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.dosageFormService.findById(id);
    }

    @Post()
    @Permissions(DOSAGE_FORMS_PERMISSIONS.DOSAGE_FORM_CREATE.name)
    create(@Body() dto: CreateDosageFormDto) {
        return this.dosageFormService.create(dto);
    }

    @Patch(':id')
    @Permissions(DOSAGE_FORMS_PERMISSIONS.DOSAGE_FORM_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateDosageFormDto) {
        return this.dosageFormService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(DOSAGE_FORMS_PERMISSIONS.DOSAGE_FORM_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.dosageFormService.delete(id);
    }
}
