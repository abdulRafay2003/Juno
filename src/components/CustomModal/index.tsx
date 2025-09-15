import React, {ReactNode} from 'react';
import {Modal, StyleSheet} from 'react-native';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const CustomModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType={'fade'}>
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({});
