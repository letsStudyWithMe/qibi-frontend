export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', name: '登录', component: './User/Login' },
      { path: '/user/register', name: '注册', component: './User/Register' },
    ],
  },
  {
    name: '欢迎页面',
    path: '/welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/chart',
    name: '图表管理',
    icon: 'pieChart',
    hideChildrenInMenu: false,
    routes: [
      { path: '/chart/showCharts', name: '图表列表', component: './Chart/ShowCharts' },
      { path: '/chart/addCharts', name: '生成图表', component: './Chart/AddCharts' },
      { path: '/chart/addChartsRabbitMQ', name: '生成图表(RabbitMQ)', component: './Chart/AddChartsRabbitMQ' },
    ],
  },
  {
    path: '/user', name: '用户管理', icon: 'user',
    hideChildrenInMenu: false,
    routes: [
      {path: '/user/showUsers', name: '用户列表', component: './User/Manage',access: 'canRoot'},
    ]
  },

  {
    path: '/admin',
    icon: 'crown',
    access: 'canRoot',
    name: '管理员页面',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
