/**
 * Created by wenxucheng@163.com on 16/2/25.
 Props:
 text - (string) - loading text
 textStyle - (object) - loading text style
 pointerEvents - (bool) - loading can click on the bottom of the content, default is false
 bottomStyle - (object) - loading the bottom cover background style
 loadingStyle - (object) - loading background style
 timeout - (number) - loading timeout, default none
 onLoadingTimeout - (function) - loading timeout callback
 Method:
 show(text:string, pointerEvents:bool) - show loading
 dismiss() - dismiss loading
 isShown() - return loading is showed
 setLoadingOffset(x:number, y:number) - set loading offset
 setLoadingTimeout(timeout:number, onLoadingTimeout:function) - set loading timeout and timeout callback
 clearLoadingTimeout() - clear loading timeout
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
    timeout: 0,
  };
  static propTypes = {
    text: PropTypes.string,
    textStyle: PropTypes.any,
    pointerEvents: PropTypes.bool,
    bottomStyle: PropTypes.any,
    loadingStyle: PropTypes.any,
    timeout: PropTypes.number,
    mode: PropTypes.oneOf(['none', 'up-down', 'left-right']),
    onLoadingTimeout: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.isShown = false;
    this.state = {
      loading: (<View />),
    }
    this.offsetX = 0;
    this.offsetY = 0;
    this.timeout = props.timeout;
    this.onLoadingTimeout = props.onLoadingTimeout;
    this.timeoutEvent = undefined;

  }

  render() {
    return this.state.loading;
  }

  show(text, pointerEvents, mode) {
    if (!this.isShown) {
      if (typeof(text) == 'boolean') {
        pointerEvents = text;
        text = '';
      }
      text = text ? text : this.props.text;
      mode = mode ? mode : 'none'
      this.setState({
        loading: this._getLoading({
          ...this.props,
          text: text,
          pointerEvents: pointerEvents,
          mode: mode
        })
      });
      if (this.timeout > 0) {
        this.timeoutEvent = setTimeout(() => {
          if (this.isShown) {
            this.dismiss();
            this.onLoadingTimeout && this.onLoadingTimeout();
          }
        }, this.timeout);
      }
      this.isShown = true;
    }
  }

  dismiss() {
    if (this.isShown) {
      this.setState({
        loading: (<View />)
      });
      this.isShown = false;
      this.timeoutEvent && clearInterval(this.timeoutEvent);
    }
  }

  setLoadingOffset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
    return this;
  }

  setLoadingTimeout(timeout, onLoadingTimeout) {
    this.timeout = timeout;
    this.onLoadingTimeout = onLoadingTimeout;
    return this;
  }

  clearLoadingTimeout() {
    this.timeout = 0;
    this.onLoadingTimeout = undefined;
  }

  isShown() {
    return this.isShown;
  }

  _getLoading(props) {
    console.log(props)
    let offsetStyle = {};
    if (this.offsetY != 0 || this.offsetX != 0) {
      if (props.mode === 'up-down') {
        offsetStyle.top = SCREEN_HEIGHT / 2 + this.offsetY / 2 - Loading.LOADING_HEIGHT_UP_DOWN / 2;
        offsetStyle.left = SCREEN_WIDTH / 2 + this.offsetX / 2 - Loading.LOADING_WIDTH_UP_DOWN / 2;
      }
      if (props.mode === 'left-right') {
        offsetStyle.top = SCREEN_HEIGHT / 2 + this.offsetY / 2 - Loading.LOADING_HEIGHT_LEFT_RIGHT / 2;
        offsetStyle.left = SCREEN_WIDTH / 2 + this.offsetX / 2 - Loading.LOADING_WIDTH_LEFT_RIGHT / 2;
      }
    }
    return (
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
