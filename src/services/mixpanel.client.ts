import mixpanelClient from "mixpanel-browser";

export const mpClient = mixpanelClient.init(
  "bec4b389c12e6cfa0ccf1d0c92c86be4",
  {
    track_pageview: false,
  },
  "parking-finder",
);
