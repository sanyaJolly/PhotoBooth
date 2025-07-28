import {
  Camera as CameraImg,
  Grid2x2,
  Image,
  Video,
  Pause,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/camera.module.css";
import EffectsView from "./EffectsView";
import FullScreenView from "./FullScreenView";

function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<
    Array<{ src: string; effectName: string; type: "image" | "video" }>
  >([]);
  const [mode, setMode] = useState<"camera" | "video">("camera");
  const [showEffects, setShowEffects] = useState<boolean>(false);
  const [currentEffect, setCurrentEffect] = useState<string>("normal");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "inactive" | "recording"
  >("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [recordedVideo, setRecordedVideo] = useState<string>("");
  const [display, setDisplay] = useState<{
    src: string;
    effectName: string;
    type: "image" | "video";
  } | null>(null);
  const mimeType = "video/webm";

  async function startCamera() {
    const streamVideo = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = streamVideo;
      setStream(streamVideo);
    }
  }

  function takePhoto() {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL("image/png");
        setPhotos([
          ...photos,
          { src: photoData, effectName: currentEffect, type: "image" },
        ]);
      }
    }
  }

  const startRecording = async () => {
    if (!stream) return;

    setRecordingStatus("recording");
    setVideoChunks([]); // Clear previous chunks

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;

    // Set up data collection
    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setVideoChunks((prev) => [...prev, event.data]);
      }
    };

    // Handle recording stop
    media.onstop = () => {
      // This will be handled by the videoChunks useEffect
    };

    media.start();
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingStatus === "recording") {
      setRecordingStatus("inactive");
      mediaRecorder.current.stop();
    }
  };

  // Handle video blob creation when chunks are updated
  useEffect(() => {
    if (videoChunks.length > 0 && recordingStatus === "inactive") {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setPhotos([
        ...photos,
        { src: videoUrl, effectName: "normal", type: "video" },
      ]);
    }
  }, [videoChunks, recordingStatus]);

  useEffect(() => {
    if (showEffects === false) startCamera();
  }, [showEffects]);

  function handleCurrentEffectChange(effectName: string) {
    setCurrentEffect(effectName);
    setShowEffects(false);
  }

  const getEffectStyle = (effectName: string) => {
    switch (effectName.toLowerCase()) {
      case "normal":
        return {};
      case "sepia":
        return { filter: "sepia(100%)" };
      case "black & white":
        return { filter: "grayscale(100%)" };
      case "glow":
        return {
          filter: "brightness(120%) saturate(120%)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        };
      case "comic book":
        return {
          filter: "contrast(150%) saturate(150%) hue-rotate(30deg)",
          imageRendering: "pixelated",
        };
      case "thermal camera":
        return {
          filter: "hue-rotate(200deg) saturate(200%) contrast(150%)",
          mixBlendMode: "multiply",
        };
      case "x-ray":
        return {
          filter: "invert(100%) contrast(200%) brightness(150%)",
          backgroundColor: "black",
        };
      case "pop art":
        return {
          filter: "contrast(200%) saturate(300%) hue-rotate(90deg)",
          imageRendering: "pixelated",
        };
      case "retro crt":
        return {
          filter: "contrast(150%) saturate(120%) hue-rotate(10deg)",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)",
          backgroundBlendMode: "overlay",
          boxShadow: "0 0 10px rgba(0, 255, 100, 0.5)",
        };
      default:
        return {};
    }
  };

  function deletePhotoByIndex(index) {
    setPhotos(
      photos.filter((photo, idx) => {
        if (index === idx) {
          return false;
        } else {
          return true;
        }
      })
    );
  }

  return (
    <div>
      {display === null ? null : (
        <FullScreenView
          effectName={display?.effectName}
          type={display.type}
          src={display.src}
          setDisplay={setDisplay}
        />
      )}

      {showEffects === true ? (
        <EffectsView
          currentEffect={currentEffect}
          handleCurrentEffectChange={handleCurrentEffectChange}
        />
      ) : (
        <div className={styles.videoParent}>
          {photos.length === 0 ? null : (
            <div className={styles.photoData}>
              {photos.map((photo, index) => {
                return (
                  <div className={styles.photo}>
                    <button
                      className={styles.photoDelBtn}
                      onClick={() => {
                        deletePhotoByIndex(index);
                      }}
                    >
                      <X />
                    </button>
                    {photo.type === "video" ? (
                      <video
                        onClick={() => {
                          setDisplay(photo);
                        }}
                        key={index}
                        src={photo.src}
                        controls
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setDisplay(photo);
                        }}
                        key={index}
                        src={photo.src}
                        style={getEffectStyle(photo.effectName)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <video
            className={styles.video}
            ref={videoRef}
            autoPlay={true}
            style={getEffectStyle(currentEffect)}
          />
        </div>
      )}

      <div className={styles.camActions}>
        <div className={styles.camMode}>
          <div>
            <Grid2x2 />
          </div>
          <div
            onClick={() => {
              setMode("camera");
            }}
          >
            <Image />
          </div>
          <div
            onClick={() => {
              setMode("video");
            }}
          >
            <Video />
          </div>
        </div>
        <div
          onClick={() => {
            if (mode === "camera") {
              takePhoto();
            } else {
              if (recordingStatus === "inactive") {
                startRecording();
              } else {
                stopRecording();
              }
            }
          }}
        >
          {mode === "camera" ? (
            <CameraImg />
          ) : recordingStatus === "recording" ? (
            <Pause />
          ) : (
            <Video />
          )}
        </div>
        <div
          onClick={() => {
            setShowEffects(!showEffects);
          }}
        >
          <button> Effects</button>
        </div>
      </div>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}

export default Camera;
