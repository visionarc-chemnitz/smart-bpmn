"use client";
import { useState, useRef } from "react";
import axios from "axios"; // Import axios
import { RainbowButton } from "@/components/ui/rainbow-button"; // Ensure this component is available
import { AiOutlineDownload } from "react-icons/ai"; // Import download icon

const BPMNGenerator = () => {
  const [prompt, setPrompt] = useState(""); // State for user input prompt
  const [loading, setLoading] = useState(false);
  const [pipeFlowImage, setPipeFlowImage] = useState(""); // State for the generated image
  const [error, setError] = useState(null);

  const bpmnContainerRef = useRef(null);

  // Handle the generation of the BPMN image
  const handleGenerate = async () => {
    if (!prompt) {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://bpmn-fastapi.onrender.com/generate/", {
        prompt: prompt,
      });

      // Assuming the backend returns a base64 encoded image
      setPipeFlowImage(`data:image/png;base64,${response.data.pipeFlowImage}`);
    } catch (error) {
      console.error("Error generating BPMN diagram:", error);
      setError("Error generating the BPMN diagram. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to download the image
  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = pipeFlowImage;
    a.download = "bpmn-diagram.png";
    a.click();
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
       <i className="fa-diagram-projec"></i> BPMN Generator from User Story
      </h1>

      <div className="border p-4 rounded-lg bg-white dark:bg-gray-700 shadow-md mb-6">
        {/* Input area for prompt */}
        <textarea
          rows={8}
          className="border p-4 rounded-lg shadow-sm mb-6 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          placeholder="Enter your user story here (e.g., 'As a customer...')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} // Corrected variable to match state
        />

        <div className="flex mb-6">
          <RainbowButton onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </RainbowButton>
        </div>

        {/* Error message display */}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      {/* Full-Screen BPMN Diagram Container */}
      <div className="border p-4 rounded-lg bg-white dark:bg-gray-700 shadow-md w-full" style={{ height: "calc(100vh - 300px)" }}>
        <h5 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Generated BPMN Diagram</h5>
        
        {/* Image display and download */}
        {pipeFlowImage && (
          <div>
            <img
              src={pipeFlowImage}
              alt="Generated BPMN Diagram"
              className="max-w-full h-auto rounded-lg shadow-md mb-4"
            />
            <RainbowButton onClick={downloadImage}>
              <AiOutlineDownload className="inline-block mr-2" />
              Download BPMN Diagram
            </RainbowButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default BPMNGenerator;
