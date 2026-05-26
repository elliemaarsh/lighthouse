import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function MoodWidget() {
  return (
    <WidgetDecoratedShell label="MOOD" arcRx={56}>
      <Text style={widgetText.valueHero}>Calm</Text>
      <WidgetAccentLine width={20} />
      <Text style={widgetText.caption}>Logged today</Text>
    </WidgetDecoratedShell>
  );
}
