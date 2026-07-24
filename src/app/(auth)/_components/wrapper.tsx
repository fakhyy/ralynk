import Link from "next/link";
import { motion } from "motion/react";

interface AuthPageWrapperProps {
  title: string;
  description: string;
  footer?: {
    link: string;
    label: string;
    linkText: string;
  };
  children: React.ReactNode;
}

export function AuthPageWrapper({
  children,
  description,
  footer,
  title,
}: AuthPageWrapperProps) {
  return (
    <motion.div
      className="w-full max-w-sm space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer && (
        <p className="text-center text-sm text-muted-foreground">
          {footer.label}{" "}
          <Link
            href={footer.link}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {footer.linkText}
          </Link>
        </p>
      )}
    </motion.div>
  );
}
