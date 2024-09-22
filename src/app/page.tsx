"use client";

import { useRef, useState } from "react"; // Здесь только одно определение useState
import Image from "next/image";
import { Upload, Camera, AlertTriangle } from "lucide-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]); // Save the selected file in the state
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    // TODO
    
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("File uploaded");
  };

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
          {["Chameleon", "Owl", "Tiger", "Zebra", "Bear", "Squirrel", "Rabbit", "Fox", "Canary", "Wolf"].map((animal) => (
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
          onDrop={() => setIsDragging(false)}
        >
          <p className="text-xl mb-4">Drag and drop your animal image here</p>
          <p className="text-gray-500 mb-4">or</p>

          {/* Button to select image */}
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto"
            onClick={() => fileInputRef.current?.click()} // Simulate the click on the input
          >
          <Upload className="h-5 w-5" />
          <span>Upload Image</span>
          </button>
        </div>

        {selectedFile && (
          <p className="text-center text-sm text-gray-700">
            Selected file: {selectedFile.name}
          </p>
        )}

        <div className="text-center">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto">
            <Camera className="h-5 w-5" />
            <span>Take a Photo</span>
          </button>
        </div>
      </main>
      <footer className="mt-12 text-center text-gray-600">
        <p>AI and GPT Bootcamp Q3 2024</p>
        <p>Homework for week 5 - Group 9</p>
      </footer>
    </div>
  );
}
