"use client";
import Image from "next/image";
export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col">
        <Image
          alt="Animated Gif Electric Car"
          src="/images/electric_car.gif"
          width={500}
          height={500}
          className="mx-auto"
        />
        <span className="mx-auto text-black uppercase font-bold">
          Please be patient, we&apos;re loading the page. This might take a few
          moments
        </span>
      </div>
    </main>
  );
}
