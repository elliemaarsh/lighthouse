import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { Text } from 'react-native';

export function ExerciseWidget() {
  return (
    <WidgetDecoratedShell label="EXERCISE" arcRx={52}>
      <Text style={widgetText.valueMedium}>30 min walk</Text>
      <WidgetAccentLine width={24} />
      <Text style={widgetText.muted}>Moderate activity · logged today</Text>
    </WidgetDecoratedShell>
  );
}
