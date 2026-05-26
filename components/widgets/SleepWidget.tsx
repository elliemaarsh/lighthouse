import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function SleepWidget() {
  return (
    <WidgetDecoratedShell label="SLEEP">
      <Text style={widgetText.valueHero}>7.5</Text>
      <WidgetAccentLine width={20} />
      <Text style={widgetText.muted}>hours last night</Text>
    </WidgetDecoratedShell>
  );
}
