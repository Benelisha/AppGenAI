const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
const Reanimated = require('react-native-reanimated');

module.exports = function SimpleReanimatedDemo() {
  // Shared values for animations
  const opacity = Reanimated.useSharedValue(1);
  const scale = Reanimated.useSharedValue(1);
  const translateY = Reanimated.useSharedValue(0);

  // Animated styles
  const animatedStyle = Reanimated.useAnimatedStyle(function() {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  function handlePress() {
    // Sequence of animations: bounce, fade, and float
    scale.value = Reanimated.withSequence(
      Reanimated.withTiming(1.2, { duration: 200 }),
      Reanimated.withSpring(1, { damping: 8 })
    );
    
    opacity.value = Reanimated.withSequence(
      Reanimated.withTiming(0.5, { duration: 300 }),
      Reanimated.withTiming(1, { duration: 300 })
    );
    
    translateY.value = Reanimated.withSequence(
      Reanimated.withSpring(-20, { damping: 10 }),
      Reanimated.withSpring(0, { damping: 10 })
    );
  }

  function handleReset() {
    opacity.value = Reanimated.withTiming(1, { duration: 300 });
    scale.value = Reanimated.withTiming(1, { duration: 300 });
    translateY.value = Reanimated.withTiming(0, { duration: 300 });
  }

  return React.createElement(View, { style: styles.container },
    React.createElement(Text, { style: styles.title }, 
      '✨ Simple Reanimated Demo'
    ),
    
    React.createElement(Text, { style: styles.description },
      'Tap the animated box to see smooth animations!'
    ),
    
    React.createElement(View, { style: styles.animationArea },
      React.createElement(TouchableOpacity, { 
        onPress: handlePress,
        activeOpacity: 0.8
      },
        React.createElement(Reanimated.View, { 
          style: [styles.animatedBox, animatedStyle] 
        },
          React.createElement(Text, { style: styles.boxText }, '🎭'),
          React.createElement(Text, { style: styles.boxSubtext }, 'Tap me!')
        )
      )
    ),
    
    React.createElement(View, { style: styles.controls },
      React.createElement(TouchableOpacity, { 
        style: styles.button, 
        onPress: handlePress 
      },
        React.createElement(Text, { style: styles.buttonText }, 'Animate!')
      ),
      
      React.createElement(TouchableOpacity, { 
        style: [styles.button, styles.resetButton], 
        onPress: handleReset 
      },
        React.createElement(Text, { style: styles.buttonText }, 'Reset')
      )
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1e293b',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#64748b',
  },
  animationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBox: {
    width: 120,
    height: 120,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  boxText: {
    fontSize: 32,
    marginBottom: 5,
  },
  boxSubtext: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 120,
  },
  resetButton: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
