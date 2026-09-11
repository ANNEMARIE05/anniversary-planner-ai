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

/** Capuche corail du bonhomme Anniv (illustration fournie). */
const HOOD = '#F07060';
const BLUSH = '#FFB6B0';

/** Mascotte Anniv — bonhomme à capuche corail + pompon blanc. */
export function StickerMascotte({
  expression = 'joyeux',
  taille = 128,
  anime = true,
  style,
}: Props) {
  const y = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const x = useSharedValue(0);

  useEffect(() => {
    if (!anime) {
      x.value = 0;
      y.value = 0;
      rotate.value = 0;
      scale.value = 1;
      return;
    }

    // Balancement doux gauche ↔ droite
    const amplitude = Math.min(6, Math.max(3.5, taille * 0.04));
    x.value = withRepeat(
      withSequence(
        withTiming(amplitude, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(-amplitude, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(2.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    y.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(2.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
  }, [anime, expression, rotate, scale, taille, x, y]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
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
          {/* Capuche épaisse (cercle + pointe) */}
          <Circle cx="80" cy="90" r="66" fill={HOOD} />
          <Path d="M46 42 Q80 4 114 42 Z" fill={HOOD} />
          {/* Pompon blanc */}
          <Circle cx="80" cy="12" r="10" fill="#FFFFFF" />
          {/* Visage blanc */}
          <Circle cx="80" cy="94" r="50" fill="#FFFFFF" />
          {/* Confettis sur la capuche */}
          <Circle cx="36" cy="72" r="5" fill="#FBBF24" />
          <Circle cx="40" cy="120" r="3.5" fill="#60A5FA" />
          <Circle cx="124" cy="80" r="4" fill="#34D399" />
          {/* Joues */}
          <Ellipse cx="50" cy="112" rx="10" ry="6" fill={BLUSH} opacity={0.9} />
          <Ellipse cx="110" cy="112" rx="10" ry="6" fill={BLUSH} opacity={0.9} />
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
        <Ellipse cx="58" cy="90" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Ellipse cx="102" cy="90" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Rect x="40" y="82" width="36" height="18" rx="8" fill="#1F1220" />
        <Rect x="84" y="82" width="36" height="18" rx="8" fill="#1F1220" />
        <Path d="M76 90 H84" stroke="#1F1220" strokeWidth="4" strokeLinecap="round" />
        <Path
          d="M64 122 Q80 130 96 122"
          stroke="#1F1220"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'coeur') {
    return (
      <G>
        <Ellipse cx="58" cy="90" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Ellipse cx="102" cy="90" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Path
          d="M50 90 C50 82 62 82 58 92 C54 82 66 82 66 90 C66 98 58 104 58 104 C58 104 50 98 50 90 Z"
          fill={HOOD}
        />
        <Path
          d="M94 90 C94 82 106 82 102 92 C98 82 110 82 110 90 C110 98 102 104 102 104 C102 104 94 98 94 90 Z"
          fill={HOOD}
        />
        <Path
          d="M64 122 Q80 132 96 122"
          stroke="#1F1220"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'clin') {
    return (
      <G>
        <Path d="M42 90 Q58 80 74 90" stroke="#1F1220" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Ellipse cx="102" cy="90" rx="18" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Circle cx="104" cy="92" r="9" fill="#1F1220" />
        <Circle cx="107" cy="87" r="3.2" fill="#FFFFFF" />
        <Path
          d="M64 120 Q80 132 100 118"
          stroke="#1F1220"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (expression === 'triste') {
    return (
      <G>
        <Ellipse cx="58" cy="94" rx="18" ry="20" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Ellipse cx="102" cy="94" rx="18" ry="20" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Circle cx="58" cy="100" r="7" fill="#1F1220" />
        <Circle cx="102" cy="100" r="7" fill="#1F1220" />
        <Circle cx="61" cy="97" r="2.5" fill="#FFFFFF" />
        <Circle cx="105" cy="97" r="2.5" fill="#FFFFFF" />
        <Path
          d="M64 130 Q80 120 96 130"
          stroke="#1F1220"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M118 104 C118 114 112 120 112 126"
          stroke="#7DD3FC"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="112" cy="130" r="4" fill="#7DD3FC" />
      </G>
    );
  }

  if (expression === 'surpris') {
    return (
      <G>
        <Ellipse cx="58" cy="88" rx="20" ry="24" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Ellipse cx="102" cy="88" rx="20" ry="24" fill="#FFFFFF" stroke="#1F1220" strokeWidth="3.5" />
        <Circle cx="58" cy="90" r="9" fill="#1F1220" />
        <Circle cx="102" cy="90" r="9" fill="#1F1220" />
        <Circle cx="62" cy="85" r="3" fill="#FFFFFF" />
        <Circle cx="106" cy="85" r="3" fill="#FFFFFF" />
        <Ellipse cx="80" cy="126" rx="8" ry="10" fill="#1F1220" />
      </G>
    );
  }

  // joyeux / fete / charge — grands yeux ronds + sourire fin (comme l’illustration)
  return (
    <G>
      <Ellipse cx="58" cy="90" rx="19" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="4" />
      <Ellipse cx="102" cy="90" rx="19" ry="22" fill="#FFFFFF" stroke="#1F1220" strokeWidth="4" />
      <Circle cx="60" cy="94" r="9" fill="#1F1220" />
      <Circle cx="104" cy="94" r="9" fill="#1F1220" />
      <Circle cx="64" cy="89" r="3.5" fill="#FFFFFF" />
      <Circle cx="108" cy="89" r="3.5" fill="#FFFFFF" />
      {expression === 'charge' ? (
        <Ellipse cx="80" cy="124" rx="7" ry="5" fill={HOOD} />
      ) : (
        <Path
          d="M64 122 Q80 134 96 122"
          stroke="#1F1220"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </G>
  );
}

const styles = StyleSheet.create({
  ombre: {
    backgroundColor: 'transparent',
    shadowColor: HOOD,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
