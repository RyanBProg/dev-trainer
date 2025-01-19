import { useState } from "react";
import Image from "next/image";
import ProfileIcon from "@/app/_assets/icons/user.png";

export default function UserProfilePicture() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    // Reset errors and preview
    setError(null);
    setPreviewUrl(null);

    if (!selectedFile) return;

    // Validate file type
    const validFileTypes = ["image/jpeg", "image/png"];
    if (!validFileTypes.includes(selectedFile.type)) {
      setError("Only JPEG and PNG files are allowed.");
      return;
    }

    // Validate file size (2MB limit)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (selectedFile.size > maxSizeInBytes) {
      setError("File size must be less than 2MB.");
      return;
    }

    // Validate file extension
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError("File extension must be .jpg, .jpeg, or .png.");
      return;
    }

    // If all validations pass, set the file
    setFile(selectedFile);

    // Generate preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a valid image.");
      return;
    }

    // Process the file here (e.g., send it to the server)
    console.log("File ready to upload:", file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <div className="my-10 flex gap-10 items-center">
        <div className="rounded-full bg-white h-24 w-24 overflow-clip">
          {previewUrl ? (
            <div className="mt-4">
              <Image
                src={previewUrl}
                alt="user profile icon"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          ) : (
            <Image
              className="-mt-1 object-cover"
              src={ProfileIcon}
              alt="user profile icon"
              width={96}
              height={96}
            />
          )}
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="profile-picture" className="btn btn-primary btn-sm">
            Upload Profile Picture
          </label>
          <input
            type="file"
            id="profile-picture"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleFileChange}
          />

          {error && <p className="text-red-500">{error}</p>}
          {file && (
            <button type="submit" className="btn btn-success btn-sm">
              Submit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
