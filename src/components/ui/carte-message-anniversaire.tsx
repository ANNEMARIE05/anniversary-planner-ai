import { Image } from 'expo-image';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';

import { AppIcon } from '@/components/ui/app-icon';
import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { StickerTheme } from '@/components/ui/sticker-theme';
import {
  CARTE_FONDS,
  resolveCarteStickers,
  STICKER_SLOTS,
  type CarteThemeId,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { CartePersonnalisation } from '@/types/anniversaire';

export type CarteCaptureHandle = {
  capture: () => Promise<string | undefined>;
};

type Props = {
  prenom: string;
  nom?: string;
  message: string;
  photoUri?: string;
  personalisation?: CartePersonnalisation;
  onCustomize?: () => void;
  compact?: boolean;
  captureMode?: boolean;
};

function Sparkle({
  delay,
  left,
  top,
  color,
  size = 7,
}: {
  delay: number;
  left: number;
  top: number;
  color: string;
  size?: number;
}) {
  const o = useSharedValue(0.15);
  const s = useSharedValue(0.55);
  const r = useSharedValue(45);

  useEffect(() => {
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 1000 }), withTiming(0.12, { duration: 1000 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    s.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1.35, { duration: 1000 }), withTiming(0.55, { duration: 1000 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    r.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(55, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(35, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
  }, [delay, o, r, s]);

  const anim = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ scale: s.value }, { rotate: `${r.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.sparkle,
        { left, top, backgroundColor: color, width: size, height: size },
        anim,
      ]}
    />
  );
}

function FloatingConfetti({
  delay,
  left,
  color,
  size = 8,
}: {
  delay: number;
  left: `${number}%`;
  color: string;
  size?: number;
}) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const r = useSharedValue(0);
  const o = useSharedValue(0.5);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(18, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
          withTiming(-14, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    x.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(8, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
          withTiming(-6, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    r.value = withRepeat(
      withTiming(360, { duration: 7000, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.9, { duration: 1600 }), withTiming(0.35, { duration: 1600 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
  }, [delay, o, r, x, y]);

  const anim = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateY: y.value }, { translateX: x.value }, { rotate: `${r.value}deg` }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left, top: '16%', zIndex: 2 }, anim]}>
      <View style={[styles.confetti, { backgroundColor: color, width: size, height: size }]} />
    </Animated.View>
  );
}

function SoftRing({ color, size }: { color: string; size: number }) {
  const s = useSharedValue(0.92);
  const o = useSharedValue(0.25);

  useEffect(() => {
    s.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.92, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    o.value = withRepeat(
      withSequence(withTiming(0.45, { duration: 1800 }), withTiming(0.18, { duration: 1800 })),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
  }, [o, s]);

  const anim = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ scale: s.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size + 18,
          height: size + 18,
          borderRadius: (size + 18) / 2,
          borderColor: color,
        },
        anim,
      ]}
    />
  );
}

export const CarteMessageAnniversaire = forwardRef<CarteCaptureHandle, Props>(
  function CarteMessageAnniversaire(
    { prenom, nom, message, photoUri, personalisation, onCustomize, compact, captureMode },
    ref,
  ) {
    const cardRef = useRef<View>(null);
    const isPerso =
      personalisation?.theme === 'perso' && Boolean(personalisation?.fondPersoUri);
    const themeId: CarteThemeId = isPerso
      ? 'perso'
      : personalisation?.theme && CARTE_FONDS.some((t) => t.id === personalisation.theme)
        ? personalisation.theme
        : 'pastel';
    const fond =
      themeId === 'perso'
        ? {
            id: 'perso' as const,
            label: 'Ma photo',
            image: { uri: personalisation!.fondPersoUri! },
            text: '#2A2A2A',
            muted: '#5A5A5A',
            accent: '#F15B62',
          }
        : (CARTE_FONDS.find((t) => t.id === themeId) ?? CARTE_FONDS[0]);
    const showPhoto = personalisation?.showPhoto !== false;
    const cardPhoto = personalisation?.photoUri || photoUri;
    const displayMessage = personalisation?.messagePerso?.trim() || message;
    const fullName = `${prenom}${nom ? ` ${nom}` : ''}`.trim();
    const stickers = resolveCarteStickers(themeId, personalisation?.stickers);
    const photoStickers = personalisation?.photoStickers ?? [];
    const photoEnter = useSharedValue(0.86);
    const veilShimmer = useSharedValue(0);

    useEffect(() => {
      photoEnter.value = withSpring(1, { damping: 14, stiffness: 120, reduceMotion: ReduceMotion.Never });
      veilShimmer.value = withRepeat(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
        -1,
        false,
        undefined,
        ReduceMotion.Never,
      );
    }, [photoEnter, veilShimmer]);

    useImperativeHandle(ref, () => ({
      capture: async () => {
        try {
          if (!cardRef.current) return undefined;
          return await captureRef(cardRef, {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          });
        } catch {
          return undefined;
        }
      },
    }));

    const photoSize = compact ? 88 : 118;
    const photoAnim = useAnimatedStyle(() => ({
      transform: [{ scale: photoEnter.value }],
    }));
    const shimmerAnim = useAnimatedStyle(() => ({
      opacity: interpolate(veilShimmer.value, [0, 0.45, 0.7, 1], [0, 0.18, 0.08, 0]),
      transform: [
        { translateX: interpolate(veilShimmer.value, [0, 1], [-100, 260]) },
        { skewX: '-16deg' },
      ],
    }));

    return (
      <Animated.View
        entering={FadeInDown.springify().damping(15).stiffness(110).reduceMotion(ReduceMotion.Never)}>
        {!captureMode && onCustomize ? (
          <View style={styles.toolbar}>
            <Pressable onPress={onCustomize} style={styles.toolBtn} hitSlop={8}>
              <AppIcon name="edit" size={14} color={fond.accent} />
              <Text style={[styles.toolLabel, { color: fond.accent }]}>Personnaliser</Text>
            </Pressable>
          </View>
        ) : null}

        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.shot, compact && styles.shotCompact]}>
          <View style={[styles.card, compact && styles.cardCompact]}>
            <Image source={fond.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.veil} />
            <Animated.View pointerEvents="none" style={[styles.shimmerBand, shimmerAnim]} />

            <Sparkle delay={0} left={28} top={36} color={fond.accent} size={8} />
            <Sparkle delay={350} left={compact ? 250 : 286} top={44} color="#F5B942" size={6} />
            <Sparkle delay={700} left={48} top={compact ? 270 : 350} color="#FF8A65" size={7} />
            <Sparkle delay={180} left={compact ? 230 : 268} top={compact ? 290 : 370} color={fond.accent} />
            <Sparkle delay={900} left={compact ? 140 : 160} top={58} color="#F5B942" size={5} />
            <FloatingConfetti delay={0} left="10%" color="rgba(241,91,98,0.55)" />
            <FloatingConfetti delay={400} left="78%" color="rgba(245,185,66,0.6)" size={7} />
            <FloatingConfetti delay={800} left="48%" color="rgba(255,138,101,0.5)" size={6} />
            <FloatingConfetti delay={1100} left="28%" color="rgba(241,91,98,0.35)" size={5} />

            {STICKER_SLOTS.map((slot, index) => {
              const photoUriSlot = photoStickers[index];
              const stickerId = stickers[index];
              if (!photoUriSlot && !stickerId) return null;
              const size = compact ? 36 : 46;
              return (
                <View
                  key={`slot-${index}`}
                  pointerEvents="none"
                  style={[
                    styles.stickerSlot,
                    {
                      left: 'left' in slot ? slot.left : undefined,
                      right: 'right' in slot ? slot.right : undefined,
                      top: 'top' in slot ? slot.top : undefined,
                      bottom: 'bottom' in slot ? slot.bottom : undefined,
                      transform: [{ rotate: `${slot.rotate}deg` }],
                    },
                  ]}>
                  {photoUriSlot ? (
                    <Image
                      source={{ uri: photoUriSlot }}
                      style={{
                        width: size + 8,
                        height: size + 8,
                        borderRadius: (size + 8) / 2,
                        borderWidth: 2,
                        borderColor: '#FFF',
                      }}
                      contentFit="cover"
                    />
                  ) : stickerId ? (
                    <StickerTheme id={stickerId} size={size} />
                  ) : null}
                </View>
              );
            })}

            <View style={styles.content}>
              <Animated.Text
                entering={FadeInDown.delay(120).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                style={[styles.kicker, { color: fond.accent }]}>
                Joyeux anniversaire
              </Animated.Text>

              <Animated.View style={[styles.photoStage, photoAnim]}>
                <SoftRing color={fond.accent} size={photoSize} />
                {showPhoto && cardPhoto ? (
                  <Image
                    source={{ uri: cardPhoto }}
                    style={[
                      styles.photo,
                      {
                        width: photoSize,
                        height: photoSize,
                        borderRadius: photoSize / 2,
                        borderColor: fond.accent,
                      },
                    ]}
                    contentFit="cover"
                  />
                ) : (
                  <StickerMascotte
                    expression="fete"
                    taille={photoSize * 1.22}
                    anime={!captureMode && !compact}
                  />
                )}
              </Animated.View>

              <Animated.Text
                entering={FadeInDown.delay(220).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                style={[styles.name, { color: fond.text }]}
                numberOfLines={1}>
                {fullName}
              </Animated.Text>

              <Animated.Text
                entering={FadeInDown.delay(320).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                style={[styles.message, { color: fond.muted }]}
                numberOfLines={compact ? 3 : 5}>
                {displayMessage || 'Que cette journée soit remplie de joie et de beaux souvenirs.'}
              </Animated.Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(241,91,98,0.1)',
  },
  toolLabel: { fontSize: 13, fontWeight: '700' },
  shot: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: '#F15B62',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  shotCompact: {},
  card: {
    aspectRatio: 3 / 4.2,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFCF8',
  },
  cardCompact: {
    aspectRatio: 3 / 3.8,
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,252,248,0.28)',
  },
  shimmerBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 64,
    backgroundColor: 'rgba(255,255,255,0.55)',
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.two,
    zIndex: 3,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  photoStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.two,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  photo: {
    borderWidth: 3,
    backgroundColor: '#FFF',
  },
  photoPlaceholder: {
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 260,
  },
  sparkle: {
    position: 'absolute',
    borderRadius: 1,
    zIndex: 3,
  },
  confetti: {
    borderRadius: 2,
  },
  stickerSlot: {
    position: 'absolute',
    zIndex: 4,
  },
});
