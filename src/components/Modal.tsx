import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, spacing, shadows, Button } from '../styles/GlobalStyles';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: ${shadows.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${spacing.xl} ${spacing.xl} ${spacing.lg};
  border-bottom: 1px solid ${colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0;
`;

const CloseButton = styled(Button)`
  padding: ${spacing.xs};
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const ModalBody = styled.div`
  padding: ${spacing.xl};
`;

const ModalFooter = styled.div`
  padding: ${spacing.lg} ${spacing.xl};
  border-top: 1px solid ${colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className
}) => {
  // Cerrar modal con Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton
                variant="ghost"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                ✕
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {children}
            </ModalBody>

            {footer && (
              <ModalFooter>
                {footer}
              </ModalFooter>
            )}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
}; 