import React, { useEffect, useState } from 'react';
// @ts-ignore
import { listUserChartByPageUsingPost } from '@/services/qibi/chartController';
import { Avatar, List, message } from 'antd';
import ReactECharts from 'echarts-for-react';

const ChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 12,
  };
  // @ts-ignore
  const [searchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    try {
      const res = await listUserChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        // @ts-ignore
        setTotal(res.data.total ?? 0);
      } else {
        message.error('获取列表失败');
      }
    } catch (e: any) {
      message.error('获取列表失败,' + e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  if (total === 0) {
    return (
      <div className="chart-page-no-result">
        <img alt="kongkongruye" src="/kongkongruye.jpg" />
      </div>
    );
  } else {
    return (
      <div className="chart-page">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={chartList}
          /*        footer={
                    <div>
                      <b>ant design</b> footer part
                    </div>
                  }*/
          renderItem={(item) => (
            <List.Item
              key={item.id}
              /*  extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }*/
            >
              <List.Item.Meta
                avatar={<Avatar src={'https://randomuser,me/api/portraits/men/34.jpg'} />}
                title={item.name}
                description={item.chartType ? '图表类型' + item.chartType : undefined}
              />
              {'分析目标' + item.goal}
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
            </List.Item>
          )}
        />
        总数：{total}
      </div>
    );
  }
};
export default ChartPage;
