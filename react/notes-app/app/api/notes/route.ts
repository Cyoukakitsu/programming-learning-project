import dbConnect from "@/lib/db";
import Note, { INote } from "@/models/Note";
import { NextResponse } from "next/server";

function serializeNote(note: INote) {
  return {
    _id: note._id.toString(),
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: notes.map(serializeNote),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const note = await Note.create(body);

    return NextResponse.json(
      {
        success: true,
        data: serializeNote(note),
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
