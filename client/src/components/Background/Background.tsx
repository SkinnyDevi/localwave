import { useEffect } from "react";
import WifiLogo from "../WifiLogo";
import styles from "./Background.module.css";

export default function Background() {
  useEffect(() => {
    document.querySelectorAll("[ripple-size]").forEach((r) => {
      const ripple = r as HTMLDivElement;
      const rippleSize = +r.getAttribute("ripple-size")!;

      ripple.style.width = `${50 * rippleSize}px`;
      ripple.style.height = `${50 * rippleSize}px`;
    });
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.wifi}>
        <div className={styles.wifi_background}>
          <div className={styles.ripple}>
            <div ripple-size={1}></div>
            <div ripple-size={2}></div>
            <div ripple-size={3}></div>
          </div>
          <div className={styles.signal_logo}>
            <WifiLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
