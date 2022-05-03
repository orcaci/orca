import React, { Fragment } from "react";
import { Route } from "react-router-dom";

import { Profiles } from "./profile";

export function ProfilePage() {
  return (
    <Fragment>
      <Route path={["/profiles", "/profiles/:profileId"]} exact>
        <Profiles />
      </Route>
    </Fragment>
  );
}
