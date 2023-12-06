import React, {useEffect, useState} from 'react';
// @ts-ignore
import {listUserChartByPageUsingPost} from '@/services/qibi/chartController';
import {Avatar, Button, Card, Input, List, message, Modal} from 'antd';
import ReactECharts from 'echarts-for-react';
import {RedoOutlined} from "@ant-design/icons";
import {history} from '@umijs/max';

const ChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 4,
    current: 1,
  };
  // @ts-ignore
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(String ?? "");
  const [loading, setLoading] = useState<boolean>(true);
  const { Search } = Input;
  const loadData = async (name : any) => {
    setLoading(true);
    try {
      if (name != ""){
        searchParams.name = name;
      }
      const res = await listUserChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        // @ts-ignore
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
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
    loadData("");
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

  if (total == 0) {
    return (
      <div className="chart-page-no-result">
        <img alt="kongkongruye" src="/kongkongruye.jpg"/>
        <Button onClick={() => {
          /*<Link to={'/chart/showCharts'}>返回</Link>*/
          /*history.push("/chart/showCharts");*/
        }}>返回</Button>
      </div>
    );
  } else {
    return (
      <div>
        <div style={{marginBottom: 30}}>
            <Search placeholder="请输入图表名称" enterButton loading={loading} allowClear onSearch={(value) => {
              // 设置搜索条件
              // @ts-ignore
              setSearchParams({
                ...initSearchParams,
                name: value,
              })
            }}/>
            <Button type="primary" onClick={()=>{
              loadData("");
              // @ts-ignore
              setSearchParams({
                ...initSearchParams,
                name: "",
              })
            }} loading={loading} icon={<RedoOutlined />} style={{position:"absolute",right:'2px'}}></Button>
        </div>
        <div className="chart-page">
          <List
            grid={{
              column:2,
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
                <Card style={{width: '100%'}}>
                  <Modal title="原始数据" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {content}
                  </Modal>
                  <List.Item.Meta
                    avatar={<Avatar src={'https://randomuser,me/api/portraits/men/34.jpg'}/>}
                    title={item.name}
                    description={item.chartType ? '图表类型' + item.chartType : undefined}
                  />
                  {'分析目标' + item.goal}
                  <ReactECharts
                    option={item.genChart && JSON.parse(item.genChart)}
                    lazyUpdate={false}
                  />
                  <Button type="primary" style={{width: '100%'}} onClick={() => showModal(item.chartData)}>
                    原始数据
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
};
export default ChartPage;
