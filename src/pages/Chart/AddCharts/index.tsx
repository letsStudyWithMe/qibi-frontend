import {useModel} from '@umijs/max';
import React, {useState} from 'react';
import {genChartByAiUsingPost} from "@/services/qibi/chartController";
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import ReactECharts from 'echarts-for-react';
import Spin from 'antd/lib/spin';

const AddCharts: React.FC = () => {
  const {setInitialState} = useModel('@@initialState');
  // 定义状态，用来接收后端的返回值，让它实时展示在页面上
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  // 提交中的状态，默认未提交
  const [submitting, setSubmitting] = useState<boolean>(false);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleSubmit = async (values: any) => {
    if (submitting) {
      return;
    }
    //开始提交 把状态变成true 以防多次点击
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);


    const params = {
      ...values,
      file: undefined,
    };
    try {
      // 生成
      const res = await genChartByAiUsingPost(params, {}, values.file[0].originFileObj);
      if (res.code === 0) {
        message.success("成功");
        // 解析成对象，为空则设为空字符串
        // @ts-ignore
        const chartOption = JSON.parse(res.data.genChart ?? '');
        // 如果为空，则抛出异常，并提示”图表代码解析错误
        if (!chartOption) {
          throw new Error("图表代码解析错误");
        } else {
          // 从后端得到响应结果之后，把响应结果设置到图表状态里
          setChart(res.data);
          setOption(chartOption);
        }
      } else {
        message.error("失败");
      }
    } catch (e: any) {
      message.error("分析失败" + e.message);
    }
    // 当结束提交，把submitting设置为false
    setSubmitting(false);
  };
  const onFinish = (values: any) => {
    handleSubmit(values as any);
  }

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              style={{maxWidth: 600}}
            >
              <Form.Item name="goal"
                         label="分析目标"
                         rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea/>
              </Form.Item>

              <Form.Item name="name"
                         label="图表名称">
                <Input placeholder="请输入图表名称"/>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
                hasFeedback
                rules={[{message: '请选择图表类型'}]}
              >
                <Select>
                  <Select.Option value="折线图">折线图</Select.Option>
                  <Select.Option value="柱状图">柱状图</Select.Option>
                  <Select.Option value="堆叠图">堆叠图</Select.Option>
                  <Select.Option value="饼状图">饼状图</Select.Option>
                  <Select.Option value="雷达图">雷达图</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
                getValueFromEvent={normFile}
                valuePropName="fileList"
              >
                <Upload name="file">
                  <Button icon={<UploadOutlined/>}>上传CSV文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 12, offset: 6}}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    生成
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting}/>
          </Card>
          <Divider/>
          <Card title={"可视化图表"}>
            {
              //后端返回的代码是字符串，不是对象，用JSoN.parse解析成对象
              option && <ReactECharts option={option}/>
            }
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddCharts;
