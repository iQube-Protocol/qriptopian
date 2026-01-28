import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DevicePreviewSwitcher,
  DeviceType,
  useDevicePreview,
  getDeviceWidth,
} from "./DevicePreviewSwitcher";

interface PreviewFrameProps {
  /** The content to preview (URL for iframe or React children) */
  src?: string;
  /** React children to render in the preview */
  children?: React.ReactNode;
  /** Initial device type */
  defaultDevice?: DeviceType;
  /** Container class name */
  className?: string;
  /** Whether to show the device switcher toolbar */
  showToolbar?: boolean;
  /** Custom toolbar position */
  toolbarPosition?: "top" | "bottom";
  /** Callback when device changes */
  onDeviceChange?: (device: DeviceType, width: number) => void;
}

/**
 * A complete preview frame with device switching capability.
 * Can render either an iframe (via src) or React children.
 */
export function PreviewFrame({
  src,
  children,
  defaultDevice = "desktop",
  className,
  showToolbar = true,
  toolbarPosition = "top",
  onDeviceChange,
}: PreviewFrameProps) {
  const { device, setDevice, width } = useDevicePreview(defaultDevice);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Calculate scale to fit container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 32; // padding
      const newScale = Math.min(1, containerWidth / width);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [width]);

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    onDeviceChange?.(newDevice, getDeviceWidth(newDevice));
  };

  const toolbar = showToolbar && (
    <div className="flex items-center justify-center py-2">
      <DevicePreviewSwitcher value={device} onChange={handleDeviceChange} />
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {toolbarPosition === "top" && toolbar}

      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 flex items-start justify-center"
      >
        <div
          className="bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out origin-top"
          style={{
            width: `${width}px`,
            transform: `scale(${scale})`,
            minHeight: "100%",
          }}
        >
          {src ? (
            <iframe
              src={src}
              className="w-full h-full min-h-[600px] border-0"
              title="Preview"
            />
          ) : (
            <div className="w-full min-h-[600px]">{children}</div>
          )}
        </div>
      </div>

      {toolbarPosition === "bottom" && toolbar}
    </div>
  );
}

/**
 * Standalone hook for controlling preview width externally
 */
export { useDevicePreview, getDeviceWidth } from "./DevicePreviewSwitcher";
