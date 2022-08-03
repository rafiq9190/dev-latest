import React from 'react';
import { Badge } from 'react-bootstrap';

import { getUserExtras } from '../utils/auth';
import _ from 'lodash';

const Statistics = () => {
  const userExtras = getUserExtras();
  const projectCount =
    userExtras && userExtras.projects
      ? Object.keys(userExtras.projects).length
      : 0;
  const publishedCount =
    userExtras && userExtras.projects
      ? _.filter(userExtras.projects, { published: true }).length
      : 0;
  const unpublishedCount = projectCount - publishedCount;

  return (
    <div style={{ marginBottom: '25px' }}>
      <Badge color="blue">Total Pages</Badge>
      <Badge display="inline-flex" margin={8} color="blue" isSolid>
        {projectCount}
      </Badge>
      <Badge color="green">Published Pages</Badge>
      <Badge display="inline-flex" margin={8} color="green" isSolid>
        {publishedCount}
      </Badge>
      <Badge color="yellow">UnPublished Pages</Badge>
      <Badge display="inline-flex" margin={8} color="yellow" isSolid>
        {unpublishedCount}
      </Badge>
    </div>
  );
};

export default Statistics;
