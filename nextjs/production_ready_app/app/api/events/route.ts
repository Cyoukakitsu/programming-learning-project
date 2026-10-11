import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse form data from request
    const formData = await request.formData();

    // Extract event data from form
    const eventData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "image") {
        eventData[key] = value;
      }
    }

    // Get image file from form data
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "DevEvent",
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result) return reject(new Error("Upload failed"));
              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    // Add image URL to event data
    eventData.image = uploadResult.secure_url;

    // Create event in database
    const createdEvent = await Event.create(eventData);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
