import { Home, ClipboardList, Hammer, Users, Settings, Calendar, Receipt, BarChart3 } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export type DashTab = "home" | "leads" | "jobs" | "calendar" | "customers" | "invoices" | "reports" | "settings";

const PRIMARY: { id: DashTab; icon: any; label: string; disabled?: boolean }[] = [
  { id: "home", icon: Home, label: "Overview" },
  { id: "leads", icon: ClipboardList, label: "Leads" },
  { id: "jobs", icon: Hammer, label: "Jobs" },
  { id: "calendar", icon: Calendar, label: "Schedule", disabled: true },
  { id: "customers", icon: Users, label: "Customers" },
];

const BUSINESS: { id: DashTab; icon: any; label: string; disabled?: boolean }[] = [
  { id: "invoices", icon: Receipt, label: "Invoices", disabled: true },
  { id: "reports", icon: BarChart3, label: "Reports", disabled: true },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function AppSidebar({
  tab, onSelect, newLeadCount,
}: { tab: DashTab; onSelect: (t: DashTab) => void; newLeadCount: number }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const Item = ({ n }: { n: (typeof PRIMARY)[number] }) => {
    const active = tab === n.id;
    const Icon = n.icon;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={active}
          onClick={() => !n.disabled && onSelect(n.id)}
          tooltip={n.label}
          className={n.disabled ? "opacity-40 cursor-not-allowed" : ""}
        >
          <Icon className="h-4 w-4" />
          {!collapsed && (
            <span className="flex-1 flex items-center justify-between">
              <span>{n.label}</span>
              {n.id === "leads" && newLeadCount > 0 && (
                <span className="bg-fire text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 leading-none">
                  {newLeadCount}
                </span>
              )}
              {n.disabled && <span className="text-[9px] uppercase tracking-wider text-fog">Soon</span>}
            </span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-fire flex items-center justify-center text-white font-display text-sm">D</div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-chalk text-sm tracking-wider">DIANTONIO'S</span>
              <span className="text-fog text-[10px] uppercase tracking-widest">Business Suite</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{PRIMARY.map((n) => <Item key={n.id} n={n} />)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Business</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{BUSINESS.map((n) => <Item key={n.id} n={n} />)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-fog text-[10px] uppercase tracking-widest">v1 · Phase 1</div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}