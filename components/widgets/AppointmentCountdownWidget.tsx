import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function AppointmentCountdownWidget() {
  return (
    <WidgetDecoratedShell label="NEXT APPOINTMENT">
      <Text style={widgetText.valueHero}>3</Text>
      <WidgetAccentLine width={20} />
      <Text style={widgetText.muted}>days until monitoring</Text>
    </WidgetDecoratedShell>
  );
}
