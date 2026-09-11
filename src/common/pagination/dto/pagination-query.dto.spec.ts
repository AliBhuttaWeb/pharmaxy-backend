import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

describe('PaginationQueryDto', () => {
    async function transformAndValidate<T extends object>(cls: new () => T, plain: any): Promise<T> {
        const instance = plainToInstance(cls, plain);
        const errors = await validate(instance);
        expect(errors).toHaveLength(0);
        return instance;
    }

    describe('when no pagination params are provided', () => {
        it('should leave page and limit undefined so unpaginated results are returned', async () => {
            const dto = await transformAndValidate(PaginationQueryDto, {});
            expect(dto.page).toBeUndefined();
            expect(dto.limit).toBeUndefined();
        });
    });

    describe('when pagination params are provided', () => {
        it('should transform numeric string params to numbers', async () => {
            const dto = await transformAndValidate(PaginationQueryDto, { page: '2', limit: '15' });
            expect(dto.page).toBe(2);
            expect(dto.limit).toBe(15);
        });
    });

    describe('sorting parameters', () => {
        it('should accept snake_case sort_by and sort_order', async () => {
            const dto = await transformAndValidate(PaginationQueryDto, {
                sort_by: 'created_at',
                sort_order: 'desc',
            });
            expect(dto.sort_by).toBe('created_at');
            expect(dto.sort_order).toBe('desc');
        });
    });

    describe('pharmacy and branch scoping filters', () => {
        it('should accept pharmacy_id and branch_id', async () => {
            const dto = await transformAndValidate(PaginationQueryDto, {
                page: '1',
                limit: '5',
                pharmacy_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                branch_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            });
            expect(dto.page).toBe(1);
            expect(dto.limit).toBe(5);
            expect(dto.pharmacy_id).toBe('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
            expect(dto.branch_id).toBe('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
        });
    });
});
