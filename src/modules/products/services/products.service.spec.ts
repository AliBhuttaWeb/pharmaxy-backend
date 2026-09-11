import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MESSAGES } from '../constants';

describe('ProductsService', () => {
    let service: ProductsService;
    let mockProductsRepo: any;
    let mockManufacturersService: any;
    let mockProductTypesService: any;
    let mockRetailCategoriesService: any;
    let mockDosageFormsService: any;

    beforeEach(() => {
        mockProductsRepo = {
            findById: jest.fn(),
            findMany: jest.fn(),
            findByBarcode: jest.fn(),
            findByNameAndGenericName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            existsByDosageForm: jest.fn(),
            existsByProductType: jest.fn(),
            existsByRetailCategory: jest.fn(),
            existsByManufacturer: jest.fn(),
        };

        mockManufacturersService = {
            get: jest.fn(),
        };

        mockProductTypesService = {
            findById: jest.fn(),
        };

        mockRetailCategoriesService = {
            findById: jest.fn(),
        };

        mockDosageFormsService = {
            findById: jest.fn(),
        };

        service = new ProductsService(
            mockProductsRepo,
            mockManufacturersService,
            mockProductTypesService,
            mockRetailCategoriesService,
            mockDosageFormsService,
        );
    });

    describe('delete', () => {
        it('should throw NotFoundException if product does not exist', async () => {
            mockProductsRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when product exists', async () => {
            mockProductsRepo.findById.mockResolvedValue({ id: 'prod-1', name: 'Panadol' });
            mockProductsRepo.delete.mockResolvedValue({ id: 'prod-1', deleted_at: new Date() });

            const result = await service.delete('prod-1');

            expect(mockProductsRepo.delete).toHaveBeenCalledWith('prod-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('existsBy delegation methods', () => {
        it('should delegate existsByDosageForm to repository', async () => {
            mockProductsRepo.existsByDosageForm.mockResolvedValue(true);
            const res = await service.existsByDosageForm('df-1');
            expect(mockProductsRepo.existsByDosageForm).toHaveBeenCalledWith('df-1');
            expect(res).toBe(true);
        });

        it('should delegate existsByProductType to repository', async () => {
            mockProductsRepo.existsByProductType.mockResolvedValue(true);
            const res = await service.existsByProductType('pt-1');
            expect(mockProductsRepo.existsByProductType).toHaveBeenCalledWith('pt-1');
            expect(res).toBe(true);
        });

        it('should delegate existsByRetailCategory to repository', async () => {
            mockProductsRepo.existsByRetailCategory.mockResolvedValue(true);
            const res = await service.existsByRetailCategory('rc-1');
            expect(mockProductsRepo.existsByRetailCategory).toHaveBeenCalledWith('rc-1');
            expect(res).toBe(true);
        });

        it('should delegate existsByManufacturer to repository', async () => {
            mockProductsRepo.existsByManufacturer.mockResolvedValue(true);
            const res = await service.existsByManufacturer('m-1');
            expect(mockProductsRepo.existsByManufacturer).toHaveBeenCalledWith('m-1');
            expect(res).toBe(true);
        });
    });

    describe('validateRelations during create', () => {
        it('should call services to validate foreign relations', async () => {
            const dto: any = {
                name: 'Panadol',
                generic_name: 'Paracetamol',
                manufacturer_id: 'm-1',
                product_type_id: 'pt-1',
                retail_category_id: 'rc-1',
                dosage_form_id: 'df-1',
            };

            mockManufacturersService.get.mockResolvedValue({ id: 'm-1' });
            mockProductTypesService.findById.mockResolvedValue({ id: 'pt-1' });
            mockRetailCategoriesService.findById.mockResolvedValue({ id: 'rc-1' });
            mockDosageFormsService.findById.mockResolvedValue({ id: 'df-1' });
            mockProductsRepo.findByNameAndGenericName.mockResolvedValue(null);
            mockProductsRepo.create.mockResolvedValue({ id: 'prod-1', ...dto });

            await service.create(dto);

            expect(mockManufacturersService.get).toHaveBeenCalledWith('m-1');
            expect(mockProductTypesService.findById).toHaveBeenCalledWith('pt-1');
            expect(mockRetailCategoriesService.findById).toHaveBeenCalledWith('rc-1');
            expect(mockDosageFormsService.findById).toHaveBeenCalledWith('df-1');
        });
    });
});
