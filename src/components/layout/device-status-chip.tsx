"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  Clock, 
  Cpu,
  MoreHorizontal 
} from "lucide-react";
import { cn } from "~/lib/utils";

interface DeviceStatusChipProps {
  id: string;
  name: string;
  type: "ev3" | "raspberry-pi" | "arduino" | "micro-bit" | "custom";
  status: "online" | "offline" | "connecting" | "error";
  batteryLevel?: number; // 0-100
  lastSeen?: Date;
  connectionType?: "usb" | "bluetooth" | "wifi";
  signalStrength?: number; // 0-4
  onClick?: () => void;
  className?: string;
}

export function DeviceStatusChip({
  id,
  name,
  type,
  status,
  batteryLevel,
  lastSeen,
  signalStrength,
  onClick,
  className,
}: DeviceStatusChipProps) {
  const statusConfig = {
    online: {
      color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
      icon: Wifi,
      label: "Online",
    },
    offline: {
      color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
      icon: WifiOff,
      label: "Offline",
    },
    connecting: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800",
      icon: Wifi,
      label: "Connecting",
    },
    error: {
      color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
      icon: WifiOff,
      label: "Error",
    },
  };

  const typeLabels = {
    "ev3": "EV3",
    "raspberry-pi": "Pi",
    "arduino": "Arduino",
    "micro-bit": "micro:bit",
    "custom": "Custom",
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getBatteryIcon = () => {
    if (batteryLevel === undefined) return null;
    return batteryLevel > 20 ? Battery : BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <div 
      className={cn(
        "group relative border rounded-lg p-3 hover:shadow-sm transition-all duration-200 cursor-pointer",
        config.color,
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="flex items-center space-x-1">
            <StatusIcon className={cn(
              "h-4 w-4",
              status === "connecting" && "animate-pulse"
            )} />
            <Cpu className="h-3 w-3 opacity-60" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate">{name}</span>
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0 h-5"
              >
                {typeLabels[type]}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-xs opacity-75">{config.label}</span>
              
              {batteryLevel !== undefined && BatteryIcon && (
                <div className="flex items-center space-x-1">
                  <BatteryIcon className={cn(
                    "h-3 w-3",
                    batteryLevel <= 20 && "text-red-600 dark:text-red-400"
                  )} />
                  <span className="text-xs">{batteryLevel}%</span>
                </div>
              )}
              
              {lastSeen && status === "offline" && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span className="text-xs opacity-75">
                    {formatLastSeen(lastSeen)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            // Handle device options menu
          }}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>

      {/* Signal strength indicator */}
      {signalStrength !== undefined && status === "online" && (
        <div className="absolute top-2 right-2 flex space-x-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "w-1 rounded-sm",
                bar <= signalStrength 
                  ? "bg-current opacity-60" 
                  : "bg-current opacity-20",
                bar === 1 && "h-1",
                bar === 2 && "h-2",
                bar === 3 && "h-3", 
                bar === 4 && "h-4"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
