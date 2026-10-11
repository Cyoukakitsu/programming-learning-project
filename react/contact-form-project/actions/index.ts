"use server";

import dbConnect from "@/lib/db";
import Contact from "@/models/contact";
import { revalidateTag, unstable_cache } from "next/cache";

export async function createContact(formData: FormData) {
  try {
    await dbConnect();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const subject = formData.get("subject")?.toString();
    const message = formData.get("message")?.toString();

    if (!name || !email || !subject || !message) {
      return {
        success: false,
        error: "Please fill out all fields",
      };
    }
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return {
      success: true,
      message: "Message sent successfully",
      contactId: contact._id.toString(),
    };
  } catch (error) {
    console.error("Error sending message", error);

    // 根据内存中的TypeScript错误处理最佳实践，对错误类型进行检查
    let errorMessage = "Error sending message";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getContacts() {
  try {
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return contacts.map((contact) => ({
      ...contact,
      _id: contact._id.toString(),
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching contacts", error);

    // 根据内存中的TypeScript错误处理最佳实践，对错误类型进行检查
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    return [];
  }
}

export async function updateContact(contactId: string, status: string) {
  try {
    await dbConnect();

    // 验证联系人是否存在
    const existingContact = await Contact.findById(contactId);
    if (!existingContact) {
      return { success: false, error: "Contact not found" };
    }

    await Contact.findByIdAndUpdate(contactId, { status });

    revalidateTag("contact-stats");

    return { success: true };
  } catch (error) {
    console.error("Error updating contact", error);

    // 根据内存中的TypeScript错误处理最佳实践，对错误类型进行检查
    let errorMessage = "Error updating contact";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

    return { success: false, error: errorMessage };
  }
}

export async function getContactStats() {
  const getCachedStats = unstable_cache(
    async () => {
      await dbConnect();
      const total = await Contact.countDocuments();
      const newCount = await Contact.countDocuments({ status: "new" });
      const readCount = await Contact.countDocuments({ status: "read" });
      const repliedCount = await Contact.countDocuments({ status: "replied" });

      return {
        total,
        newCount,
        readCount,
        repliedCount,
      };
    },
    ["contact-stats"],
    { tags: ["contact-stats"] },
  );
  return getCachedStats;
}
