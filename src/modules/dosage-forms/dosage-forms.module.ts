import { Module } from '@nestjs/common';
import { DosageFormsRepository } from './repositories/dosage-forms.repository';
import { DosageFormsService } from './services/dosage-forms.service';
import { DosageFormsConsoleController } from './controllers/dosage-forms.console.controller';

@Module({
    controllers: [DosageFormsConsoleController],

    providers: [DosageFormsRepository, DosageFormsService],

    exports: [],
})
export class DosageFormsModule {}
