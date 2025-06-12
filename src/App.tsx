import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { store } from './store';
import { GlobalStyle, Container, Button, colors, spacing, shadows } from './styles/GlobalStyles';
import { ProductFilters } from './components/ProductFilters';
import { ProductGrid } from './components/ProductGrid';
import { useAppDispatch } from './store';
import { createProduct, updateProduct, deleteProduct, fetchProducts } from './store/slices/productsSlice';
import type { Product, ProductFormData } from './types';
import { Modal } from './components/Modal';
import { ProductForm } from './components/ProductForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useProducts } from './hooks/useProducts';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.xl} 0;
  gap: ${spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing.lg};
    text-align: center;
  }
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${colors.primary[500]} 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  box-shadow: ${shadows.md};
`;

const BrandText = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, ${colors.gray[900]} 0%, ${colors.primary[600]} 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    line-height: 1.2;
  }
  
  p {
    font-size: 0.875rem;
    color: ${colors.gray[600]};
    margin: 0;
    margin-top: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
`;

const QuickStats = styled.div`
  display: flex;
  gap: ${spacing.lg};
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const QuickStat = styled.div`
  text-align: center;
  padding: ${spacing.sm} ${spacing.md};
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  min-width: 80px;
  
  .number {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${colors.gray[900]};
    margin: 0;
  }
  
  .label {
    font-size: 0.75rem;
    color: ${colors.gray[600]};
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const CreateButton = styled(Button)`
  background: linear-gradient(135deg, ${colors.primary[500]} 0%, #667eea 100%);
  color: white;
  border: none;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.main`
  padding: ${spacing.xl} 0;
  min-height: calc(100vh - 120px);
`;

const ContentContainer = styled(Container)`
  display: grid;
  gap: ${spacing.xl};
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: ${spacing.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary[500]}, #667eea, #764ba2);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, rgba(102, 126, 234, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.gray[900]};
  line-height: 1;
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.positive ? colors.success[600] : colors.error[600]};
  margin-top: ${spacing.xs};
`;

const ProductsSection = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: ${spacing.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
  padding-bottom: ${spacing.lg};
  border-bottom: 1px solid ${colors.gray[200]};
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.gray[900]};
    margin: 0;
  }
  
  .subtitle {
    font-size: 0.875rem;
    color: ${colors.gray[600]};
    margin-top: ${spacing.xs};
  }
`;

const FloatingButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary[500]} 0%, #667eea 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  z-index: 100;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.6);
  }
  
  &:active {
    transform: scale(1.05);
  }
`;

function AppContent() {
  const dispatch = useAppDispatch();
  const { productStats, isLoading: productsLoading } = useProducts();

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cargar productos al montar
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handlers para modales
  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      setIsCreateModalOpen(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear producto' 
      };
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return { success: false, error: 'No hay producto seleccionado' };

    try {
      await dispatch(updateProduct({ id: selectedProduct.id, data })).unwrap();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar producto' 
      };
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return { success: false, error: 'No hay producto seleccionado' };

    try {
      await dispatch(deleteProduct(selectedProduct.id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar producto' 
      };
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <AppContainer>
      <GlobalStyle />
      
      <Header>
        <Container>
          <HeaderContent>
            <BrandSection>
              <Logo>🛍️</Logo>
              <BrandText>
                <h1>Commerce Pro</h1>
                <p>Panel de Administración</p>
              </BrandText>
            </BrandSection>
            
            <QuickStats>
              <QuickStat>
                <div className="number">{productStats.total}</div>
                <div className="label">Productos</div>
              </QuickStat>
              <QuickStat>
                <div className="number">{productStats.inStock}</div>
                <div className="label">En Stock</div>
              </QuickStat>
              <QuickStat>
                <div className="number">€{Math.round(productStats.totalValue / 1000)}k</div>
                <div className="label">Valor</div>
              </QuickStat>
            </QuickStats>
            
            <HeaderActions>
              <CreateButton onClick={() => setIsCreateModalOpen(true)}>
                <span>➕</span>
                Nuevo Producto
              </CreateButton>
            </HeaderActions>
          </HeaderContent>
        </Container>
      </Header>

      <MainContent>
        <ContentContainer>
          {/* Estadísticas Detalladas */}
          <StatsSection>
            <StatCard>
              <StatHeader>
                <StatIcon>📦</StatIcon>
              </StatHeader>
              <StatValue>{productStats.total}</StatValue>
              <StatLabel>Total de Productos</StatLabel>
              <StatChange positive>+12% este mes</StatChange>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatIcon>💰</StatIcon>
              </StatHeader>
              <StatValue>€{Math.round(productStats.totalValue).toLocaleString()}</StatValue>
              <StatLabel>Valor del Inventario</StatLabel>
              <StatChange positive>+8% este mes</StatChange>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatIcon>📊</StatIcon>
              </StatHeader>
              <StatValue>{productStats.inStock}</StatValue>
              <StatLabel>Productos en Stock</StatLabel>
              <StatChange positive>+5% esta semana</StatChange>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatIcon>⚠️</StatIcon>
              </StatHeader>
              <StatValue>{productStats.outOfStock}</StatValue>
              <StatLabel>Sin Stock</StatLabel>
              <StatChange positive={productStats.outOfStock === 0}>
                {productStats.outOfStock === 0 ? '¡Perfecto!' : 'Requiere atención'}
              </StatChange>
            </StatCard>
          </StatsSection>

          {/* Sección de Productos */}
          <ProductsSection>
            <SectionHeader>
              <div>
                <h2>Gestión de Productos</h2>
                <div className="subtitle">
                  Administra tu catálogo de productos
                </div>
              </div>
            </SectionHeader>
            
            <ProductFilters />
            <ProductGrid 
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </ProductsSection>
        </ContentContainer>
      </MainContent>

      {/* Botón flotante para crear producto */}
      <FloatingButton
        onClick={() => setIsCreateModalOpen(true)}
        aria-label="Crear nuevo producto"
        title="Crear nuevo producto"
      >
        ➕
      </FloatingButton>

      {/* Modal para crear producto */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        title="Crear Nuevo Producto"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={handleCloseModals}
          isLoading={productsLoading}
        />
      </Modal>

      {/* Modal para editar producto */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        title="Editar Producto"
      >
        <ProductForm
          product={selectedProduct || undefined}
          onSubmit={handleUpdateProduct}
          onCancel={handleCloseModals}
          isLoading={productsLoading}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer. El producto será eliminado permanentemente."
        productName={selectedProduct?.name}
        productCategory={selectedProduct?.category}
        productPrice={selectedProduct?.price}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={productsLoading}
      />
    </AppContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
