"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavBar(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 p-4">
      <div className="flex gap-6">
        <Link
          href="/"
          className={`${
            pathname === "/" ? "font-bold text-blue-600" : "text-gray-700"
          } hover:text-blue-500`}
        >
          Design
        </Link>
        <Link
          href="/characters"
          className={`${
            pathname === "/characters"
              ? "font-bold text-blue-600"
              : "text-gray-700"
          } hover:text-blue-500`}
        >
          Characters
        </Link>
      </div>
    </nav>
  );
}
