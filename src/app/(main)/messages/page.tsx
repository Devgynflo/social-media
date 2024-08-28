import { Metadata, NextPage } from "next";
import { Chat } from "./chat";

interface Props {}

export const metadata: Metadata = {
  title: "Messages",
};

const Page: NextPage<Props> = ({}) => {
  return <Chat></Chat>;
};

export default Page;
