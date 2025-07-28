import styles from "../styles/fullScreeniew.module.css";
import { X } from "lucide-react";

function FullScreenView(props: {
  type: "image" | "video";
  src: string;
  effectName: string;
  setDisplay: (
    displayParams: {
      type: "image" | "video";
      src: string;
      effectName: string;
    } | null
  ) => void;
}) {
  return (
    <div className={styles.fullScreenView}>
      <button
        className={styles.crossBtn}
        onClick={() => {
          props.setDisplay(null);
        }}
      >
        <X />
      </button>
      {props.type === "image" ? (
        <img src={props.src} />
      ) : (
        <video src={props.src} controls autoPlay />
      )}
    </div>
  );
}

export default FullScreenView;
