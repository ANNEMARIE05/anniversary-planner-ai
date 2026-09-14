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
import { PhotoMasquee, softRingRadius } from '@/components/ui/photo-masquee';
import { StickerTheme } from '@/components/ui/sticker-theme';
import {
  CARTE_FONDS,
  resolveCarteRadius,
  resolveCarteStickers,
  STICKER_SLOTS,
  type CarteFormeId,
  type CarteThemeId,
  type PhotoFormeId,
  Fonts,
  Radius,
} from '@/constants/theme';
import type { CartePersonnalisation } from '@/types/anniversaire';

function layoutMessage(text: string, compact?: boolean) {
  const n = text.length;
  if (n > 360) {
    return {
      fontSize: compact ? 13 : 15,
      lineHeight: compact ? 19 : 23,
      photo: compact ? 72 : 96,
    };
  }
  if (n > 220) {
    return {
      fontSize: compact ? 14 : 16,
      lineHeight: compact ? 21 : 25,
      photo: compact ? 80 : 104,
    };
  }
  return {
    fontSize: compact ? 15 : 17,
    lineHeight: compact ? 23 : 27,
    photo: compact ? 88 : 112,
  };
}

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

function SoftRing({
  color,
  size,
  forme = 'cercle',
}: {
  color: string;
  size: number;
  forme?: PhotoFormeId;
}) {
  const s = useSharedValue(0.92);
  const o = useSharedValue(0.25);
  const ringSize = size + 18;
  const radius = softRingRadius(forme, ringSize);

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

  // Anneau animé seulement pour les formes à coins arrondis (View)
  if (forme === 'triangle' || forme === 'losange' || forme === 'hexagone') {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: ringSize,
          height: ringSize,
          borderRadius: radius,
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
    const hasPhoto = showPhoto && Boolean(cardPhoto);
    const displayMessage = personalisation?.messagePerso?.trim() || message;
    const titre =
      personalisation?.titre === undefined
        ? 'Joyeux anniversaire'
        : personalisation.titre.trim();
    const signature = personalisation?.signature?.trim() ?? '';
    const fullName = `${prenom}${nom ? ` ${nom}` : ''}`.trim();
    const stickers = resolveCarteStickers(themeId, personalisation?.stickers);
    const photoStickers = personalisation?.photoStickers ?? [];
    const photoForme: PhotoFormeId = personalisation?.photoForme ?? 'cercle';
    const photoStickersForme: PhotoFormeId =
      personalisation?.photoStickersForme ?? 'cercle';
    const carteForme: CarteFormeId = personalisation?.carteForme ?? 'arrondie';
    const cardRadius = resolveCarteRadius(carteForme);
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

    const fallback = 'Que cette journée soit remplie de joie et de beaux souvenirs.';
    const body = displayMessage || fallback;
    const layout = layoutMessage(body, compact);
    const photoSize = layout.photo;
    const couleurTitre = personalisation?.couleurTitre || fond.accent;
    const couleurNom = personalisation?.couleurNom || fond.text;
    const couleurMessage = personalisation?.couleurMessage || fond.muted;
    const couleurSignature = personalisation?.couleurSignature || fond.accent;
    const titreGras = personalisation?.titreGras !== false;
    const messageGras = personalisation?.messageGras === true;
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
          style={[
            styles.shot,
            compact && styles.shotCompact,
            { borderRadius: cardRadius },
          ]}>
          <View
            style={[
              styles.card,
              compact ? styles.cardCompact : styles.cardFixed,
              { borderRadius: cardRadius },
            ]}>
            <Image source={fond.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.veil} />
            <Animated.View pointerEvents="none" style={[styles.shimmerBand, shimmerAnim]} />

            <Sparkle delay={200} left={32} top={40} color={fond.accent} size={6} />
            <Sparkle delay={800} left={compact ? 248 : 280} top={52} color="#F5B942" size={5} />

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
                    <PhotoMasquee
                      uri={photoUriSlot}
                      size={size + 8}
                      forme={photoStickersForme}
                      borderColor="#FFF"
                      borderWidth={2}
                    />
                  ) : stickerId ? (
                    <StickerTheme id={stickerId} size={size} />
                  ) : null}
                </View>
              );
            })}

            <View style={styles.content}>
              {titre ? (
                <Animated.Text
                  entering={FadeInDown.delay(120).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                  style={[
                    styles.title,
                    {
                      color: couleurTitre,
                      fontFamily: titreGras ? Fonts.extraBold : Fonts.medium,
                    },
                  ]}>
                  {titre}
                </Animated.Text>
              ) : null}

              {hasPhoto ? (
                <Animated.View style={[styles.photoStage, photoAnim]}>
                  <SoftRing color={fond.accent} size={photoSize} forme={photoForme} />
                  <PhotoMasquee
                    uri={cardPhoto!}
                    size={photoSize}
                    forme={photoForme}
                    borderColor={fond.accent}
                    borderWidth={3}
                  />
                </Animated.View>
              ) : null}

              {fullName ? (
                <Animated.Text
                  entering={FadeInDown.delay(220).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                  style={[styles.name, { color: couleurNom, fontFamily: Fonts.extraBold }]}>
                  {fullName}
                </Animated.Text>
              ) : null}

              <Animated.Text
                entering={FadeInDown.delay(320).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                style={[
                  styles.message,
                  {
                    color: couleurMessage,
                    fontSize: layout.fontSize,
                    lineHeight: layout.lineHeight,
                    fontFamily: messageGras ? Fonts.bold : Fonts.medium,
                  },
                ]}>
                {body}
              </Animated.Text>

              {signature ? (
                <Animated.Text
                  entering={FadeInDown.delay(400).springify().damping(16).reduceMotion(ReduceMotion.Never)}
                  style={[
                    styles.signature,
                    { color: couleurSignature, fontFamily: Fonts.semibold },
                  ]}>
                  {signature}
                </Animated.Text>
              ) : null}
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
    overflow: 'hidden',
    shadowColor: '#F15B62',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  shotCompact: {},
  card: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFCF8',
  },
  cardFixed: {
    minHeight: 480,
  },
  cardCompact: {
    minHeight: 340,
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
    paddingHorizontal: 28,
    paddingVertical: 36,
    gap: 16,
    zIndex: 3,
  },
  title: {
    fontSize: 22,
    letterSpacing: -0.3,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  photoStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
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
    fontSize: 28,
    letterSpacing: -0.5,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  message: {
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
  signature: {
    fontSize: 16,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop: 4,
  },
  sparkle: {
    position: 'absolute',
    borderRadius: 1,
    zIndex: 3,
  },
  stickerSlot: {
    position: 'absolute',
    zIndex: 4,
  },
});
