"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  ZoomIn, ZoomOut,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
} from "lucide-react";
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

export default function DiagramModal({ isOpen, onClose, responseData, loading }) {
  const canvasRef = useRef(null);
  const bpmnViewerRef = useRef(null);
  const [error, setError] = useState(null);

  const bpmXml = responseData?.bpm || null;
  const activeElementId = responseData?.active || null;

  useEffect(() => {
    if (!isOpen || !bpmXml) return;

    const renderDiagram = async () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!canvasRef.current) return;

      bpmnViewerRef.current = new BpmnJS({ container: canvasRef.current });

      try {
        await bpmnViewerRef.current.importXML(bpmXml);
        const canvas = bpmnViewerRef.current.get("canvas");
        canvas.zoom("fit-viewport");

        const styleId = "bpmn-highlight-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `
              .highlight .djs-visual > :nth-child(1) {
                fill: rgba(253, 224, 71, 0.6) !important;
              }
            `;
            document.head.appendChild(style);
        }

        if (activeElementId) {
          canvas.addMarker(activeElementId, "highlight");
        }
        setError(null);
      } catch (err) {
        console.error("Failed to render diagram:", err);
        setError("Failed to render BPMN diagram.");
      }
    };

    renderDiagram();

    return () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }
    };
  }, [isOpen, bpmXml, activeElementId]);

  const handleZoom = (factor) => {
    bpmnViewerRef.current?.get("canvas").zoom(factor, 'auto');
  };

  const handlePan = (direction) => {
    const canvas = bpmnViewerRef.current?.get("canvas");
    if (!canvas) return;
    
    const viewbox = canvas.viewbox();
    const delta = 100 / viewbox.scale;

    if (direction === "left") viewbox.x -= delta;
    if (direction === "right") viewbox.x += delta;
    if (direction === "up") viewbox.y -= delta;
    if (direction === "down") viewbox.y += delta;

    canvas.viewbox(viewbox);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[90vw] h-[90vh] p-4 flex flex-col"
        style={{ maxWidth: "none", maxHeight: "none" }}
      >
        {/* 👇 THIS LINE IS MODIFIED 👇 */}
        <div className="flex justify-between items-center mb-2 flex-shrink-0 pr-8">
        <h2 className="text-lg font-semibold">
  Step : {responseData?.tahap ?? "—"}
</h2>

          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handlePan("left")}><ArrowLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("right")}><ArrowRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("up")}><ArrowUp className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("down")}><ArrowDown className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom(1.2)}><ZoomIn className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom(0.8)}><ZoomOut className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="w-full flex-grow border rounded bg-white relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">Loading diagram...</div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-600">{error}</div>
          )}
          <div
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: loading || error ? 'none' : 'block' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}