import * as React from "react";
import { View, Text } from "react-native";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({ id, children, config }: { id?: string; children?: React.ReactNode; config: ChartConfig }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <View>
        <ChartStyle id={chartId} config={config} />
        {children}
      </View>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => null;

function ChartTooltip(_: any) { return null; }

function ChartTooltipContent({ active, payload, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, formatter, color, nameKey, labelKey }: { active?: boolean; payload?: any[]; indicator?: "line" | "dot" | "dashed"; hideLabel?: boolean; hideIndicator?: boolean; label?: any; labelFormatter?: (value: any, payload?: any[]) => React.ReactNode; formatter?: (value: any, name: any, item: any, index: number, payloadItem: any) => React.ReactNode; color?: string; nameKey?: string; labelKey?: string }) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;
  const renderLabel = () => {
    if (hideLabel) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === 'string' ? config[label]?.label || label : itemConfig?.label;
    if (labelFormatter) return <Text style={{ fontWeight: '600' }}>{labelFormatter(value, payload)}</Text>;
    if (!value) return null;
    return <Text style={{ fontWeight: '600' }}>{String(value)}</Text>;
  };
  return (
    <View style={{ minWidth: 128, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
      {renderLabel()}
      <View>
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;
          return (
            <View key={item.dataKey} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              {!hideIndicator && (
                indicator === 'dot' ? <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: indicatorColor }} /> : indicator === 'line' ? <View style={{ width: 4, height: 10, backgroundColor: indicatorColor }} /> : <View style={{ width: 0, borderWidth: 1.5, borderStyle: 'dashed', borderColor: indicatorColor }} />
              )}
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={{ color: '#6B7280' }}>{String(itemConfig?.label || item.name)}</Text>
              </View>
              {item.value && <Text style={{ fontFamily: 'Menlo', fontWeight: '600' }}>{String(item.value)}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ChartLegend(_: any) { return null; }

function ChartLegendContent({ hideIcon = false, payload, verticalAlign = "bottom", nameKey }: { hideIcon?: boolean; payload?: any[]; verticalAlign?: "top" | "bottom"; nameKey?: string }) {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: verticalAlign === 'top' ? 0 : 12, paddingBottom: verticalAlign === 'top' ? 12 : 0 }}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <View key={item.value} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 6 }}>
            {!hideIcon ? (
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color, marginRight: 6 }} />
            ) : null}
            <Text>{String(itemConfig?.label)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
