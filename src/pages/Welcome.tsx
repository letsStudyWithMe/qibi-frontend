import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 智能BI平台
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            智能BI平台是一个基于 React + Spring Boot + MQ + AIGC 的智能数据分析平台，
            用户只需要导入原始数据集、并输入分析诉求，就能自动生成可视化图表及分析结论，实现数据分析的降本增效。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="https://umijs.org/docs/introduce/introduce"
              title="了解 BI平台"
              desc="BI平台是商业智能（Business Intelligence）的缩写，用于摄取业务数据并将数据呈现在用户友好型视图中，如报告、仪表板、图表和图形。BI平台的核心作用是对获取的数据进行分析，以获得切实可行的洞察，制定出更加明智的决策。
BI平台通常都会提供以下功能的某种组合：支持自定义的仪表板、数据可视化、报告计划（带有安全规范）、面向 IT 部门的数据质量管理和监督等"
            />
            <InfoCard
              index={2}
              title="了解 AIGC"
              href="https://ant.design"
              desc="AIGC，全称为Artificial Intelligence Generated Content，中文译为人工智能生成内容。这是一种通过人工智能技术自动生成内容的生产方式。在更广义的理解中，AIGC并不仅仅局限于内容生成，它还包括利用AI来创建虚拟应用、非同质化代币（NFT）等。"
            />
            <InfoCard
              index={3}
              title="了解 MQ"
              href="https://procomponents.ant.design"
              desc="消息队列（MQ），也被称为Message Queue，是一种基础数据结构中的'先进先出'形式的数据结构。它本质上是一个保存消息的容器，即一个队列。MQ的主要功能是解决应用程序之间的通信问题，常用于业务异步解耦、解耦微服务、流量削峰填谷、消息分发和保证分布式事务的数据一致性等场景。
MQ的工作原理是这样的：生产者生产消息并将要传输的数据（即消息）放入队列中，然后通过队列机制来实现消息的传递。消费者则可以从指定的队列中拉取消息，或者订阅相应的队列，由MQ服务端主动向其推送消息。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
