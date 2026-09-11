import { forwardRef, Module } from '@nestjs/common';
import { DosageFormsRepository } from './repositories/dosage-forms.repository';
import { DosageFormsService } from './services/dosage-forms.service';
import { DosageFormsConsoleController } from './controllers/dosage-forms.console.controller';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [forwardRef(() => ProductsModule)],

    controllers: [DosageFormsConsoleController],

    providers: [DosageFormsRepository, DosageFormsService],

    exports: [DosageFormsService],
})
export class DosageFormsModule {}
