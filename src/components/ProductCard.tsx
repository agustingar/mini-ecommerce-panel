import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { colors, spacing, shadows, Button } from '../styles/GlobalStyles';

const MotionCard = motion(styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: ${shadows.md};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-2px);
  }
`);

const ProductImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background: ${({ $imageUrl }) => 
    $imageUrl 
      ? `url(${$imageUrl}) center/cover no-repeat`
      : `linear-gradient(135deg, ${colors.gray[100]} 0%, ${colors.gray[200]} 100%)`
  };
  position: relative;
`;

const StockBadge = styled.div<{ $inStock: boolean }>`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ $inStock }) => $inStock ? `
    background-color: ${colors.success[50]};
    color: ${colors.success[600]};
  ` : `
    background-color: ${colors.error[50]};
    color: ${colors.error[600]};
  `}
`;

const ProductContent = styled.div`
  padding: ${spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductHeader = styled.div`
  margin-bottom: ${spacing.sm};
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0 0 ${spacing.xs} 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCategory = styled.span`
  color: ${colors.gray[500]};
  font-size: 0.875rem;
  font-weight: 400;
`;

const ProductDescription = styled.p`
  color: ${colors.gray[600]};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: ${spacing.sm} 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${spacing.md};
  border-top: 1px solid ${colors.gray[100]};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary[600]};
`;

const StockInfo = styled.span<{ $inStock: boolean }>`
  font-size: 0.75rem;
  color: ${({ $inStock }) => $inStock ? colors.gray[500] : colors.error[500]};
  margin-top: 2px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

const IconButton = styled(Button)`
  padding: ${spacing.xs};
  min-width: 32px;
  height: 32px;
`;

const PlaceholderIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[400]};
  font-size: 2rem;
`;

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
  className
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatStock = (stock: number): string => {
    if (stock === 0) return 'Sin stock';
    if (stock === 1) return '1 unidad disponible';
    return `${stock} unidades disponibles`;
  };

  const isInStock = product.stock > 0;

  return (
    <MotionCard
      className={className}
      onClick={() => onView?.(product)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <ProductImage $imageUrl={product.imageUrl}>
        {!product.imageUrl && (
          <PlaceholderIcon>
            📦
          </PlaceholderIcon>
        )}
        <StockBadge $inStock={isInStock}>
          {isInStock ? 'En Stock' : 'Agotado'}
        </StockBadge>
      </ProductImage>

      <ProductContent>
        <ProductHeader>
          <ProductName title={product.name}>
            {product.name}
          </ProductName>
          <ProductCategory>
            {product.category}
          </ProductCategory>
        </ProductHeader>

        <ProductDescription title={product.description}>
          {product.description}
        </ProductDescription>

        <ProductFooter>
          <PriceContainer>
            <Price>{formatPrice(product.price)}</Price>
            <StockInfo $inStock={isInStock}>
              {formatStock(product.stock)}
            </StockInfo>
          </PriceContainer>

          <ActionsContainer>
            {onEdit && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                title="Editar producto"
              >
                ✏️
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product);
                }}
                title="Eliminar producto"
              >
                🗑️
              </IconButton>
            )}
          </ActionsContainer>
        </ProductFooter>
      </ProductContent>
    </MotionCard>
  );
}; 