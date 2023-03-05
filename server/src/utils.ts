import { networkInterfaces } from "os";
import { notify } from "node-notifier";

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

  static testForProduction() {
    return process.env.NODE_ENV.split(" ")[0] === "production";
  }

  static notifyServerAddress(domain: string) {
    const notification = {
      title: "Local Wave",
      message: "App started at: http://" + domain,
    };

    notify(notification, (err) => {
      if (err !== null) {
        console.error("[server] Could not send notification: ", err);
      }
    });
  }
}
