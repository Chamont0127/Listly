import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { ListItem } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_SIZE = Math.min(SCREEN_WIDTH * 0.8, 300); // Square card, max 300px
const SWIPE_THRESHOLD = CARD_SIZE * 0.3;

interface SwipeableCardProps {
  item: ListItem;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  progress: number;
}

export function SwipeableCard({ item, onSwipeRight, onSwipeLeft, progress }: SwipeableCardProps) {
  const { theme, isDark } = useTheme();
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 10;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - add to list
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        rotate.value = withSpring(20);
        runOnJS(onSwipeRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left - skip
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        rotate.value = withSpring(-20);
        runOnJS(onSwipeLeft)();
      } else {
        // Return to center
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? Math.min(translateX.value / SWIPE_THRESHOLD, 1) : 0;
    return { opacity };
  });

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1) : 0;
    return { opacity };
  });

  const textStyle = {
    color: theme.colors.text,
    ...(isDark && theme.colors.glow && {
      textShadowColor: theme.colors.glow,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 4,
    }),
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
            cardStyle,
          ]}
        >
          <Animated.View style={[styles.overlay, styles.rightOverlay, rightOverlayStyle]}>
            <Text style={[styles.overlayText, { color: '#00FF00' }]}>✓ ADD</Text>
          </Animated.View>
          <Animated.View style={[styles.overlay, styles.leftOverlay, leftOverlayStyle]}>
            <Text style={[styles.overlayText, { color: '#FF0000' }]}>✗ SKIP</Text>
          </Animated.View>
          <View style={styles.content}>
            <Text style={[styles.text, textStyle]}>{item.text}</Text>
            {item.priority && (
              <Text style={[styles.priority, { color: theme.colors.textSecondary }]}>
                Priority: {item.priority}
              </Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 } as any),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  rightOverlay: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  leftOverlay: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  priority: {
    fontSize: 14,
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
  },
});

