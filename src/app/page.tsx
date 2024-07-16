"use client";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Spinner from "../components/Spinner/Spinner";

export default function Home() {
  const [knownFaces, setKnownFaces] = useState<File[]>([]);
  const [isUploadKnownFace, setIsUploadKnownFace] = useState(false);
  const [unknownFace, setUnknownFace] = useState<File | null>(null);
  const [isUploadUnknownFace, setIsUploadUnknownFace] = useState(false);
  const [processedFace, setProcessedFace] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKnownFacesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setKnownFaces((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveKnownFace = (index: number) => {
    setKnownFaces((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadKnownFaces = async () => {
    await axios.post("/api/delete?type=known");
    await axios.post("/api/delete?type=unknown");
    for (const knownFace of knownFaces) {
      await uploadFile(knownFace, "known");
    }
    setIsUploadKnownFace(true);
  };

  const handleClearKnownFaces = () => {
    setKnownFaces([]);
    setIsUploadKnownFace(false);
    setUnknownFace(null);
    setIsUploadUnknownFace(false);
    setProcessedFace("");
  };

  const handleUnknownFaceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setUnknownFace(file);
  };

  const handleRemoveUnknownFace = () => {
    setUnknownFace(null);
  };

  const handleUploadUnknownFace = async () => {
    await axios.post("/api/delete?type=unknown");
    if (unknownFace) {
      await uploadFile(unknownFace, "unknown");
      setIsUploadUnknownFace(true);
    } else {
      console.error("No file selected");
    }
  };

  const handleClearUnknownFace = () => {
    setUnknownFace(null);
    setIsUploadUnknownFace(false);
    setProcessedFace("");
  };

  const uploadFile = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`/api/upload?type=${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmitUnknownFace = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/submit");

      if (response.status === 200 && response.data.length) {
        setProcessedFace(response.data[0]);
      } else {
        console.error(
          "Unexpected response format or empty response:",
          response
        );
      }
    } catch (error) {
      console.error("Error submitting unknown face:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="px-8 md:px-16 py-16 text-white min-h-screen">
      {isLoading && <Spinner />}
      <div className="flex justify-center items-end mb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
          Face Finder
        </h1>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-6">
          <h2 className="text-xl md:text-3xl font-semibold tracking-wide">
            Known Faces
          </h2>
          {!isUploadKnownFace && (
            <div className="tooltip">
              <label className="btn">
                <Image
                  src="/search.svg"
                  alt="Search Logo"
                  width={16}
                  height={16}
                />
                <input
                  id="known"
                  type="file"
                  key={knownFaces.length}
                  className="hidden"
                  onChange={handleKnownFacesChange}
                  accept=".jpg, .jpeg, .png"
                  multiple
                />
              </label>
              <span className="tooltiptext">Search</span>
            </div>
          )}
        </div>
        {knownFaces.length > 0 && isUploadKnownFace && (
          <div className="tooltip">
            <label className="btn" onClick={handleClearKnownFaces}>
              <Image src="/cross.svg" alt="Cross Logo" width={16} height={16} />
            </label>
            <span className="tooltiptext">Clear</span>
          </div>
        )}
        {knownFaces.length > 0 && !isUploadKnownFace && (
          <div className="tooltip">
            <label className="btn" onClick={handleUploadKnownFaces}>
              <Image
                src="/upload.svg"
                alt="Upload Logo"
                width={16}
                height={16}
              />
            </label>
            <span className="tooltiptext">Upload</span>
          </div>
        )}
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 mb-8">
        {knownFaces.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={index} className="relative mb-2 break-inside">
              <Image
                src={url}
                alt={`Known Face ${index + 1}`}
                width={400}
                height={300}
                className="rounded-xl"
              />
              {!isUploadKnownFace && (
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30"
                  onClick={() => handleRemoveKnownFace(index)}
                >
                  <Image
                    src="/cross.svg"
                    alt="Cross Logo"
                    width={16}
                    height={16}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
          <div className="flex justify-between mb-4">
            {isUploadKnownFace && (
              <div className="flex items-center gap-6">
                <h2 className="text-xl md:text-3xl font-semibold tracking-wide">
                  Unknown Face
                </h2>
                {!isUploadUnknownFace && (
                  <div className="tooltip">
                    <label className="btn">
                      <Image
                        src="/search.svg"
                        alt="Search Logo"
                        width={16}
                        height={16}
                      />
                      <input
                        id="unknown"
                        type="file"
                        key={unknownFace ? unknownFace.name : "unknown"}
                        className="hidden"
                        onChange={handleUnknownFaceChange}
                        accept=".jpg, .jpeg, .png"
                      />
                    </label>
                    <span className="tooltiptext">Search</span>
                  </div>
                )}
              </div>
            )}
            {unknownFace && isUploadUnknownFace && (
              <div className="tooltip">
                <label className="btn" onClick={handleClearUnknownFace}>
                  <Image
                    src="/cross.svg"
                    alt="Cross Logo"
                    width={16}
                    height={16}
                  />
                </label>
                <span className="tooltiptext">Clear</span>
              </div>
            )}
            {unknownFace && !isUploadUnknownFace && (
              <div className="tooltip flex items-center">
                <label className="btn" onClick={handleUploadUnknownFace}>
                  <Image
                    src="/upload.svg"
                    alt="Upload Logo"
                    width={16}
                    height={16}
                  />
                </label>
                <span className="tooltiptext">Upload</span>
              </div>
            )}
          </div>

          {unknownFace && (
            <div className="relative">
              <Image
                src={URL.createObjectURL(unknownFace)}
                alt="Unknown Face"
                width={2000}
                height={1000}
                className="rounded-xl"
              />
              {!isUploadUnknownFace && (
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30"
                  onClick={handleRemoveUnknownFace}
                >
                  <Image
                    src="/cross.svg"
                    alt="Cross Logo"
                    width={16}
                    height={16}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {isUploadUnknownFace && (
          <div className="w-full h-px md:h-auto md:w-px md:mt-14 md:mb-1 bg-gray-400"></div>
        )}

        <div className="w-full md:w-1/2 md:pl-4 mt-4 md:mt-0">
          <div className="flex justify-between mb-4">
            {isUploadUnknownFace && (
              <div className="flex items-center">
                <h2 className="text-xl md:text-3xl font-semibold tracking-wide">
                  Processed Face
                </h2>
              </div>
            )}
            {isUploadUnknownFace && (
              <div className="tooltip flex items-center">
                <label className="btn" onClick={handleSubmitUnknownFace}>
                  <Image
                    src="/done.svg"
                    alt="Done Logo"
                    width={16}
                    height={16}
                  />
                </label>
                <span className="tooltiptext">Submit</span>
              </div>
            )}
          </div>

          {processedFace && (
            <div className="relative">
              <Image
                src={processedFace}
                alt="Processed Face"
                width={2000}
                height={1000}
                className="rounded-xl"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
