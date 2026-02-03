import * as React from "react";
import { View, Text, Pressable } from "react-native";

function Calendar(props: any) {
  const { showOutsideDays = true, selected, onSelect } = props || {};
  const initial = selected instanceof Date ? selected : new Date();
  const [cursor, setCursor] = React.useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { d: number; outside: boolean; date: Date }[] = [];
  for (let i = 0; i < 42; i++) {
    const dayIndex = i - firstDow + 1;
    let outside = false, d = 0, date = new Date(year, month, 1);
    if (dayIndex < 1) { d = prevMonthDays + dayIndex; outside = true; date = new Date(year, month - 1, d); }
    else if (dayIndex > daysInMonth) { d = dayIndex - daysInMonth; outside = true; date = new Date(year, month + 1, d); }
    else { d = dayIndex; date = new Date(year, month, d); }
    cells.push({ d, outside, date });
  }
  const names = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const isSelected = (d: Date) => {
    if (selected instanceof Date) {
      return selected.getFullYear() === d.getFullYear() && selected.getMonth() === d.getMonth() && selected.getDate() === d.getDate();
    }
    if (selected && selected.from) {
      const from = selected.from;
      const to = selected.to || selected.from;
      const t = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const start = +new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const end = +new Date(to.getFullYear(), to.getMonth(), to.getDate());
      return t >= start && t <= end;
    }
    return false;
  };
  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return (
    <View style={{ padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Pressable onPress={() => setCursor(new Date(year, month - 1, 1))}><Text>‹</Text></Pressable>
        <Text style={{ fontWeight: '600' }}>{monthLabel}</Text>
        <Pressable onPress={() => setCursor(new Date(year, month + 1, 1))}><Text>›</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        {names.map((n) => (
          <Text key={n} style={{ width: `${100/7}%`, textAlign: 'center', color: '#6B7280' }}>{n}</Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((cell, i) => {
          const show = showOutsideDays || !cell.outside;
          const selectedCell = isSelected(cell.date);
          return show ? (
            <Pressable key={i} onPress={() => onSelect?.(cell.date)} style={{ width: `${100/7}%`, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: selectedCell ? '#8B5CF6' : 'transparent' }}>
              <Text style={{ color: selectedCell ? '#fff' : cell.outside ? '#9CA3AF' : '#111827' }}>{cell.d}</Text>
            </Pressable>
          ) : (
            <View key={i} style={{ width: `${100/7}%`, height: 40 }} />
          );
        })}
      </View>
    </View>
  );
}

export { Calendar };
