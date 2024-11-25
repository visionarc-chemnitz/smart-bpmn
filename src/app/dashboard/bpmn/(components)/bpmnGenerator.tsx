"use client";
import { useState, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AiOutlineDownload, AiOutlineCopy } from "react-icons/ai"; // Import icons

// Helper function to parse the user story into BPMN steps
const parseUserStory = (userStory) => {
  const steps = [];

  // Normalize the input by adding periods where necessary (if missing)
  let formattedStory = userStory.trim();
  if (!formattedStory.endsWith(".")) {
    formattedStory += ".";
  }

  const lines = formattedStory
    .split(".")
    .map((line) => line.trim())
    .filter((line) => line);

  lines.forEach((line, index) => {
    if (line.startsWith("As a")) {
      const parts = line.split(",");
      if (parts.length > 1) {
        const startDescription = parts[1]?.trim(); // Text after the first comma
        steps.push({ type: "bpmn:StartEvent", name: `Start: ${startDescription}` });
      }
    } else if (line.includes("The system")) {
      const taskName = line.trim();
      steps.push({ type: "bpmn:Task", name: taskName });
    } else if (line.startsWith("If")) {
      const conditionPart = line.split(",")[0].trim(); // Preserve "If" in the label
      const decisionOutcome = line.split(",")[1]?.trim(); // Outcome (after comma)

      steps.push({
        type: "bpmn:ExclusiveGateway",
        name: conditionPart, // Keep the full "If ..." condition
        outcome: decisionOutcome,
      });
    } else if (line.toLowerCase().includes("finally") || line.toLowerCase().includes("ends") || line.toLowerCase().includes("completed")) {
      const endDescription = line.trim();
      steps.push({ type: "bpmn:EndEvent", name: endDescription });
    } else if (line.includes("and")) {
      // Handle parallel paths
      const parts = line.split("and");
      parts.forEach((part) => {
        steps.push({ type: "bpmn:ParallelGateway", name: part.trim() });
      });
    } else if (line.includes("loop")) {
      steps.push({ type: "bpmn:SequenceFlow", name: line.replace("loop", "").trim() });
    }
  });
  console.log(steps);

  return steps;
};

// Main BPMN Generator Component
const BPMNGenerator = () => {
  const [userStory, setUserStory] = useState("");
  const [bpmnXml, setBpmnXml] = useState("");
  const [loading, setLoading] = useState(false);
  const bpmnContainerRef = useRef(null);
  const modelerRef = useRef(null);

  const generateBpmn = async () => {
    setLoading(true); // Start loading
  
    if (!modelerRef.current) {
      modelerRef.current = new BpmnModeler({
        container: bpmnContainerRef.current,
      });
    }
  
    const modeler = modelerRef.current;
    const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                        id="Definitions_1"
                        targetNamespace="http://bpmn.io/schema/bpmn">
        <bpmn:process id="Process_1" isExecutable="true"></bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`;
  
    await modeler.importXML(initialDiagram);
    const modeling = modeler.get("modeling");
    const bpmnFactory = modeler.get("bpmnFactory");
    const canvas = modeler.get("canvas");
  
    const steps = parseUserStory(userStory);
    let lastElement = null;
    let yPos = 100;
  
    steps.forEach((step, index) => {
      const x = 150 + index * 250;
      const y = yPos;
  
      const element = modeling.createShape(
        {
          type: step.type,
          businessObject: bpmnFactory.create(step.type, { id: `${step.type}_${index}`, name: step.name }),
        },
        { x, y },
        canvas.getRootElement()
      );
  
      if (lastElement) {
        modeling.connect(lastElement, element);
      }
  
      // Dynamic handling of gateways and connections
      if (step.type === "bpmn:ExclusiveGateway" && step.outcome) {
        const [outcome1, outcome2] = step.outcome.split("and").map((o) => o.trim());
  
        const decisionOutcome1 = modeling.createShape(
          {
            type: "bpmn:Task",
            businessObject: bpmnFactory.create("bpmn:Task", { id: `decision_outcome_1_${index}`, name: outcome1 }),
          },
          { x: x + 300, y: yPos - 50 },
          canvas.getRootElement()
        );
        modeling.connect(element, decisionOutcome1);
  
        const decisionOutcome2 = modeling.createShape(
          {
            type: "bpmn:Task",
            businessObject: bpmnFactory.create("bpmn:Task", { id: `decision_outcome_2_${index}`, name: outcome2 }),
          },
          { x: x + 300, y: yPos + 50 },
          canvas.getRootElement()
        );
        modeling.connect(element, decisionOutcome2);
      }
  
      lastElement = element;
      yPos += 120;
    });
  
    const { xml } = await modeler.saveXML({ format: true });
    setBpmnXml(xml);
    setLoading(false); // Stop loading
  };
  

  const downloadPng = async () => {
    if (modelerRef.current) {
      const { svg } = await modelerRef.current.saveSVG();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = new Image();
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "diagram.png";
        link.href = pngUrl;
        link.click();
      };

      img.src = url;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bpmnXml);
    alert("BPMN XML copied to clipboard!");
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">BPMN Generator from User Story</h1>

      <textarea
        rows={8}
        className="border p-4 rounded-lg shadow-sm mb-6 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        placeholder="Enter your user story here (e.g., 'As a customer...')"
        value={userStory}
        onChange={(e) => setUserStory(e.target.value)}
      />

      <div className="flex mb-6">
        <RainbowButton
          onClick={generateBpmn}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </RainbowButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Display BPMN XML */}
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-700 shadow-md" style={{ height: "500px", overflow: "auto" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Generated BPMN XML</h2>
            <div className="flex space-x-2">
              <RainbowButton
                onClick={() => {
                  const blob = new Blob([bpmnXml], { type: "application/xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "process.bpmn";
                  a.click();
                }}
              >
                <AiOutlineDownload className="inline-block mr-2" />
              </RainbowButton>
              <RainbowButton
                onClick={copyToClipboard}
              >
                <AiOutlineCopy className="inline-block mr-2" />
              </RainbowButton>
            </div>
          </div>
          <textarea
            rows={25}
            cols={50}
            readOnly
            className="border p-2 w-full h-full rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
            value={bpmnXml}
            style={{ resize: "none" }}
          />
        </div>

        {/* Right: Display BPMN Diagram */}
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-700 shadow-md" style={{ height: "500px", overflow: "auto" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">BPMN Diagram</h2>
            <RainbowButton
              onClick={downloadPng}
            >
              <AiOutlineDownload className="inline-block mr-2" />
            </RainbowButton>
          </div>
          <div
            ref={bpmnContainerRef}
            className="border border-gray-300 dark:border-gray-600 rounded-lg"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BPMNGenerator;