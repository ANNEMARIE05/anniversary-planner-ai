import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

export type ExpressionMascotte =
  | 'joyeux'
  | 'triste'
  | 'clin'
  | 'lunettes'
  | 'surpris'
  | 'charge'
  | 'fete'
  | 'coeur';

type Props = {
  expression?: ExpressionMascotte;
  taille?: number;
  anime?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Mascotte Anniv (SVG) — portée depuis le projet Anniv. */
export function StickerMascotte({
  expression = 'joyeux',
  taille = 112,
  anime = true,
  style,
}: Props) {
  const y = useSharedValue(0);
  const rotate = useSharedValue(-6);
  const scale = useSharedValue(1);
  const x = useSharedValue(0);

  useEffect(() => {
    if (!anime) {
      rotate.value = -6;
      return;
    }

    if (expression === 'charge') {
      x.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(-6, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      );
      return;
    }

    if (expression === 'fete') {
      rotate.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 520, easing: Easing.inOut(Easing.sin) }),
          withTiming(-8, { duration: 520, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 520, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.96, { duration: 520, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      );
      return;
    }

    y.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(-4, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
  }, [anime, expression, rotate, scale, x, y]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { translateX: x.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.ombre,
        { width: taille, height: taille, borderRadius: taille / 2 },
        anim,
        style,
      ]}>
      <View style={{ width: taille, height: taille }}>
        <Svg width={taille} height={taille} viewBox="0 0 160 160">
          <Circle cx="80" cy="86" r="64" fill="#FFFFFF" />
          <Circle cx="80" cy="86" r="64" fill="none" stroke="#F15B62" strokeWidth="7" />
          <Path d="M48 38 L112 38 L80 6 Z" fill="#F15B62" />
          <Circle cx="80" cy="10" r="8" fill="#FFD6D0" />
          <Circle cx="80" cy="10" r="4" fill="#FFFFFF" />
          <Ellipse cx="52" cy="108" rx="10" ry="6" fill="#FFD6D0" />
          <Ellipse cx="108" cy="108" rx="10" ry="6" fill="#FFD6D0" />
          <Visage expression={expression} />
        </Svg>
      </View>
    </Animated.View>
  );
}

function Visage({ expression }: { expression: ExpressionMascotte }) {
  if (expression === 'lunettes') {
    return (
      <G>
        <Ellipse cx="58" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Ellipse cx="102" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Rect x="40" y="78" width="36" height="18" rx="8" fill="#1F1220" />
        <Rect x="84" y="78" width="36" height="18" rx="8" fill="#1F1220" />
        <Path d="M76 86 H84" stroke="#1F1220" strokeWidth="4" strokeLinecap="round" />
        <Path
          d="M62 118 Q80 128 98 118"
          stroke="#F15B62"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'coeur') {
    return (
      <G>
        <Ellipse cx="58" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Ellipse cx="102" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Path
          d="M50 86 C50 78 62 78 58 88 C54 78 66 78 66 86 C66 94 58 100 58 100 C58 100 50 94 50 86 Z"
          fill="#F15B62"
        />
        <Path
          d="M94 86 C94 78 106 78 102 88 C98 78 110 78 110 86 C110 94 102 100 102 100 C102 100 94 94 94 86 Z"
          fill="#F15B62"
        />
        <Path
          d="M62 118 Q80 130 98 118"
          stroke="#F15B62"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'clin') {
    return (
      <G>
        <Path d="M42 86 Q58 76 74 86" stroke="#1F1220" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Ellipse cx="102" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Circle cx="104" cy="88" r="8" fill="#1F1220" />
        <Circle cx="107" cy="84" r="3" fill="#FFFFFF" />
        <Path
          d="M64 116 Q80 128 100 114"
          stroke="#F15B62"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'triste') {
    return (
      <G>
        <Ellipse cx="58" cy="90" rx="18" ry="20" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Ellipse cx="102" cy="90" rx="18" ry="20" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Circle cx="58" cy="96" r="7" fill="#1F1220" />
        <Circle cx="102" cy="96" r="7" fill="#1F1220" />
        <Circle cx="61" cy="93" r="2.5" fill="#FFFFFF" />
        <Circle cx="105" cy="93" r="2.5" fill="#FFFFFF" />
        <Path
          d="M64 126 Q80 116 96 126"
          stroke="#F15B62"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M118 100 C118 110 112 116 112 122"
          stroke="#7DD3FC"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="112" cy="126" r="4" fill="#7DD3FC" />
      </G>
    );
  }

  if (expression === 'surpris') {
    return (
      <G>
        <Ellipse cx="58" cy="84" rx="20" ry="24" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Ellipse cx="102" cy="84" rx="20" ry="24" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
        <Circle cx="58" cy="86" r="9" fill="#1F1220" />
        <Circle cx="102" cy="86" r="9" fill="#1F1220" />
        <Circle cx="62" cy="81" r="3" fill="#FFFFFF" />
        <Circle cx="106" cy="81" r="3" fill="#FFFFFF" />
        <Ellipse cx="80" cy="122" rx="8" ry="10" fill="#1F1220" />
      </G>
    );
  }

  return (
    <G>
      <Ellipse cx="58" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
      <Ellipse cx="102" cy="86" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3" />
      <Circle cx="60" cy="90" r="8" fill="#1F1220" />
      <Circle cx="104" cy="90" r="8" fill="#1F1220" />
      <Circle cx="63" cy="86" r="3" fill="#FFFFFF" />
      <Circle cx="107" cy="86" r="3" fill="#FFFFFF" />
      {expression === 'charge' ? (
        <Ellipse cx="80" cy="120" rx="7" ry="5" fill="#F15B62" />
      ) : (
        <Path
          d="M62 118 Q80 130 98 118"
          stroke="#F15B62"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {expression === 'fete' ? (
        <G>
          <Circle cx="28" cy="48" r="5" fill="#FBBF24" />
          <Circle cx="132" cy="56" r="5" fill="#34D399" />
          <Circle cx="24" cy="108" r="4" fill="#60A5FA" />
          <Circle cx="136" cy="118" r="4" fill="#F472B6" />
        </G>
      ) : null}
    </G>
  );
}

const styles = StyleSheet.create({
  ombre: {
    backgroundColor: 'transparent',
    shadowColor: '#F15B62',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
