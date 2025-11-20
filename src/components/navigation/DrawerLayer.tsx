import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DrawerLayerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  tabs?: { id: string; label: string }[];
  children: ReactNode;
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  full: 'max-w-full',
};

export function DrawerLayer({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 'lg',
  tabs,
  children,
}: DrawerLayerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 bg-[#0f1729]/95 backdrop-blur-xl border-l border-white/5 z-50",
          "animate-in slide-in-from-right duration-300",
          widthClasses[width],
          width === 'full' ? 'w-full' : 'w-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/5">
            <div>
              {title && (
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {tabs ? (
              <Tabs defaultValue={tabs[0]?.id} className="h-full">
                <div className="sticky top-0 bg-[#0f1729]/95 backdrop-blur-xl border-b border-white/5 px-6 pt-4 z-10">
                  <TabsList className="bg-white/5">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-cyan-500"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="p-6">
                  {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                      {children}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            ) : (
              <div className="p-6">{children}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
