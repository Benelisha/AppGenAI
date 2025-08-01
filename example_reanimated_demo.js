const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet, Dimensions } = require('react-native');
const Reanimated = require('react-native-reanimated');

const { width } = Dimensions.get('window');

module.exports = function AnimationDemoApp() {
  // Shared values for animations
  const opacity = Reanimated.useSharedValue(0);
  const scale = Reanimated.useSharedValue(1);
  const translateX = Reanimated.useSharedValue(0);
  const rotate = Reanimated.useSharedValue(0);
  const backgroundColor = Reanimated.useSharedValue(0);

  // Animated styles
  const fadeAnimatedStyle = Reanimated.useAnimatedStyle(function() {
    return {
      opacity: opacity.value,
    };
  });

  const scaleAnimatedStyle = Reanimated.useAnimatedStyle(function() {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const moveAnimatedStyle = Reanimated.useAnimatedStyle(function() {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const rotateAnimatedStyle = Reanimated.useAnimatedStyle(function() {
    return {
      transform: [{ rotate: rotate.value + 'deg' }],
    };
  });

  const colorAnimatedStyle = Reanimated.useAnimatedStyle(function() {
    const interpolatedColor = Reanimated.interpolateColor(
      backgroundColor.value,
      [0, 1],
      ['#ff6b6b', '#4ecdc4']
    );
    return {
      backgroundColor: interpolatedColor,
    };
  });

  // Animation functions
  function handleFadeIn() {
    opacity.value = Reanimated.withTiming(1, { duration: 500 });
  }

  function handleFadeOut() {
    opacity.value = Reanimated.withTiming(0, { duration: 500 });
  }

  function handleBounceScale() {
    scale.value = Reanimated.withSequence(
      Reanimated.withTiming(1.2, { duration: 200 }),
      Reanimated.withSpring(1, { damping: 10 })
    );
  }

  function handleSlideRight() {
    translateX.value = Reanimated.withSpring(100, { damping: 12 });
  }

  function handleSlideLeft() {
    translateX.value = Reanimated.withSpring(-100, { damping: 12 });
  }

  function handleSlideCenter() {
    translateX.value = Reanimated.withSpring(0, { damping: 12 });
  }

  function handleRotate() {
    rotate.value = Reanimated.withTiming(rotate.value + 360, { duration: 1000 });
  }

  function handleColorChange() {
    backgroundColor.value = Reanimated.withTiming(
      backgroundColor.value === 0 ? 1 : 0,
      { duration: 500 }
    );
  }

  function handleShakeAnimation() {
    translateX.value = Reanimated.withRepeat(
      Reanimated.withSequence(
        Reanimated.withTiming(-20, { duration: 50 }),
        Reanimated.withTiming(20, { duration: 50 }),
        Reanimated.withTiming(-20, { duration: 50 }),
        Reanimated.withTiming(0, { duration: 50 })
      ),
      3,
      false
    );
  }

  function handlePulseAnimation() {
    scale.value = Reanimated.withRepeat(
      Reanimated.withSequence(
        Reanimated.withTiming(1.1, { duration: 500 }),
        Reanimated.withTiming(1, { duration: 500 })
      ),
      3,
      false
    );
  }

  return React.createElement(View, { style: styles.container },
    React.createElement(Text, { style: styles.title }, '🎨 React Native Reanimated Demo'),
    
    // Animated boxes
    React.createElement(View, { style: styles.animationContainer },
      React.createElement(Reanimated.View, { 
        style: [styles.animatedBox, fadeAnimatedStyle] 
      },
        React.createElement(Text, { style: styles.boxText }, 'Fade')
      ),
      
      React.createElement(Reanimated.View, { 
        style: [styles.animatedBox, scaleAnimatedStyle] 
      },
        React.createElement(Text, { style: styles.boxText }, 'Scale')
      ),
      
      React.createElement(Reanimated.View, { 
        style: [styles.animatedBox, moveAnimatedStyle] 
      },
        React.createElement(Text, { style: styles.boxText }, 'Move')
      ),
      
      React.createElement(Reanimated.View, { 
        style: [styles.animatedBox, rotateAnimatedStyle] 
      },
        React.createElement(Text, { style: styles.boxText }, 'Rotate')
      ),
      
      React.createElement(Reanimated.View, { 
        style: [styles.animatedBox, colorAnimatedStyle] 
      },
        React.createElement(Text, { style: styles.boxText }, 'Color')
      )
    ),
    
    // Control buttons
    React.createElement(View, { style: styles.controlsContainer },
      React.createElement(Text, { style: styles.sectionTitle }, 'Fade Controls'),
      React.createElement(View, { style: styles.buttonRow },
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleFadeIn 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Fade In')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleFadeOut 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Fade Out')
        )
      ),
      
      React.createElement(Text, { style: styles.sectionTitle }, 'Scale Controls'),
      React.createElement(View, { style: styles.buttonRow },
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleBounceScale 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Bounce Scale')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handlePulseAnimation 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Pulse')
        )
      ),
      
      React.createElement(Text, { style: styles.sectionTitle }, 'Movement Controls'),
      React.createElement(View, { style: styles.buttonRow },
        React.createElement(TouchableOpacity, { 
          style: styles.smallButton, 
          onPress: handleSlideLeft 
        },
          React.createElement(Text, { style: styles.buttonText }, '←')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.smallButton, 
          onPress: handleSlideCenter 
        },
          React.createElement(Text, { style: styles.buttonText }, '⚬')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.smallButton, 
          onPress: handleSlideRight 
        },
          React.createElement(Text, { style: styles.buttonText }, '→')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleShakeAnimation 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Shake')
        )
      ),
      
      React.createElement(Text, { style: styles.sectionTitle }, 'Other Controls'),
      React.createElement(View, { style: styles.buttonRow },
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleRotate 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Rotate')
        ),
        React.createElement(TouchableOpacity, { 
          style: styles.button, 
          onPress: handleColorChange 
        },
          React.createElement(Text, { style: styles.buttonText }, 'Color')
        )
      )
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  animationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 30,
    minHeight: 200,
  },
  animatedBox: {
    width: 60,
    height: 60,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    minWidth: 80,
  },
  smallButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    minWidth: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
