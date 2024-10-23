import dynamic from "next/dynamic";
import Circular from "@/components/circular";

// Import MonitoringCam secara dinamis
const MonitoringCam = dynamic(() => import("@/components/monitoring"), {
  ssr: false, // Nonaktifkan SSR untuk komponen ini
});
import Result from "@/components/result";

export default function Home() {
  return (
    <div className="flex md:flex-row flex-col gap-4 items-center justify-center">
      <MonitoringCam />
      <Circular />
      <Result />
    </div>
  );
}
