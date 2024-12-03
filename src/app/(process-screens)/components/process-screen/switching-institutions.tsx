"use client";
import Image from "next/image";

export default function SwitchingInstitutions({
  logo,
  title,
  description,
}: {
  logo: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        className="size-10 object-scale-down"
        src={logo}
        referrerPolicy="origin"
        width={150}
        height={150}
        alt=""
      />
      {title}
      {description}
      {/* <EmptyState description={description} title={title} size="xlarge" /> */}
    </div>
  );
}
