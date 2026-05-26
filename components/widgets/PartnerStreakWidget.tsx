import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function PartnerStreakWidget() {
  return (
    <WidgetDecoratedShell label="STREAK">
      <Text style={widgetText.valueHero}>12</Text>
      <WidgetAccentLine width={22} />
      <Text style={widgetText.muted}>days you&apos;ve both logged</Text>
    </WidgetDecoratedShell>
  );
}
