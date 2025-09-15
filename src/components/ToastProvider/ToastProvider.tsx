import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import AnimatedToast from '@/components/AnimatedToast';
import {View} from 'react-native';

const ToastContext = createContext(null);

// ✅ Global toastRef for access outside React tree
export const toastRef = {
  show: (data: any) => {},
};

export const ToastProvider = ({children}: any) => {
  const [toastData, setToastData] = useState(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = ({type, message, subMessage}: any) => {
    setToastData({type, message, subMessage});
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToastData(null);
    }, 5000);
  };

  const hideToast = () => {
    setToastData(null);
  };

  // ✅ Assign global reference when component mounts
  useEffect(() => {
    toastRef.show = showToast;
  }, []);

  return (
    <ToastContext.Provider value={{showToast, hideToast}}>
      <View style={{flex: 1}}>
        {children}
        {toastData && (
          <AnimatedToast
            type={toastData.type}
            message={toastData.message}
            subMessage={toastData.subMessage}
            onClose={hideToast}
          />
        )}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
