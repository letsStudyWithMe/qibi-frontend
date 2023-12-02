import Footer from '@/components/Footer';
import {useModel} from '@umijs/max';
import React, {useEffect, useState} from 'react';
// @ts-ignore
import {listChartByPageUsingPost} from "@/services/qibi/chartController";

const Charts: React.FC = () => {

  const [type, setType] = useState<string>('account');
  const {setInitialState} = useModel('@@initialState');

/*  useEffect(() =>{
    listChartByPageUsingPost({}).then((res) =>{
      console.error('res',res);
    });
  });*/

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart">
    </div>
  );
};
export default Charts;
