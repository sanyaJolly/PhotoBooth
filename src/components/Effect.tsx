import { useEffect, useRef } from "react";
import styles from "../styles/effect.module.css";

type Props = {
  name: string;
  currentEffect: string;
  handleCurrentEffectChange: (effectName: string) => void;
};

const Effect = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  useEffect(() => {
    startCamera();
  }, []);

  // Function to get CSS filter based on effect name
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

  return (
    <div
      className={styles.effectContainer}
      onClick={() => {
        props.handleCurrentEffectChange(props.name);
      }}
    >
      <video
        className={styles.videoContainer}
        ref={videoRef}
        autoPlay={true}
        muted={true}
        playsInline={true}
        //@ts-expect-error configuring typescript
        style={getEffectStyle(props.name)}
      />
      <div className={styles.effectLabel}>{props.name}</div>
    </div>
  );
};

export default Effect;
