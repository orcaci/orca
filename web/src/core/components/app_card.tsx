import { Card, Text } from "@radix-ui/themes";
import { Application } from "pages/home";
import { useNavigate } from "react-router-dom";

interface ApplicationCardProps {
  appDetails: Application;
}

export function ApplicationCard(prop: ApplicationCardProps) {
  const { appDetails } = prop;
  const navigate = useNavigate();
  return (
    <Card
      asChild
      className="w-1/6 p-3 m-5"
      onClick={() => navigate(`/app/${appDetails.id}`)}
    >
      <a href="#">
        <Text as="div" size="2" weight="bold">
          {appDetails.name}
        </Text>
        <Text as="div" color="gray" size="2">
          {appDetails.description}
        </Text>
      </a>
    </Card>
  );
}
