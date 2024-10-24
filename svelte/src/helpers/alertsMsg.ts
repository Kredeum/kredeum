// Dispatch an alert with status, title & message
//
// dispatchAlert(
//     "info" | "error" | "success",
//     "Title",
//     "Message"
//   );
//
const dispatchAlert = (status: string, title: string, msg: string) => {
  const kredeumAlert = new CustomEvent("KreAlertEvent", {
    detail: {
      status,
      title,
      text: msg
    }
  });
  dispatchEvent(kredeumAlert);
};

export { dispatchAlert };
