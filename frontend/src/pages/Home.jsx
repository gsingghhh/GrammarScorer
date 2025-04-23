import React, { useEffect, useState, useContext } from "react";
import Logo from "../components/Logo.jsx";
import axios from "axios";
import { UserContext } from "../contexts/UserContext.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const { user } = useContext(UserContext);
  const [transcriptions, setTranscriptions] = useState([]);
  const [currentTranscription, setCurrentTranscription] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const fetchTranscriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/profile/my-transcriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTranscriptions(res.data);
    } catch (err) {
      console.error("Failed to fetch transcriptions", err);
    }
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transcription/audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedFile(null);
      setCurrentTranscription(res.data);
      fetchTranscriptions();
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
          setAudioUrl(URL.createObjectURL(event.data));
        };

        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        setError("Failed to access microphone.");
        console.error(err);
      }
    }
  };

  const handleUploadRecordedAudio = async () => {
    if (!audioBlob) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded-audio.wav");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transcription/audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentTranscription(res.data);
      fetchTranscriptions();
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/profile/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTranscriptions();
    } catch (err) {
      console.error("Failed to delete transcription", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 md:px-8 py-8 relative overflow-hidden">
      <div className="absolute top-4 left-4 md:left-8 flex items-center gap-10">
        <Logo />
        <span className="text-sm sm:text-base font-semibold text-white">
          Hey, {user?.fullName || "User"}
        </span>
      </div>

      <button
        onClick={() => setShowDrawer(!showDrawer)}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 border border-gray-600 px-2 py-1 rounded-l-lg"
      >
        {showDrawer ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black border-l border-gray-700 transform ${
          showDrawer ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 overflow-y-auto p-4`}
      >
        <h3 className="text-xl font-bold mb-4">Past Transcriptions</h3>
        {transcriptions.length === 0 ? (
          <p className="text-gray-400">No transcriptions found.</p>
        ) : (
          <div className="space-y-4">
            {transcriptions.map((t) => (
              <div
                key={t._id}
                className="bg-white/10 border border-gray-700 p-4 rounded-xl relative"
              >
                <p className="font-semibold text-sm mb-1 text-blue-400">
                  Score: {t.score}
                </p>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">
                  {t.transcription}
                </p>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs bg-white/10 px-2 py-1 rounded-lg border border-red-400"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-24">
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Transcribe your voice,
            <br /> Score your speech.
          </h1>

          <div className="space-y-4">
            <button
              onClick={handleRecord}
              className={`w-full sm:w-auto ${
                isRecording ? "bg-red-600" : "bg-blue-600"
              } hover:${isRecording ? "bg-red-700" : "bg-blue-700"} px-6 py-3 rounded-xl font-semibold shadow-md transition`}
            >
              {isRecording ? "Stop Recording" : "Record New Voice"}
            </button>

            {audioUrl && (
              <div className="mt-4">
                <audio controls src={audioUrl} className="w-full" />
                <button
                  onClick={handleUploadRecordedAudio}
                  disabled={uploading}
                  className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold shadow disabled:opacity-50 transition w-full sm:w-auto"
                >
                  {uploading ? "Uploading..." : "Upload Recording"}
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl text-sm w-full sm:w-auto"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold shadow disabled:opacity-50 transition w-full sm:w-auto"
              >
                {uploading ? "Uploading..." : "Upload Sample"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-inner border border-gray-700 overflow-y-auto max-h-[60vh]">
          <h3 className="text-xl font-semibold mb-4">Current Transcription</h3>
          {currentTranscription ? (
            <div>
              <p className="font-semibold text-sm mb-1 text-green-400">
                Score: {currentTranscription.score}
              </p>
              <p className="text-sm text-gray-200 whitespace-pre-wrap mb-4">
                {currentTranscription.transcription}
              </p>
              <h4 className="font-semibold text-sm text-yellow-400">Suggestions:</h4>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {currentTranscription.suggestions}
              </pre>
            </div>
          ) : (
            <p className="text-gray-400">No transcription uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
