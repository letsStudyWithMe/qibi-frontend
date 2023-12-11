import {useModel} from '@umijs/max';
import React, {useEffect, useState} from 'react';
import {genChartByAiRabbitMqUsingPost} from "@/services/qibi/chartController";
import {Button, Card, Form, Input, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {useForm} from "rc-field-form";
import {Link} from "umi";
import {getInitialState} from "@/app";

const AddChartsRabbitMQ: React.FC = () => {
  const [form] =Form.useForm();
  // 提交中的状态，默认未提交
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {initialState} = useModel('@@initialState');
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
    const params = {
      ...values,
      file: undefined,
    };
    try {
      // 生成
      const res = await genChartByAiRabbitMqUsingPost(params, {}, values.file[0].originFileObj);
      if (!res?.data) {
        message.error("分析失败");
      } else {
        message.success("分析任务提交成功，请稍后在我的图表查看");
        form.resetFields();
      }
    } catch (e: any) {
      message.error("分析失败" + e.message);
    }
    // 当结束提交，把submitting设置为false
    setSubmitting(false);
  };

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart-async">
      <Card title={'智能分析'}>
        <Form
          form={form}
          name="addChart"
          onFinish={handleSubmit}
          initialValues={{}}
          style={{maxWidth: 600}}
        >
          <Form.Item name="goal"
                     label="分析目标"
                     rules={[{required: true, message: '请输入分析目标'}]}>
            <TextArea placeholder="请输入你的分析需求，比如: 分析网站用户的增长情况"/>
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
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                生成
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartsRabbitMQ;
