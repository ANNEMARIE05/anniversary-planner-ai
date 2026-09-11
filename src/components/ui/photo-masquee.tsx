import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Polygon, Rect } from 'react-native-svg';

import type { PhotoFormeId } from '@/constants/theme';

type Props = {
  uri: string;
  size: number;
  forme?: PhotoFormeId;
  borderColor?: string;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
};

function polygonPoints(forme: PhotoFormeId, size: number, inset = 0): string {
  const s = size;
  const i = inset;
  const m = s / 2;

  switch (forme) {
    case 'triangle':
      return `${m},${i} ${s - i},${s - i} ${i},${s - i}`;
    case 'losange':
      return `${m},${i} ${s - i},${m} ${m},${s - i} ${i},${m}`;
    case 'hexagone': {
      const w = (s - i * 2) * 0.25;
      return [
        `${m},${i}`,
        `${s - i},${i + w}`,
        `${s - i},${s - i - w}`,
        `${m},${s - i}`,
        `${i},${s - i - w}`,
        `${i},${i + w}`,
      ].join(' ');
    }
    default:
      return '';
  }
}

function isPolygon(forme: PhotoFormeId): boolean {
  return forme === 'triangle' || forme === 'losange' || forme === 'hexagone';
}

function radiusFor(forme: PhotoFormeId, size: number): number {
  switch (forme) {
    case 'cercle':
      return size / 2;
    case 'carre':
      return 2;
    case 'arrondi':
      return Math.max(10, size * 0.22);
    default:
      return 0;
  }
}

function ShapeMask({ forme, size }: { forme: PhotoFormeId; size: number }) {
  if (forme === 'cercle') {
    return (
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="#000" />
      </Svg>
    );
  }

  if (forme === 'carre' || forme === 'arrondi') {
    const r = radiusFor(forme, size);
    return (
      <Svg width={size} height={size}>
        <Rect x={0} y={0} width={size} height={size} rx={r} ry={r} fill="#000" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size}>
      <Polygon points={polygonPoints(forme, size)} fill="#000" />
    </Svg>
  );
}

function ShapeBorder({
  forme,
  size,
  color,
  strokeWidth,
}: {
  forme: PhotoFormeId;
  size: number;
  color: string;
  strokeWidth: number;
}) {
  if (strokeWidth <= 0) return null;
  const inset = strokeWidth / 2;

  if (forme === 'cercle') {
    return (
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
        pointerEvents="none">
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - inset}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  }

  if (forme === 'carre' || forme === 'arrondi') {
    const r = Math.max(0, radiusFor(forme, size) - inset);
    return (
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
        pointerEvents="none">
        <Rect
          x={inset}
          y={inset}
          width={size - strokeWidth}
          height={size - strokeWidth}
          rx={r}
          ry={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none">
      <Polygon
        points={polygonPoints(forme, size, inset)}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Photo découpée dans une forme (cercle, carré, triangle, losange…).
 * Utilise MaskedView + expo-image pour un rendu fiable (URIs locales incluses).
 */
export function PhotoMasquee({
  uri,
  size,
  forme = 'cercle',
  borderColor = '#FFF',
  borderWidth = 2,
  style,
}: Props) {
  if (!uri) return null;

  // Formes simples : overflow + borderRadius (plus performant, toujours visible)
  if (!isPolygon(forme)) {
    const radius = radiusFor(forme, size);
    return (
      <View style={[{ width: size, height: size }, style]}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            overflow: 'hidden',
            backgroundColor: '#EEE',
          }}>
          <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: radius }}
            contentFit="cover"
            recyclingKey={uri}
          />
        </View>
        <ShapeBorder forme={forme} size={size} color={borderColor} strokeWidth={borderWidth} />
      </View>
    );
  }

  return (
    <View style={[{ width: size, height: size }, style]}>
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={
          <View style={{ width: size, height: size, backgroundColor: 'transparent' }}>
            <ShapeMask forme={forme} size={size} />
          </View>
        }>
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          recyclingKey={uri}
        />
      </MaskedView>
      <ShapeBorder forme={forme} size={size} color={borderColor} strokeWidth={borderWidth} />
    </View>
  );
}

/** Aperçu miniature de la forme (pour le sélecteur) */
export function FormeApercu({
  forme,
  size = 36,
  color,
}: {
  forme: PhotoFormeId;
  size?: number;
  color: string;
}) {
  if (isPolygon(forme)) {
    return (
      <Svg width={size} height={size}>
        <Polygon points={polygonPoints(forme, size, 2)} fill={color} />
      </Svg>
    );
  }

  if (forme === 'cercle') {
    return (
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill={color} />
      </Svg>
    );
  }

  const r = radiusFor(forme, size);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        backgroundColor: color,
      }}
    />
  );
}

export function softRingRadius(forme: PhotoFormeId | undefined, size: number): number {
  return radiusFor(forme ?? 'cercle', size);
}
