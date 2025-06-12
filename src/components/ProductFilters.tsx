import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootState } from '../store';
import { 
  setSearchTerm, 
  setCategory, 
  setPriceRange, 
  setInStock, 
  resetFilters 
} from '../store/slices/filtersSlice';
import { CATEGORIES } from '../types';
import type { FilterState } from '../types';
import { colors, spacing, breakpoints, Button, Input, Label } from '../styles/GlobalStyles';

const FiltersContainer = styled.div`
  background: ${colors.white};
  padding: ${spacing.lg};
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  margin-bottom: ${spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    align-items: end;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${colors.white};
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primary[500]};
    outline: none;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

const PriceInput = styled(Input)`
  max-width: 100px;
`;

const StockFilterContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const StockButton = styled(Button)<{ active?: boolean }>`
  padding: ${spacing.xs} ${spacing.sm};
  font-size: 0.875rem;
  
  ${({ active }) => active && `
    background-color: ${colors.primary[500]};
    color: ${colors.white};
  `}
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.gray[900]};
    margin: 0;
  }
`;

interface ProductFiltersProps {
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.filters as FilterState);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  }, [dispatch]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCategory(e.target.value));
  }, [dispatch]);

  const handlePriceRangeChange = useCallback((field: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    dispatch(setPriceRange({
      ...filters.priceRange,
      [field]: numValue,
    }));
  }, [dispatch, filters.priceRange]);

  const handleStockFilter = useCallback((inStock: boolean | null) => {
    dispatch(setInStock(inStock));
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return (
    <FiltersContainer className={className}>
      <FiltersHeader>
        <h3>Filtros de Productos</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
        >
          Limpiar Filtros
        </Button>
      </FiltersHeader>

      <FiltersGrid>
        {/* Búsqueda por nombre */}
        <FilterGroup>
          <Label htmlFor="search">Buscar producto</Label>
          <Input
            id="search"
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </FilterGroup>

        {/* Filtro por categoría */}
        <FilterGroup>
          <Label htmlFor="category">Categoría</Label>
          <Select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FilterGroup>

        {/* Filtro por rango de precio */}
        <FilterGroup>
          <Label>Rango de precio</Label>
          <PriceRangeContainer>
            <PriceInput
              type="number"
              placeholder="Min"
              value={filters.priceRange.min || ''}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              min="0"
              step="0.01"
            />
            <span>-</span>
            <PriceInput
              type="number"
              placeholder="Max"
              value={filters.priceRange.max || ''}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              min="0"
              step="0.01"
            />
          </PriceRangeContainer>
        </FilterGroup>

        {/* Filtro por disponibilidad */}
        <FilterGroup>
          <Label>Disponibilidad</Label>
          <StockFilterContainer>
            <StockButton
              variant="secondary"
              size="sm"
              active={filters.inStock === null}
              onClick={() => handleStockFilter(null)}
            >
              Todos
            </StockButton>
            <StockButton
              variant="secondary"
              size="sm"
              active={filters.inStock === true}
              onClick={() => handleStockFilter(true)}
            >
              En stock
            </StockButton>
            <StockButton
              variant="secondary"
              size="sm"
              active={filters.inStock === false}
              onClick={() => handleStockFilter(false)}
            >
              Sin stock
            </StockButton>
          </StockFilterContainer>
        </FilterGroup>
      </FiltersGrid>
    </FiltersContainer>
  );
}; 