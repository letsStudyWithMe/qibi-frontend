import React, {useEffect, useState} from 'react';
// @ts-ignore
import {listUserChartByPageUsingPost} from '@/services/qibi/chartController';
import {Avatar, Button, Card, Input, List, message, Modal, Result, Space} from 'antd';
import ReactECharts from 'echarts-for-react';
import {Link} from "umi";
import {useModel} from "@@/exports";

const ChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 4,
    current: 1,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  // @ts-ignore
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(String ?? "");
  const [loading, setLoading] = useState<boolean>(true);
  const {Search} = Input;
  const {initialState} = useModel('@@initialState');
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listUserChartByPageUsingPost(searchParams);
      if (res.data) {
        // @ts-ignore
        if (res.data.total == 0) {
          message.success("未查询到相关图表")
        }
        setChartList(res.data.records ?? []);
        // @ts-ignore
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          // @ts-ignore
          res.data.records.forEach(data => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取列表失败');
      }
    } catch (e: any) {
      message.error('获取列表失败,' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const showModal = (props: any) => {
    setContent(props);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{marginBottom: 30}}>
        <Search id="search" placeholder="请输入图表名称" enterButton loading={loading} allowClear onSearch={(value) => {
          // 设置搜索条件
          // @ts-ignore
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className="chart-page">
        <List
          grid={{
            column: 2,
            gutter: 16,
          }}
          pagination={{
            onChange: (page, pageSize) => {
              // @ts-ignore
              setSearchParams({...searchParams, current: page, pageSize})
            },
            total: total,
            pageSizeOptions: [4, 10, 20, 50],
            showTotal: total => `共${total}条记录 `,
            defaultPageSize: 4,
            defaultCurrent: 1,
            size: 'small',
            showSizeChanger: true,
            showQuickJumper: true,
          }}

          loading={loading}
          dataSource={chartList}
          renderItem={(item) => (
            <List.Item
              key={item.id}
            >
              <Card style={{width: '100%',height:'100%'}}>
                <Modal title="原始数据" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  {content}
                </Modal>
                <List.Item.Meta
                  avatar={<Avatar src={'https://randomuser,me/api/portraits/men/34.jpg'}/>}
                  title={item.name}
                  description={item.chartType ? '图表类型：' + item.chartType : undefined}
                />
                <>
                  {
                    item.status === 'wait' && <>
                      <Result
                        status="warning"
                        title="待生成"
                        subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                      />
                    </>
                  }
                  {
                    item.status === 'running' && <>
                      <Result
                        status="info"
                        title="图表生成中"
                        subTitle={item.execMessage}
                      />
                    </>
                  }
                  {
                    item.status === 'succeed' && <>
                      {'分析目标' + item.goal}
                      <ReactECharts
                        option={item.genChart && JSON.parse(item.genChart)}
                        lazyUpdate={false}
                      />
                      <Button type="primary" style={{width: '100%'}} onClick={() => showModal(item.chartData)}>
                        原始数据
                      </Button>
                    </>
                  }
                  {
                    item.status === 'failed' && <>
                      <Result
                        status="error"
                        title="图表生成失败"
                        subTitle={item.execMessage}
                      />
                    </>
                  }
                </>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
export default ChartPage;
