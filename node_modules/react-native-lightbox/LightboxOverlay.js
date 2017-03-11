/**
 * @providesModule LightboxOverlay
 */
'use strict';

var React = require('react');
var {
  PropTypes,
} = React;
var {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');

var ViewTransformer = require('react-native-view-transformer').default;
var WINDOW_HEIGHT = Dimensions.get('window').height;
var WINDOW_WIDTH = Dimensions.get('window').width;
var DRAG_DISMISS_THRESHOLD = 100; // Y-axis drag value near the top/bottom edge of the screen

var LightboxOverlay = React.createClass({
  propTypes: {
    origin: PropTypes.shape({
      x:        PropTypes.number,
      y:        PropTypes.number,
      width:    PropTypes.number,
      height:   PropTypes.number,
    }),
    springConfig: PropTypes.shape({
      tension:  PropTypes.number,
      friction: PropTypes.number,
    }),
    backgroundColor: PropTypes.string,
    isOpen:          PropTypes.bool,
    renderHeader:    PropTypes.func,
    onOpen:          PropTypes.func,
    onClose:         PropTypes.func,
    swipeToDismiss:  PropTypes.bool,
    pinchToZoom:     PropTypes.bool,
  },

  getInitialState: function() {
    return {
      isAnimating: false,
      isPanning: false,
      isClosing: false,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      },
      pan: new Animated.Value(0),
      openVal: new Animated.Value(0),
    };
  },

  getDefaultProps: function() {
    return {
      springConfig: { tension: 30, friction: 7 },
      backgroundColor: 'black',
    };
  },

  componentDidMount: function() {
    if(this.props.isOpen) {
      this.open();
    }
  },

  open: function() {
    StatusBar.setHidden(true, 'fade');
    this.state.pan.setValue(0);
    this.setState({
      isAnimating: true,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      }
    });

    Animated.spring(
      this.state.openVal,
      { toValue: 1, ...this.props.springConfig }
    ).start(() => this.setState({ isAnimating: false }));
  },

  close: function() {
    StatusBar.setHidden(false, 'fade');
    this.setState({
      isClosing: true,
      isAnimating: true,
    });
    Animated.spring(
      this.state.openVal,
      { toValue: 0, ...this.props.springConfig }
    ).start(() => {
      this.setState({
        isAnimating: false,
        isClosing: false,
      });
      this.props.onClose();
    });
  },

  onViewTransformed: function({translateY}) {
    this.state.pan.setValue(translateY);
    if (Math.abs(translateY) > 0) {
      if (!this.state.isPanning) {
        this.setState({
          isPanning: true,
        });
      }
    } else {
      if (this.state.isPanning) {
        this.setState({
          isPanning: false,
        });
      }
    }
  },

  onTransformGestureReleased: function({translateX, translateY}) {
    const { swipeToDismiss } = this.props;

    if(Math.abs(translateY) > DRAG_DISMISS_THRESHOLD && swipeToDismiss) {
      this.setState({
        isPanning: false,
        target: {
          y: translateY,
          x: translateX,
          opacity: 1 - Math.abs(translateY / WINDOW_HEIGHT)
        }
      });
      this.close();
    } else {
      Animated.spring(
        this.state.pan,
        {toValue: 0, ...this.props.springConfig}
      ).start(() => { this.setState({ isPanning: false }); });
    }
  },

  componentWillReceiveProps: function(props) {
    if(this.props.isOpen != props.isOpen && props.isOpen) {
      this.open();
    }
  },

  render: function() {
    var {
      isOpen,
      renderHeader,
      swipeToDismiss,
      pinchToZoom,
      origin,
      backgroundColor,
    } = this.props;

    var {
      isPanning,
      isAnimating,
      openVal,
      target,
    } = this.state;


    var lightboxOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    };

    var dragStyle;
    if(isPanning) {
      dragStyle = {
        top: this.state.pan,
      };
      lightboxOpacityStyle.opacity = this.state.pan.interpolate({inputRange: [-WINDOW_HEIGHT, 0, WINDOW_HEIGHT], outputRange: [0, 1, 0]});
    }

    var openStyle = [styles.open, {
      left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y, target.y]}),
      width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
    }];

    var background = (<Animated.View style={[styles.background, { backgroundColor: backgroundColor }, lightboxOpacityStyle]}></Animated.View>);
    var header = (<Animated.View style={[styles.header, lightboxOpacityStyle]}>{(renderHeader ?
      renderHeader(this.close) :
      (
        <TouchableOpacity onPress={this.close}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      )
    )}</Animated.View>);

    var content;

    if (this.state.isClosing || !pinchToZoom) {
      content = this.props.children;
    } else {
      content = (
        <ViewTransformer
          style={{flex: 1}}
          enableTransform={true}
          enableScale={true}
          enableTranslate={true}
          enableResistance={true}
          maxScale={3}
          onTransformGestureReleased={this.onTransformGestureReleased}
          onViewTransformed={this.onViewTransformed}
        >
          {this.props.children}
        </ViewTransformer>
      );
    }

    return (
      <Modal visible={isOpen} transparent={true}>
        {background}
        <Animated.View style={[openStyle, dragStyle]} >
          {content}
        </Animated.View>
        {header}
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  open: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    // Android pan handlers crash without this declaration:
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    backgroundColor: 'transparent',
  },
  closeButton: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
});

module.exports = LightboxOverlay;
