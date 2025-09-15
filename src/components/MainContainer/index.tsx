import React, {ReactNode} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Colors, Metrix} from '../../config';
import {Header} from '../Header';
import type {BackHeaderProps} from '../Header';

type MainContainerProps = {
  children: ReactNode;
  customeStyle?: StyleProp<ViewStyle>;
  hidden?: boolean;
  mainContainerStyle?: StyleProp<ViewStyle>;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  barBg?: string;
  isFlatList?: boolean;
  isHeader?: boolean;
  isHeaderWithStatus?: boolean;
  statusBadge?: string;
  disabled?: boolean;
  onStartShouldSetResponder?: any;
} & BackHeaderProps;

export const MainContainer: React.FC<MainContainerProps> = ({
  children,
  customeStyle,
  hidden = false,
  mainContainerStyle,
  barStyle = 'dark-content',
  barBg = Colors.White,
  isFlatList,
  isHeader = false,
  isHeaderWithStatus,
  disabled,
  onStartShouldSetResponder,
  ...headerProps
}) => {
  return (
    <KeyboardAvoidingView
      onStartShouldSetResponder={onStartShouldSetResponder}
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={5}>
      <SafeAreaView style={[styles.safeAreaContainer, mainContainerStyle]}>
        <StatusBar
          hidden={hidden}
          barStyle={barStyle}
          backgroundColor={barBg}
        />
        {isHeader && <Header {...headerProps} disabled={disabled} />}
        {!isFlatList ? (
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={Keyboard.dismiss}>
            <View style={[styles.container, customeStyle]}>{children}</View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={[styles.flatlistContainer, customeStyle]}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrix.HorizontalSize(15),
    paddingVertical: Metrix.VerticalSize(10),
  },
  flatlistContainer: {
    paddingHorizontal: Metrix.HorizontalSize(15),
    paddingBottom: Metrix.VerticalSize(20),
    backgroundColor: Colors.BaseBackground,
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(25)
        : Metrix.VerticalSize(0),
  },
});
