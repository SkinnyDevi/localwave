import React from "react";
import WifiLogo from "../WifiLogo";
import styles from "./Background.module.css";

export default function Background() {
  return (
    <div className={styles.background}>
      <div className={styles.wifi}>
        <div className={styles.wifi_background}>
          <WifiLogo />
        </div>
      </div>
    </div>
  );
}
