import { EditableInfoPage } from "@/components/EditableInfoPage";
import { sitePageMetadata } from "@/lib/site-content";
export const generateMetadata = () => sitePageMetadata("terms");
export default function Page() { return <EditableInfoPage pageKey="terms" />; }
