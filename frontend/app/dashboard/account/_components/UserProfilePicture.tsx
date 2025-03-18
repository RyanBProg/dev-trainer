"use client";

import { useState } from "react";
import Image from "next/image";
import { useUserProfilePicture } from "../../_hooks/useUserProfilePicture";
import defaultProfilePicture from "@/public/assets/icons/user.png";
import toast from "react-hot-toast";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { useAddUserProfilePicture } from "../../_hooks/useAddUserProfilePicture";

export default function UserProfilePicture() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: profilePicture,
    isLoading: loadingProfilePicture,
    isFetching: fetchingProfilePicture,
  } = useUserProfilePicture();

  const addProfilePictureMutation = useAddUserProfilePicture();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validFileTypes = ["image/jpeg", "image/png"];
    if (!validFileTypes.includes(selectedFile.type)) {
      toast.error("Only JPEG and PNG files are allowed.");
      return;
    }

    // Validate file size (2MB limit)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File size must be less than 2MB.");
      return;
    }

    // Validate file extension
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error("File extension must be .jpg, .jpeg, or .png.");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !previewUrl) {
      toast.error("Please upload a valid image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // Match the key "image" expected on the backend

    try {
      await addProfilePictureMutation.mutateAsync(formData);
      setPreviewUrl(null);
      setFile(null);
    } catch (error) {
      toast.error("Failed to add profile picture");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <div className="my-10 flex flex-col sm:flex-row gap-10 items-center">
        <div className="flex justify-center items-center rounded-full h-24 w-24 overflow-clip">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="user profile icon"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : loadingProfilePicture || fetchingProfilePicture ? (
            <LoadingSpinner size="md" />
          ) : (
            <Image
              className="object-cover"
              src={profilePicture?.userPicture || defaultProfilePicture}
              alt="user profile icon"
              width={96}
              height={96}
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
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
