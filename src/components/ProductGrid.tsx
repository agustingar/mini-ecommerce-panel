import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';
import { colors, spacing, breakpoints, LoadingSpinner } from '../styles/GlobalStyles';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: ${breakpoints.xl}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled(motion.div)`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${spacing['3xl']};
  color: ${colors.gray[500]};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${spacing.lg};
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  margin: 0 0 ${spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  color: ${colors.gray[500]};
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
`;

const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing['3xl']};
  flex-direction: column;
  gap: ${spacing.lg};
`;

const LoadingText = styled.p`
  color: ${colors.gray[600]};
  font-size: 1rem;
  margin: 0;
`;

const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${spacing['3xl']};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: 0.75rem;
  color: ${colors.error[700]};
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${spacing.lg};
`;

const ErrorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${spacing.sm} 0;
`;

const ErrorDescription = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
`;

interface ProductGridProps {
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  onView?: (product: Product) => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onEditProduct,
  onDeleteProduct,
  onView,
  className
}) => {
  const { filteredProducts, isLoading, error } = useProducts();

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <GridContainer className={className}>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Cargando productos...</LoadingText>
        </LoadingContainer>
      </GridContainer>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <GridContainer className={className}>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Error al cargar productos</ErrorTitle>
          <ErrorDescription>{error}</ErrorDescription>
        </ErrorContainer>
      </GridContainer>
    );
  }

  // Mostrar estado vacío
  if (filteredProducts.length === 0) {
    return (
      <GridContainer className={className}>
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyIcon>📦</EmptyIcon>
          <EmptyTitle>No se encontraron productos</EmptyTitle>
          <EmptyDescription>
            No hay productos que coincidan con los filtros seleccionados.
            Prueba ajustando los criterios de búsqueda o crea tu primer producto.
          </EmptyDescription>
        </EmptyState>
      </GridContainer>
    );
  }

  // Mostrar productos
  return (
    <GridContainer className={className}>
      <AnimatePresence mode="popLayout">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
            onView={onView}
          />
        ))}
      </AnimatePresence>
    </GridContainer>
  );
}; 