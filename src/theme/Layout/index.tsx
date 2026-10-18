import React from 'react';

import Head from '@docusaurus/Head';
import Layout from '@theme-original/Layout';
import type { Props } from '@theme/Layout';

export default function LayoutWrapper(props: Props) {
  // work around a Docusaurus bug that causes data-theme to be light
  // in SSR even though the default is dark
  return (
    <Layout {...props} >
      <Head>
        <html data-theme="dark" />
        <body data-theme="dark" />
      </Head>
      {props.children}
    </Layout>
  );
}
