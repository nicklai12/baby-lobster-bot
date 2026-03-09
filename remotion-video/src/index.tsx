import { Composition, registerRoot } from "remotion";
import { BabyLobsterPromo } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BabyLobsterPromo"
        component={BabyLobsterPromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          // 影片配置
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
