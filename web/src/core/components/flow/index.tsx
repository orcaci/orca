import { Workflow } from "./workflow";

export { Workflow };

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
