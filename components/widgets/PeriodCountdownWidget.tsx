import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function PeriodCountdownWidget() {
  return (
    <WidgetDecoratedShell label="PERIOD" arcRx={52}>
      <Text style={widgetText.valueHero}>12</Text>
      <WidgetAccentLine width={24} />
      <Text style={widgetText.caption}>days until next period</Text>
    </WidgetDecoratedShell>
  );
}
