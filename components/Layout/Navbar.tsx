import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <div className="flex flex-col border-b border-neutral-300 py-2 px-2 sm:px-8">
      <div className="font-bold text-3xl">
        <a
          className="hover:opacity-50"
          href="https://fiqh-linq-lite.vercel.app/"
        >
          Fiqh Linq
        </a>
      </div>
      <div className="font-bold text-xl mt-1">
        <a
          className="hover:opacity-50"
          href="https://fiqh-linq-lite.vercel.app/"
        >
          Pembantu AI Peguam Syariah
        </a>
      </div>
    </div>
  );
};
