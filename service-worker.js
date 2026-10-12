self.addEventListener("push", function (event) {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: "ELAWS LOCATION",
      body: event.data ? event.data.text() : "Vous avez une notification."
    };
  }

  const title = data.title || "ELAWS LOCATION";
  const options = {
    body: data.body || "Vous avez un nouvel appel.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: data.tag || "elaws-notification",
    renotify: true,
    data: {
      url: data.url || "/localisation/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/localisation/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(function (windows) {
      for (const client of windows) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});
