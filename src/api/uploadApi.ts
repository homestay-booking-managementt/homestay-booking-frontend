import { sendRequest } from "@/utils/sendRequest";

type UploadResponse =
  | string
  | {
      url?: string;
      data?: unknown;
      location?: string;
    };

export const uploadHomestayImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = (await sendRequest("/api/upload", {
    method: "POST",
    payload: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })) as UploadResponse | undefined;

  if (!response) {
    throw new Error("Upload failed");
  }

  if (typeof response === "string") {
    return response;
  }

  if (response.url) {
    return response.url;
  }

  if (typeof response.data === "string") {
    return response.data;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    "url" in response.data &&
    typeof (response.data as { url?: unknown }).url === "string"
  ) {
    return (response.data as { url?: string }).url as string;
  }

  if (response.location) {
    return String(response.location);
  }

  throw new Error("Upload failed");
};
