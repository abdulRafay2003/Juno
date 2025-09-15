import {CommonActions, StackActions} from '@react-navigation/native';

let _navigator: {dispatch: (arg0: any) => void};

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: any, params?: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  );
}

function goBack() {
  _navigator.dispatch(CommonActions.goBack());
}

function reset_0(routeName: any, params?: any) {
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName, params}],
    }),
  );
}

function push(routeName: any, params?: any) {
  _navigator.dispatch(StackActions.push(routeName, params));
}

function replace(routeName: any, params?: any) {
  _navigator.dispatch(StackActions.replace(routeName, params));
}

function pop(count = 1) {
  _navigator.dispatch(StackActions.pop(count));
}

function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

export default {
  setTopLevelNavigator,
  navigate,
  replace,
  goBack,
  reset_0,
  push,
  pop,
  popToTop,
};
