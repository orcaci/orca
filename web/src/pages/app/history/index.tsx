import { useParams } from "react-router-dom";
import { ExecutionHistory } from "./historys";

export function History() {
  const { appId = "" } = useParams();
  return (
    <div className="mb-4 py-4">
      <ExecutionHistory></ExecutionHistory>
    </div>
  );
}
