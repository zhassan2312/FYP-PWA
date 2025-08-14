'use client';

import React from 'react';
import { Card } from '~/components/ui/card';
import { 
  Settings,
  Bot,
  Eye,
  Zap
} from 'lucide-react';

export function SettingsTab() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-2xl space-y-6">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-6 text-lg">
            <Settings className="h-5 w-5" />
            Robot Configuration
          </h3>
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Connection Settings
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Robot IP:</span>
                  <span className="font-mono">192.168.1.100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Port:</span>
                  <span className="font-mono">8080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="font-mono">WebSocket</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeout:</span>
                  <span className="font-mono">5000ms</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Motor Configuration
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Left Motor:</span>
                  <span className="font-mono">Port A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Right Motor:</span>
                  <span className="font-mono">Port B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Speed:</span>
                  <span className="font-mono">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acceleration:</span>
                  <span className="font-mono">Medium</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Sensor Configuration
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ultrasonic:</span>
                  <span className="font-mono">Port 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color Sensor:</span>
                  <span className="font-mono">Port 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gyro:</span>
                  <span className="font-mono">Port 3</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
