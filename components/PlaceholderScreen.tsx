import { Text, View } from 'react-native';

import { colors, fontSizes } from '@/constants/theme';

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text
        style={{
          fontSize: fontSizes.h1,
          color: colors.textPrimary,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
