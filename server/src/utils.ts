import { networkInterfaces } from "os";

export default class CommonUtils {
  private static readonly nets = networkInterfaces();

  static networks(): Object {
    const results = {};

    for (let n of Object.keys(this.nets)) {
      for (let net of this.nets[n])
        if (net.family === "IPv4" && !net.internal) results[n] = net.address;
    }

    return results;
  }
}
