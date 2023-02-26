import { useEffect, useState } from "react";
import WifiLogo from "../WifiLogo";
import styles from "./Background.module.css";

export default function Background() {
  const [timer, setTimerComplete] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTimerComplete(true);
    }, 100);
  }, []);

  useEffect(() => {
    document.querySelectorAll("[ripple-size]").forEach((r) => {
      const ripple = r as HTMLDivElement;
      const rippleSize = +r.getAttribute("ripple-size")!;

      ripple.style.width = `${50 * rippleSize}px`;
      ripple.style.height = `${50 * rippleSize}px`;
    });
  }, [timer]);

  return (
    <div className={styles.background}>
      <div className={styles.wifi}>
        <div className={styles.wifi_background}>
          {timer ? (
            <div className={styles.ripple}>
              <div ripple-size={1}></div>
              <div ripple-size={2}></div>
              <div ripple-size={3}></div>
            </div>
          ) : null}
          <div className={styles.signal_logo}>
            <WifiLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
