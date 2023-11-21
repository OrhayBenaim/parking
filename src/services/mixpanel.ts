import mixpanel from "mixpanel";

export const mp = mixpanel.init("bec4b389c12e6cfa0ccf1d0c92c86be4", {
  test: true,
  debug: true,
  host: "api-eu.mixpanel.com",
});
