import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return (
    <div className="mx-auto my-3 animate-spin">
      <Loader2Icon />
    </div>
  );
};

export default Loading;
