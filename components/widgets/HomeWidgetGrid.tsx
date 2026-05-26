import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckInCTAWidget } from '@/components/widgets/CheckInCTAWidget';
import { widgetHalf } from '@/components/widgets/widgetStyles';
import { renderWidget } from '@/components/widgets/widgetRegistry';
import { isHalfWidthWidget, type WidgetId } from '@/constants/widgets';
import { useWidgetStore } from '@/store/useWidgetStore';

/**
 * Pairs compact widgets two per row; buffers a lone half until the next half appears.
 */
function buildRows(ids: WidgetId[]): WidgetId[][] {
  const withoutCta = ids.filter((id) => id !== 'check-in-cta');
  const rows: WidgetId[][] = [];
  let halfPending: WidgetId[] = [];

  const flushHalfPair = () => {
    if (halfPending.length >= 2) {
      rows.push([halfPending.shift()!, halfPending.shift()!]);
    }
  };

  for (const id of withoutCta) {
    if (isHalfWidthWidget(id)) {
      halfPending.push(id);
      flushHalfPair();
    } else {
      flushHalfPair();
      rows.push([id]);
    }
  }

  flushHalfPair();
  if (halfPending.length === 1) {
    rows.push([halfPending[0]!]);
  }

  return rows;
}

function renderHalfRow(ids: WidgetId[], key: string) {
  const cells = ids
    .map((id) => ({ id, node: renderWidget(id) }))
    .filter((c): c is { id: WidgetId; node: ReactNode } => c.node != null);

  if (cells.length === 0) return null;

  return (
    <View key={key} style={styles.halfRow}>
      {cells.map(({ id, node }) => (
        <View key={id} style={widgetHalf.wrap}>
          {node}
        </View>
      ))}
      {cells.length === 1 ? <View style={widgetHalf.spacer} /> : null}
    </View>
  );
}

export function HomeWidgetGrid() {
  const activeWidgets = useWidgetStore((s) => s.activeWidgets);
  const rows = buildRows(activeWidgets);

  return (
    <View style={styles.wrap}>
      {rows.map((row) => {
        if (row.length === 2 && row.every(isHalfWidthWidget)) {
          return renderHalfRow(row, `${row[0]}-${row[1]}`);
        }

        if (row.length === 1 && isHalfWidthWidget(row[0])) {
          return renderHalfRow(row, row[0]);
        }

        const id = row[0];
        const content = renderWidget(id);
        if (!content) return null;

        return (
          <View key={id} style={styles.full}>
            {content}
          </View>
        );
      })}

      <View style={styles.full}>
        <CheckInCTAWidget />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  halfRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  full: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
});
