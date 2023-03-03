/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

// SW SETUP

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg")),
  new CacheFirst({
    cacheName: "localwave_images",
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") return false;

  if (url.pathname.startsWith("/_")) return false;

  if (url.pathname.match(fileExtensionRegexp)) return false;

  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

// EVENTS

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", () => {
  clientsClaim();
});

self.addEventListener("message", (event) => {
  if (event.data) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      default:
        break;
    }
  }
});
