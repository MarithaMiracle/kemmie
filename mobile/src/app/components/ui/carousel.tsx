import * as React from "react";
import { View, ScrollView, Pressable, Text, Dimensions } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

import { Button } from "./button";

type CarouselProps = {
  orientation?: "horizontal" | "vertical";
  setApi?: (api: { scrollToIndex: (i: number) => void }) => void;
};

type CarouselContextProps = {
  scrollRef: React.RefObject<ScrollView>;
  index: number;
  setIndex: (i: number) => void;
  orientation: "horizontal" | "vertical";
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({ orientation = "horizontal", setApi, children }: { orientation?: "horizontal" | "vertical"; setApi?: (api: { scrollToIndex: (i: number) => void }) => void; children?: React.ReactNode }) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!setApi) return;
    setApi({
      scrollToIndex: (i: number) => {
        const { width, height } = Dimensions.get("window");
        const x = orientation === "horizontal" ? i * width : 0;
        const y = orientation === "vertical" ? i * height : 0;
        scrollRef.current?.scrollTo({ x, y, animated: true });
      },
    });
  }, [setApi, orientation]);

  return (
    <CarouselContext.Provider value={{ scrollRef, index, setIndex, orientation }}>
      <View>{children}</View>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ children }: { children?: React.ReactNode }) {
  const { scrollRef, orientation, setIndex } = useCarousel();
  const onMomentumScrollEnd = (e: any) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const size = orientation === "horizontal" ? layoutMeasurement.width : layoutMeasurement.height;
    const pos = orientation === "horizontal" ? contentOffset.x : contentOffset.y;
    setIndex(Math.round(pos / size));
  };
  return (
    <ScrollView
      ref={scrollRef}
      horizontal={orientation === "horizontal"}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
    >
      {children}
    </ScrollView>
  );
}

function CarouselItem({ children }: { children?: React.ReactNode }) {
  const { orientation } = useCarousel();
  const { width, height } = Dimensions.get("window");
  return (
    <View style={orientation === "horizontal" ? { width } : { height, width: "100%" }}>
      {children}
    </View>
  );
}

function CarouselPrevious({ style, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollRef, index, setIndex } = useCarousel();
  const { width, height } = Dimensions.get("window");
  const scroll = () => {
    const next = Math.max(index - 1, 0);
    const x = orientation === "horizontal" ? next * width : 0;
    const y = orientation === "vertical" ? next * height : 0;
    scrollRef.current?.scrollTo({ x, y, animated: true });
    setIndex(next);
  };
  return (
    <Button
      data-slot="carousel-previous"
      style={[{ position: 'absolute', width: 32, height: 32, borderRadius: 16 }, orientation === 'horizontal' ? { top: '50%', left: -48 } : { left: '50%', top: -48 }, style]}
      onPress={scroll}
      {...props}
    >
      <ArrowLeft />
      <Text style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}>Previous slide</Text>
    </Button>
  );
}

function CarouselNext({ style, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollRef, index, setIndex } = useCarousel();
  const { width, height } = Dimensions.get("window");
  const scroll = () => {
    const next = index + 1;
    const x = orientation === "horizontal" ? next * width : 0;
    const y = orientation === "vertical" ? next * height : 0;
    scrollRef.current?.scrollTo({ x, y, animated: true });
    setIndex(next);
  };
  return (
    <Button
      data-slot="carousel-next"
      style={[{ position: 'absolute', width: 32, height: 32, borderRadius: 16 }, orientation === 'horizontal' ? { top: '50%', right: -48 } : { left: '50%', bottom: -48 }, style]}
      onPress={scroll}
      {...props}
    >
      <ArrowRight />
      <Text style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}>Next slide</Text>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
