"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, AlertTriangle } from "lucide-react";

const animalCategories = ["Chameleon", "Owl", "Tiger", "Zebra", "Bear", "Squirrel", "Rabbit", "Fox", "Canary", "Wolf"];

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelection = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileSelection(event.target.files[0]);
    }
  }, [handleFileSelection]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileSelection(event.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      setResult(data.result);
    } catch (error) {
      console.error("Error submitting image:", error);
      setError(error instanceof Error ? error.message : String(error));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log("Result updated:", result);
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Extra attributes from the server')) {
        return;
      }
      originalError.call(console, ...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 animate-bounce">
          🦁 Animal Detective 🐘
        </h1>
        <div className="relative">
          <Image
            className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            src="/animal-detection800.png"
            alt="Animal detection picture"
            width={800}
            height={400}
            priority
          />
          <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-full transform rotate-12 animate-pulse">
            New!
          </div>
        </div>
        <p className="text-lg text-center text-gray-700">
          Upload an image of an animal, and our AI will detect and classify it into one of these categories:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {animalCategories.map((animal) => (
            <span key={animal} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {animal}
            </span>
          ))}
        </div>
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <p>This app will give you a description of the animal and tell you if it's dangerous!</p>
        </div>

        {/* Hidden input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div 
          className={`border-4 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ${
            isDragging ? "border-green-500 bg-green-100" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="mb-4 relative w-48 h-48 mx-auto">
              <Image
                src={previewUrl}
                alt="Uploaded animal"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          ) : (
            <>
              <p className="text-xl mb-4">Drag and drop your animal image here</p>
              <p className="text-gray-500 mb-4">or</p>
            </>
          )}

          {/* Button to select image */}
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto"
            onClick={() => fileInputRef.current?.click()} // Simulate the click on the input
          >
          <Upload className="h-5 w-5" />
          <span>Upload Image</span>
          </button>
        </div>

        <div className="text-center">
        <button
          className={`bg-green-500 text-white py-3 px-6 rounded-full ${
            !selectedFile || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Processing..." : "Classify Animal"}
        </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results section */}
        {result && (
          <div ref={resultRef} className="bg-blue-50 p-6 rounded-xl mt-8">
            <h2 className="text-2xl font-bold mb-4">Classification Results</h2>
            {Array.isArray(result.labels) && Array.isArray(result.scores) ? (
              <ul>
                {result.labels.map((label: string, index: number) => (
                  <li key={label} className="mb-2 flex justify-between items-center">
                    <span className="font-semibold">{label}</span>
                    <span className="bg-blue-200 px-2 py-1 rounded-full text-sm">
                      {(result.scores[index] * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-gray-600">
        <p>AI and GPT Bootcamp Q3 2024</p>
        <p>Homework for week 5 - Group 9</p>
      </footer>
    </div>
  );
}
