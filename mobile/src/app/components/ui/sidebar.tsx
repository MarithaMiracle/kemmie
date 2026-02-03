import * as React from "react";
import { View, Pressable, Text, StyleSheet, Dimensions } from "react-native";
import { PanelLeft } from "lucide-react-native";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  style,
  children,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: any;
  children?: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);


  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider>
        <View style={style}>{children}</View>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  children,
}: {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  children?: React.ReactNode;
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return <View>{children}</View>;
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <View style={{ flex: 1, width: "100%", flexDirection: "column" }}>{children}</View>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <View>{children}</View>
  );
}

function SidebarTrigger({ style, onPress, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      style={StyleSheet.flatten([{ width: 28, height: 28 }, style])}
      onPress={() => {
        onPress?.();
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft size={16} />
      <Text style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}>Toggle Sidebar</Text>
    </Button>
  );
}

function SidebarRail({ style, ...props }: { style?: any }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={toggleSidebar}
      style={style}
      {...props}
    />
  );
}

function SidebarInset({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} />;
}

function SidebarHeader({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={[{ padding: 8 }, style]}>{children}</View>;
}

function SidebarFooter({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={[{ padding: 8 }, style]}>{children}</View>;
}

function SidebarSeparator({ style, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" data-sidebar="separator" style={[{ marginHorizontal: 8 }, style]} {...props} />;
}

function SidebarContent({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={[{ flex: 1, minHeight: 0, flexDirection: 'column' }, style]}>{children}</View>;
}

function SidebarGroup({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarGroupLabel({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarGroupAction({ children, onPress, style }: { children?: React.ReactNode; onPress?: () => void; style?: any }) {
  return (
    <Pressable onPress={onPress} style={style}>
      {children}
    </Pressable>
  );
}

function SidebarGroupContent({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={[{ width: '100%' }, style]}>{children}</View>;
}

function SidebarMenu({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={[{ width: '100%', minWidth: 0 }, style]}>{children}</View>;
}

function SidebarMenuItem({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}


function SidebarMenuButton({ isActive = false, tooltip, children, onPress, style }: { isActive?: boolean; tooltip?: string | { children?: React.ReactNode }; children?: React.ReactNode; onPress?: () => void; style?: any }) {
  const button = (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: isActive ? '#F3F4F6' : 'transparent' }, style]}>
      {children}
    </Pressable>
  );
  if (!tooltip) return button;
  const tip = typeof tooltip === 'string' ? { children: tooltip } : tooltip;
  return (
    <Tooltip>
      <TooltipTrigger>{button}</TooltipTrigger>
      <TooltipContent>{tip?.children}</TooltipContent>
    </Tooltip>
  );
}

function SidebarMenuAction({ children, onPress, style }: { children?: React.ReactNode; onPress?: () => void; style?: any }) {
  return (
    <Pressable onPress={onPress} style={style}>
      {children}
    </Pressable>
  );
}

function SidebarMenuBadge({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarMenuSkeleton({ showIcon = false }: { showIcon?: boolean }) {
  const maxWidthPx = React.useMemo(() => {
    const percent = Math.floor(Math.random() * 40) + 50;
    const { width } = Dimensions.get("window");
    return Math.round(((width - 32) * percent) / 100);
  }, []);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 32, borderRadius: 8, paddingHorizontal: 8 }}>
      {showIcon && <Skeleton style={{ width: 16, height: 16, borderRadius: 4, marginRight: 8 }} />}
      <Skeleton style={{ height: 16, flex: 1, maxWidth: maxWidthPx }} />
    </View>
  );
}

function SidebarMenuSub({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarMenuSubItem({ children, style }: { children?: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

function SidebarMenuSubButton({ size = 'md', isActive = false, children, onPress, style }: { size?: 'sm' | 'md'; isActive?: boolean; children?: React.ReactNode; onPress?: () => void; style?: any }) {
  return (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, height: size === 'sm' ? 28 : 32, paddingHorizontal: 8, borderRadius: 8, backgroundColor: isActive ? '#F3F4F6' : 'transparent' }, style]}>
      {children}
    </Pressable>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
