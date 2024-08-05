import { Spinner } from "@material-tailwind/react";

export default function Loading({ children, loader = true }) {
  return (
    <div className="flex">
      {loader && <Spinner className="h-10 w-10" />}
      <h1>{children}</h1>
    </div>
  );
}
