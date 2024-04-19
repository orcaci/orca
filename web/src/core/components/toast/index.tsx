import * as Toast from '@radix-ui/react-toast';
import "./index.css";

export const ToastComponent = ({ title = "", onClose, status }: { title?: string, onClose: () => void, status: string }) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        onOpenChange={onClose}
        className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      >
        <ToastStatusIcon status={status} />
        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
          {title}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed top-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};

const ToastStatusIcon = ({ status } : {status: string}) => {
    return status !== "default" ? (
      <div>
        {status === "success" && <div aria-hidden className="checkmark" />}
        {status === "error" && <div aria-hidden className="error" />}
      </div>
    ) : null;
  };

