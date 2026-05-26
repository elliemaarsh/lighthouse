import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { DEFAULT_PARTNER_DAILY_STREAK } from '@/constants/partner';
import { Text } from 'react-native';

export function PartnerStreakWidget() {
  return (
    <WidgetDecoratedShell label="STREAK">
      <Text style={widgetText.valueHero}>{DEFAULT_PARTNER_DAILY_STREAK}</Text>
      <WidgetAccentLine width={22} />
      <Text style={widgetText.muted}>days you&apos;ve both logged</Text>
    </WidgetDecoratedShell>
  );
}
