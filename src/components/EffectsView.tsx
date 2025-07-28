import Effect from "./Effect";
import styles from "../styles/effectsView.module.css";

function EffectsView(props: {
  currentEffect: string;
  handleCurrentEffectChange: (effectName: string) => void;
}) {
  const photoboothEffects = [
    "Normal",
    "Sepia",
    "Black & White",
    "Glow",
    "Comic Book",
    "Thermal Camera",
    "X-Ray",
    "Pop Art",
    "retro crt",
  ];

  return (
    <div className={styles.effectGrid}>
      {photoboothEffects.map((effect, index) => {
        return (
          <Effect
            currentEffect={props.currentEffect}
            key={index}
            name={effect}
            handleCurrentEffectChange={props.handleCurrentEffectChange}
          />
        );
      })}
    </div>
  );
}

export default EffectsView;
