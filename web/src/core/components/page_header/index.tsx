import { BackspaceIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  extra?: ReactNode;
  backIcon?: boolean;
  children?: ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="pt-4 px-5"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "1rem"
        }}
      >
        <p
          style={{
            fontSize: 22,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {props.backIcon && (
            <IconButton variant="soft" onClick={() => navigate(-1)}>
              <BackspaceIcon className="size-6" />
            </IconButton>
          )}
          {props.title}
        </p>
        <div className="extra">{props.extra}</div>
      </div>
      {/* <div className="px-5">children{props.children}</div> */}
    </>
  );
}
