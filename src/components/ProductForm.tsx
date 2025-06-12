import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import type { Product, ProductFormData } from '../types';
import { CATEGORIES } from '../types';
import { colors, spacing, Input, Label, ErrorText, Button, LoadingSpinner } from '../styles/GlobalStyles';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const FormGroup = styled.div`
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

  &:invalid {
    border-color: ${colors.error[500]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primary[500]};
    outline: none;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:invalid {
    border-color: ${colors.error[500]};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

// Esquema de validación con Yup
const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: Yup.string()
    .required('La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  price: Yup.number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser positivo')
    .max(999999, 'El precio no puede exceder 999,999'),
  category: Yup.string()
    .required('La categoría es obligatoria')
    .oneOf(CATEGORIES as readonly string[], 'Categoría inválida'),
  stock: Yup.number()
    .required('El stock es obligatorio')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .max(9999, 'El stock no puede exceder 9,999'),
  imageUrl: Yup.string()
    .url('La URL de la imagen no es válida')
    .optional(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convertir a número para campos numéricos
    const processedValue = (name === 'price' || name === 'stock') 
      ? parseFloat(value) || 0 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await productSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // El modal se cerrará desde el componente padre
      } else {
        setErrors({ submit: result.error || 'Error al guardar el producto' });
      }
    } catch {
      setErrors({ submit: 'Error inesperado al guardar el producto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!product;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Nombre del producto *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ej: iPhone 15 Pro"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Descripción *</Label>
        <TextArea
          id="description"
          name="description"
          placeholder="Describe las características principales del producto..."
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        />
        {errors.description && <ErrorText>{errors.description}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Categoría *</Label>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        >
          <option value="">Selecciona una categoría</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        {errors.category && <ErrorText>{errors.category}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="price">Precio (€) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.price || ''}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        />
        {errors.price && <ErrorText>{errors.price}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="stock">Stock *</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          placeholder="0"
          min="0"
          value={formData.stock || ''}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        />
        {errors.stock && <ErrorText>{errors.stock}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="imageUrl">URL de la imagen</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={formData.imageUrl}
          onChange={handleChange}
          disabled={isLoading || isSubmitting}
        />
        {errors.imageUrl && <ErrorText>{errors.imageUrl}</ErrorText>}
      </FormGroup>

      {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

      <FormActions>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting && <LoadingSpinner />}
          {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
      </FormActions>
    </Form>
  );
}; 