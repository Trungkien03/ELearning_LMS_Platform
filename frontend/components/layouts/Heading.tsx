import { HeadingProps } from '@app/types/Layout.types';
import React, { FC } from 'react';

const Heading: FC<HeadingProps> = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </>
  );
};

export default Heading;
