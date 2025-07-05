"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import { X, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import BpmnJS from 'bpmn-js/dist/bpmn-viewer.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

export default function DiagramModal({ isOpen, onClose, responseData, loading }) {
  const [bpmxl, setBpmxl] = useState(null);
  const [renderError, setRenderError] = useState(null);
  const canvasRef = useRef(null);
  const bpmnViewerRef = useRef(null);

  useEffect(() => {
    if (responseData) {
      setBpmxl(typeof responseData === 'string' ? responseData : responseData.bpmxl || null);
    } else {
      setBpmxl(null);
    }
  }, [responseData]);

  useEffect(() => {
    if (!isOpen) {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }
      setRenderError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !bpmxl || !canvasRef.current) {
      return;
    }
    setRenderError(null);

    const initViewer = async () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
      }
      bpmnViewerRef.current = new BpmnJS({
        container: canvasRef.current
      });
      try {
        await bpmnViewerRef.current.importXML(bpmxl);
        const canvas = bpmnViewerRef.current.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
      } catch (importErr) {
        console.error('Error importing BPMN XML:', importErr);
        setRenderError(`Failed to render diagram. The XML may be malformed. Message: ${importErr.message}`);
      }
    };

    initViewer();
    return () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }
    };
  }, [isOpen, bpmxl]);

  const handleZoom = (factor) => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom(canvas.zoom() * factor);
    }
  };

  const navigateView = (direction) => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      const currentViewbox = canvas.viewbox();
      let newViewbox;

      switch (direction) {
        case 'left':
          newViewbox = { ...currentViewbox, x: currentViewbox.x - 100 };
          break;
        case 'right':
          newViewbox = { ...currentViewbox, x: currentViewbox.x + 100 };
          break;
        case 'up':
          newViewbox = { ...currentViewbox, y: currentViewbox.y - 100 };
          break;
        case 'down':
          newViewbox = { ...currentViewbox, y: currentViewbox.y + 100 };
          break;
        default:
          return;
      }

      canvas.viewbox(newViewbox);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-2 [button[aria-label='Close']]:hidden"
        style={{
          maxWidth: "none",
          width: "1600px",
          height: "900px",
          maxHeight: "none",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between pb-2 border-b">
          <div>
            <DialogTitle className="text-xl">BPMN Diagram</DialogTitle>
            <DialogDescription>
              Interactive diagram. Use controls to navigate and zoom.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Navigation controls */}
            <Button variant="outline" size="icon" onClick={() => navigateView('left')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateView('right')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateView('up')}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateView('down')}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            
            {/* Zoom controls */}
            <Button variant="outline" size="icon" onClick={() => handleZoom(1.2)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom(0.8)}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            {/* Close button */}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="relative flex-grow w-full h-full mt-2 border rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Loading diagram...</p>
              </div>
            </div>
          ) : !bpmxl ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No diagram data available.</p>
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: "#fff", minHeight: "700px" }}
            />
          )}
          {renderError && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 p-4">
              <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="font-bold text-red-600 mb-2">Error Rendering Diagram</p>
                <p className="text-red-500 text-sm mb-4">{renderError}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}