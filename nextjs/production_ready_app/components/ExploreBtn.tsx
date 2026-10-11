"use client";

import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log("ExploreBtn clicked")}
    >
      <Link href="#event">
        Explore Events
        <Image
          src="icons/arrow-down.svg"
          width={24}
          height={24}
          alt="Arrow Down"
        />
      </Link>
    </button>
  );
};

export default ExploreBtn;
