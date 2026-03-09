import { Config } from "@remotion/cli/config";

export const config: Config = {
  webpackOverride: (config) => config,
  setVideoImageFormat: "png",
  setCodec: "h264",
};
