import { WorkspaceView } from "@/components/WorkspaceView";
import { getSitePage, sitePageMetadata } from "@/lib/site-content";
export const generateMetadata = () => sitePageMetadata("workspace");
export default async function Page() { return <WorkspaceView content={await getSitePage("workspace")} />; }
