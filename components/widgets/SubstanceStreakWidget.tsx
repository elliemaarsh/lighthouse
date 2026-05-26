import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function SubstanceStreakWidget() {
  return (
    <WidgetDecoratedShell label="SUBSTANCE STREAK">
      <Text style={widgetText.valueHero}>18</Text>
      <WidgetAccentLine width={26} />
      <Text style={widgetText.muted}>days alcohol-free</Text>
    </WidgetDecoratedShell>
  );
}
