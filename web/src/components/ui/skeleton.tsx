import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("srcanimate-pulse srcrounded-md srcbg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
