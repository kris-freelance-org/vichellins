import { EditableInfoPage } from "@/components/EditableInfoPage";
import { sitePageMetadata } from "@/lib/site-content";
export const generateMetadata = () => sitePageMetadata("privacy");
export default function Page() { return <EditableInfoPage pageKey="privacy" />; }
