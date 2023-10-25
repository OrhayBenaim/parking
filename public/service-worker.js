self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    showLocalNotification(data.title, data.options.body, self.registration);
  }
});
const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
  };
  swRegistration.showNotification(title, options);
};
