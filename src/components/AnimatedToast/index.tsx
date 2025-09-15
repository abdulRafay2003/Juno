import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  Image,
  PanResponder,
  Platform,
} from 'react-native';
import Images from '@/config/images';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import {string} from 'yup';

const SCREEN_WIDTH = Dimensions.get('window').width;

type AnimatedToastProps = {
  type: string;
  message: string;
  subMessage: string;
  onClose: () => void;
};

const AnimatedToast: React.FC<AnimatedToastProps> = ({
  type = 'success',
  message,
  subMessage,
  onClose,
}: any) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const icon = type === 'success' ? Images.Tick : Images.Exclamination;

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose?.());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -10, // Only upward
      onPanResponderMove: (_, gesture) => {
        panY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -50) {
          dismissToast();
        } else {
          // Reset if swipe wasn't enough
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = {
    backgroundColor:
      type === 'error'
        ? Colors.ToastError
        : type === 'alert'
          ? Colors.YellowBadge('1')
          : Colors.ToastSuccess,
    transform: [{translateY: Animated.add(slideAnim, panY)}],
    opacity: opacityAnim,
  };

  return (
    <Animated.View
      style={[styles.toastContainer, animatedStyle]}
      {...panResponder.panHandlers}>
      <View style={styles.circle}>
        <Image
          source={icon}
          style={[
            styles.iconStyle,
            {
              tintColor:
                type === 'error'
                  ? 'red'
                  : type === 'alert'
                    ? Colors.Yellow
                    : undefined,
            },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <CustomText.LargeSemiBoldText customStyle={styles.title}>
          {message}
        </CustomText.LargeSemiBoldText>
        <CustomText.MediumText numberOfLines={2} customStyle={styles.subtitle}>
          {subMessage}
        </CustomText.MediumText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    zIndex: 100,
    top: Platform.select({
      ios: Metrix.VerticalSize(50),
      android: Metrix.VerticalSize(25),
    }),
    alignSelf: 'center',
    width: SCREEN_WIDTH - 40,
    backgroundColor: Colors.ToastSuccess,
    padding: Metrix.HorizontalSize(14),
    borderRadius: Metrix.Radius,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.DarkBlack,
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 2},
    shadowRadius: 4,
  },
  circle: {
    width: Metrix.HorizontalSize(34),
    height: Metrix.HorizontalSize(34),
    borderRadius: Metrix.RoundRadius,
    backgroundColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Metrix.HorizontalSize(12),
  },
  iconStyle: {
    width: Metrix.HorizontalSize(18),
    height: Metrix.VerticalSize(18),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontType.FontRegular,
  },
  subtitle: {
    fontSize: FontType.FontSmall,
    marginVertical: Metrix.VerticalSize(0),
  },
});

export default AnimatedToast;
