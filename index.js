/**
 * Created by linyechengwei@163.com on 17/4/9.
 Props:
 text - (string) - loading text
 textStyle - (object) - loading text style
 pointerEvents - (bool) - loading can click on the bottom of the content, default is false
 bottomStyle - (object) - loading the bottom cover background style
 loadingStyle - (object) - loading background style
 offsetX - (number) loading offsetX
 offsetY - (number) loading offsetY
 mode - (string) oneOf('none', 'up-down', 'left-right')
 timeout - (number) - loading timeout, default none
 onLoadingTimeout - (function) - loading timeout callback
 */
'use strict';

import React, {PropTypes} from 'react';

import {
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import CircleProgress from './CircleProgress'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Loading extends React.Component {

  static LOADING_WIDTH_UP_DOWN = 100;
  static LOADING_HEIGHT_UP_DOWN = 80;

  static LOADING_WIDTH_LEFT_RIGHT = 200;
  static LOADING_HEIGHT_LEFT_RIGHT = 54;

  static defaultProps = {
    pointerEvents: false,
    timeout: 0,  //单位：秒
    offsetX: 0,
    offsetY: 0,
  };

  static propTypes = {
    text: PropTypes.string,
    textStyle: PropTypes.any,
    pointerEvents: PropTypes.bool,
    bottomStyle: PropTypes.any,
    loadingStyle: PropTypes.any,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    mode: PropTypes.oneOf(['none', 'up-down', 'left-right']),
    timeout: PropTypes.number, //单位：秒
    onLoadingTimeout: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShown: true
    };
  }

  componentDidMount() {
    const {timeout, onLoadingTimeout} = this.props;
    if (timeout > 0) {
      setTimeout(() => {
        if(this.state.isShown) {
          this.setState({isShown: false});
          onLoadingTimeout && onLoadingTimeout();
        }
      }, timeout * 1000);
    }
  }

  render() {
    const props = this.props;
    let offsetStyle = {};
    if (props.offsetY != 0 || props.offsetX != 0) {
      if (props.mode === 'up-down') {
        offsetStyle.top = SCREEN_HEIGHT / 2 + props.offsetY / 2 - Loading.LOADING_HEIGHT_UP_DOWN / 2;
        offsetStyle.left = SCREEN_WIDTH / 2 + props.offsetX / 2 - Loading.LOADING_WIDTH_UP_DOWN / 2;
      }
      if (props.mode === 'left-right') {
        offsetStyle.top = SCREEN_HEIGHT / 2 + props.offsetY / 2 - Loading.LOADING_HEIGHT_LEFT_RIGHT / 2;
        offsetStyle.left = SCREEN_WIDTH / 2 + props.offsetX / 2 - Loading.LOADING_WIDTH_LEFT_RIGHT / 2;
      }
    }
    return (
      this.state.isShown ?
        <View pointerEvents={!!props && props.pointerEvents ? 'none' : 'auto'} style={styles.container}>
          <View pointerEvents={'none'} style={[styles.loadingBg, props.bottomStyle]}/>
          {
            props.mode !== 'none' &&
            <View
              style={[props.mode==='up-down'?styles.loadingBody1:styles.loadingBody2, offsetStyle, props.loadingStyle]}>
              <CircleProgress />
              <Text style={[styles.loadingText, props.textStyle]}>
                {!!props && props.text ? props.text : 'Loading...'}
              </Text>
            </View>
          }
        </View>
        : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  loadingBg: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  loadingBody1: {
    width: 100,
    height: 80,
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - Loading.LOADING_HEIGHT_UP_DOWN / 2,
    left: SCREEN_WIDTH / 2 - Loading.LOADING_WIDTH_UP_DOWN / 2,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingBody2: {
    width: 200,
    height: 54,
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - Loading.LOADING_HEIGHT_LEFT_RIGHT / 2,
    left: SCREEN_WIDTH / 2 - Loading.LOADING_WIDTH_LEFT_RIGHT / 2,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'transparent'
  }
});

module.exports = Loading
