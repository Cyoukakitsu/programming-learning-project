"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
type NotesClientProps = {
  initialNotes: Note[];
};

function NotesClient({ initialNotes }: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  //　新規作成関数
  const createNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();

      if (result.success) {
        setNotes((prev) => [...prev, result.data]);
        toast.success("Note Created Successfully!");
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Error creating note.");
    } finally {
      setLoading(false);
    }
  };

  //　削除関数
  const deleteNote = async (id: string) => {
    console.log("deleteNote called with id:", id);
    if (!window.confirm("Are you sure you want to delete this note?")) {
      console.log("User cancelled delete");
      return;
    }
    
    try {
      console.log("Attempting to delete note with ID:", id);
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      
      console.log("Delete response status:", response.status);
      const result = await response.json();
      console.log("Delete response result:", result);
      
      if (response.ok && result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note Deleted Successfully!");
      } else {
        // 处理API返回的错误
        toast.error(result.error || `Failed to delete note: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Something went wrong while deleting the note!");
    }
  };

   //　更新関数
  const updateNote = async (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setLoading(true);

    try {
      console.log("Attempting to update note with ID:", id);
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      console.log("Update response status:", response.status);
      const result = await response.json();
      console.log("Update response result:", result);
      
      if (response.ok && result.success) {
        // Update the note in the state
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        toast.success("Note updated successfully");
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
      } else {
        toast.error(result.error || `Failed to update note: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Something went wrong while updating the note!");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note: Note) => {
    console.log("startEdit called with note:", note);
    console.log("Setting editingId to:", note._id);
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    console.log("Edit state set - editingId:", note._id, "editTitle:", note.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={createNote}
        className="bg-gray-200 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Add Note"}
          </button>
        </div>
      </form>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">
            No Notes Yet. Create Your First Note Above
          </p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              {editingId === note._id ? (
                <>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      rows={4}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateNote(note._id)}
                        disabled={loading}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="ml-2 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{note.content}</p>
                  <p className="text-gray-500 text-sm">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  {note.updatedAt !== note.createdAt && (
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default NotesClient;
