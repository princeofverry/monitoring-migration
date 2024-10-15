import Circular from "@/components/circular";
import MonitoringCam from "@/components/monitoring";
import Result from "@/components/result";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex md:flex-row flex-col gap-4">
      <MonitoringCam />
      <Circular />
      <Result />
    </div>
  );
}
