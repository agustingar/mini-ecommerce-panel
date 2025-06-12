import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { colors, spacing, Button, LoadingSpinner } from '../styles/GlobalStyles';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  text-align: center;
`;

const Icon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: ${colors.error[50]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${colors.error[600]};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0;
`;

const Description = styled.p`
  color: ${colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const ProductInfo = styled.div`
  background: ${colors.gray[50]};
  border-radius: 0.5rem;
  padding: ${spacing.md};
  border-left: 4px solid ${colors.error[500]};
`;

const ProductName = styled.div`
  font-weight: 600;
  color: ${colors.gray[900]};
  margin-bottom: ${spacing.xs};
`;

const ProductDetails = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  title: string;
  description: string;
  productName?: string;
  productCategory?: string;
  productPrice?: number;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  productName,
  productCategory,
  productPrice,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await onConfirm();
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Error al realizar la operación');
      }
    } catch {
      setError('Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const getIconSymbol = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'danger':
      default:
        return '🗑️';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
    >
      <Content>
        <Icon>
          {getIconSymbol()}
        </Icon>

        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>

        {productName && (
          <ProductInfo>
            <ProductName>{productName}</ProductName>
            <ProductDetails>
              {productCategory && `Categoría: ${productCategory}`}
              {productCategory && productPrice && ' • '}
              {productPrice && `Precio: €${productPrice.toFixed(2)}`}
            </ProductDetails>
          </ProductInfo>
        )}

        {error && (
          <div style={{ 
            color: colors.error[600], 
            fontSize: '0.875rem',
            textAlign: 'center',
            backgroundColor: colors.error[50],
            padding: spacing.sm,
            borderRadius: '0.375rem',
            border: `1px solid ${colors.error[200]}`
          }}>
            {error}
          </div>
        )}

        <Actions>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading || isSubmitting}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting && <LoadingSpinner />}
            {confirmText}
          </Button>
        </Actions>
      </Content>
    </Modal>
  );
}; 