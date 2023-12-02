import {useModel} from '@umijs/max';
import React, {useState} from 'react';
import {genChartByAiUsingPost} from "@/services/qibi/chartController";
import {Button, Form, Input, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";

const AddCharts: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {setInitialState} = useModel('@@initialState');
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleSubmit = async (values: any) => {
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      // 生成
      const res = await genChartByAiUsingPost(params, {}, values.file[0].originFileObj);
      console.log("生成结果：" + res)
      if (res.code === 0) {
        message.success("成功");
      } else {
        message.error("失败");
      }
    } catch (e: any) {
      message.error("分析失败" + e.message);
    }
  };
  const onFinish = (values: any) => {
    console.log('表单内容', values);
    handleSubmit(values as any);
  }

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart">
      <Form
        name="addChart"
        onFinish={onFinish}
        initialValues={{}}
        style={{maxWidth: 600}}
      >
        <Form.Item name="name"
                   label="图表名称">
          <Input placeholder="请输入图表名称"/>
        </Form.Item>

        <Form.Item name="goal"
                   label="分析目标"
                   rules={[{required: true, message: '请输入分析目标'}]}>
          <TextArea/>
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
    </div>
  );
};
export default AddCharts;
