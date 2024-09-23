import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    console.log("Processing request...");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file into a format that can be sent via HTTP (like Buffer or Base64)
    const buffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    console.log("Image processed, sending request to Hugging Face...");

    const animals = [
      "Chameleon",
      "Owl",
      "Tiger",
      "Zebra",
      "Bear",
      "Squirrel",
      "Rabbit",
      "Fox",
      "Canary",
      "Wolf",
    ];

    // Check if API Key is set
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is not set, aborting request.");
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY is not set. Please configure your environment and reload app.",
        },
        { status: 500 },
      );
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32",
      {
        inputs: {
          image: imageBuffer.toString("base64"),
        },
        parameters: {
          candidate_labels: animals,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = response.data;

    console.log("Response received from Hugging Face:", result);

    return NextResponse.json({ result });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Hugging Face API error:", error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: 500 });
    }

    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json(
        { error: "Error processing request", details: error.message },
        { status: 500 },
      );
    }

    console.error("Unknown error occurred");
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 },
    );
  }
}
