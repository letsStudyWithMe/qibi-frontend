import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '智能BI平台';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/letsStudyWithMe/qibi-backend',
          blankTarget: true,
        },
        {
          key: '智能BI平台',
          title: '智能BI平台',
          href: 'https://github.com/letsStudyWithMe/qibi-backend',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
