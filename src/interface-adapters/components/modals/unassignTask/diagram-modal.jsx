"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  ZoomIn, ZoomOut,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  X,
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
      bpmnViewerRef.current = new BpmnJS({ container: canvasRef.current });

      try {
        await bpmnViewerRef.current.importXML(bpmXml);

        const canvas = bpmnViewerRef.current.get("canvas");
        const elementRegistry = bpmnViewerRef.current.get("elementRegistry");
        canvas.zoom("fit-viewport");

        // Add highlight style for background
        const style = document.createElement("style");
        style.innerHTML = `
          .highlight .djs-visual > :nth-child(1) {
            fill: rgba(253, 224, 71, 0.6) !important; /* yellow-400 */
          }
        `;
        document.head.appendChild(style);

        // Highlight active element
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
    const canvas = bpmnViewerRef.current?.get("canvas");
    if (!canvas) return;
    const currentZoom = canvas.zoom();
    canvas.zoom(currentZoom * factor);
  };

  const handlePan = (direction) => {
    const canvas = bpmnViewerRef.current?.get("canvas");
    if (!canvas) return;
    const viewbox = canvas.viewbox();
    const delta = 100;

    if (direction === "left") viewbox.x -= delta;
    if (direction === "right") viewbox.x += delta;
    if (direction === "up") viewbox.y -= delta;
    if (direction === "down") viewbox.y += delta;

    canvas.viewbox(viewbox);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[90vw] h-[90vh] p-4"
        style={{ maxWidth: "none", maxHeight: "none" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Process Diagram</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handlePan("left")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("right")}>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("up")}>
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePan("down")}>
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom(1.2)}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom(0.8)}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading && <div className="text-center py-8">Loading diagram...</div>}
        {error && <div className="text-center text-red-600 py-4">{error}</div>}

        <div
          ref={canvasRef}
          className="w-full h-full border rounded bg-white"
          style={{ minHeight: "700px" }}
        />
      </DialogContent>
    </Dialog>
  );
}
