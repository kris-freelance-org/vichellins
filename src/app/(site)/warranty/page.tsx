import { EditableInfoPage } from "@/components/EditableInfoPage";
import { sitePageMetadata } from "@/lib/site-content";
export const generateMetadata = () => sitePageMetadata("warranty");
export default function Page() { return <EditableInfoPage pageKey="warranty" />; }
