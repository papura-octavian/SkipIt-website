import Image from "next/image";

export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/skipit-mark.png" alt="" width={size} height={size} priority />
      <span className="text-[19px] font-bold tracking-tight">
        Skip<span className="text-pink">It</span>
      </span>
    </span>
  );
}
