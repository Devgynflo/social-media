import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return <Loader2Icon className="mx-auto my-3 animate-spin" />;
};

export default Loading;
