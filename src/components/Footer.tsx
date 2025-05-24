import { cn } from "@/lib/utils";

export const Footer = ({ className, ...props }: React.ComponentProps<"footer">) => {
  return (
    <footer className={cn("container mx-auto p-4 pb-8", className)} {...props}>
      <p className="text-sm text-muted text-center select-none text-balance">
        This page is not affiliated, associated, authorized, endorsed by, or in any way officially connected with
        Nike,&nbsp;Inc., or any of its subsidiaries or its affiliates. The official Nike website can be found at{" "}
        <a
          target="_blank"
          href="https://www.nike.com"
          className="transition-opacity duration-100 opacity-30 hover:opacity-100"
          rel="noreferrer"
        >
          https://www.nike.com
        </a>
        .
      </p>
    </footer>
  );
};
