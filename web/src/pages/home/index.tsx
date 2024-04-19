import { useEffect, useState } from "react";
import { ApplicationCard } from "core/components/app_card";
import { Service } from "service";
import { Endpoint } from "service/endpoint";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Spinner } from "core/components/spinner";
import { Flex, IconButton } from "@radix-ui/themes";

export interface Application {
  id: string;
  name: string;
  description: string;
}

export function Home() {
  const [applications, setApplications] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const fetchApplications = async () => {
    setIsListLoading(true);
    await Service.get(Endpoint.v1.application.getApplications)
      .then((appList) => {
        setApplications(appList);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <div className="appHeader">
        <p>My Applications</p>
        <Flex gap="3">
          <IconButton
            className="cursor-pointer"
            size="3"
            color="indigo"
            variant="soft"
            onClick={() => {}}
          >
            <PlusIcon width="22" height="22" />
          </IconButton>
        </Flex>
      </div>
      {!applications.length && !isListLoading && (
        <div>No applications found. Please create a new one</div>
      )}
      {isListLoading && (
        <div className="loader">
          <Spinner />
        </div>
      )}
      {!isListLoading && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {applications.map((app: Application) => (
            <ApplicationCard key={app.id} appDetails={app} />
          ))}
        </div>
      )}
    </>
  );
}
