import { networkInterfaces } from "os";
import NotificationCenter from "node-notifier/notifiers/notificationcenter.js";
import WindowsToaster from "node-notifier/notifiers/toaster.js";
import path from "path";

import NotifierExecutables from "./interfaces/NotifierExecutables.js";

type LocalNetworks = {
  [key: string]: string;
};

export interface CustomProcess extends NodeJS.Process {
  pkg?: Object;
}

/**
 * Class for common utilities.
 */
export default class CommonUtils {
  private static readonly nets = networkInterfaces();
  private static readonly NOTICON = path.join(
    path.dirname(process.argv[0]),
    "notifier",
    "noticon.png"
  );

  private static readonly MAC_NOTI_CENTER = new NotificationCenter({
    customPath: this.getNotifierPath(NotifierExecutables.terminal.exec),
  });
  private static readonly WIN_NOTI_CENTER = new WindowsToaster({
    customPath: this.getNotifierPath(NotifierExecutables.snoreToast.x64),
  });

  /**
   * Returns an object with your connected network IPv4 interfaces.
   * Used to get your local machine's IP for the server host.
   *
   * @returns `LocalNetworks` object with respective interfaces.
   */
  static networks(): LocalNetworks {
    const results = {};

    for (let n of Object.keys(this.nets)) {
      for (let net of this.nets[n])
        if (net.family === "IPv4" && !net.internal) results[n] = net.address;
    }

    return results;
  }

  /**
   * Tests if the script is running in a production build.
   *
   * @returns True if running in production.
   */
  static testForProduction() {
    return process.env.NODE_ENV.split(" ")[0] === "production";
  }

  /**
   * Sends a native notification to the user to notify the Local Wave app address.
   *
   * @param domain - The app url domain.
   */
  static notifyServerAddress(domain: string) {
    const generic = {
      title: "Local Wave",
      message: "App started at: http://" + domain,
      icon: this.NOTICON,
      sound: this.testForProduction(),
    };

    switch (process.platform) {
      case "win32":
        this.WIN_NOTI_CENTER.notify(generic, (err) => {
          if (err !== null) {
            console.error("[server] Could not send notification: ", err);
          }
        });
        break;

      default:
        const mac_noti: NotificationCenter.Notification = {
          title: generic.title,
          message: generic.message,
          icon: generic.icon,
          sound: "Funk",
          contentImage: generic.icon,
          wait: true,
          timeout: 10,
        };

        this.MAC_NOTI_CENTER.notify(mac_noti, (err) => {
          if (err !== null) {
            console.error("[server] Could not send notification: ", err);
          }
        });
        break;
    }
  }

  /**
   * Gets the node-notifier respective executable path from the input executable.
   *
   * @param exec - Name/Path of executable.
   * @returns Path string pointing to execuable path.
   */
  private static getNotifierPath(exec: string) {
    return path.join(path.dirname(process.argv[0]), "notifier", exec);
  }
}
