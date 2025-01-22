import FormPro from '../components/FormPro.vue';

export default {
  title: 'Components/FormPro',
  component: FormPro,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="margin: 1em;"><story /></div>',
    }),
  ],
};

const Template = (args) => ({
  components: { FormPro },
  setup() {
    return { args };
  },
  template: `
    <FormPro v-bind="args" />
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  modelValue: {
    name: '',
    age: '',
    gender: '',
    interests: [],
    birthday: '',
    description: '',
    notification: false,
  },
  config: [
    {
      key: 'name',
      label: '姓名',
      type: 'input',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      placeholder: '请输入姓名',
    },
    {
      key: 'age',
      label: '年龄',
      type: 'input-number',
      min: 0,
      max: 120,
      rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    },
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
      rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
    },
    {
      key: 'interests',
      label: '兴趣爱好',
      type: 'checkbox-group',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '音乐', value: 'music' },
        { label: '运动', value: 'sports' },
        { label: '旅行', value: 'travel' },
      ],
    },
    {
      key: 'birthday',
      label: '生日',
      type: 'date',
      rules: [{ required: true, message: '请选择生日', trigger: 'change' }],
    },
    {
      key: 'description',
      label: '个人简介',
      type: 'input',
      inputType: 'textarea',
      maxLength: 200,
    },
    {
      key: 'notification',
      label: '开启通知',
      type: 'switch',
      activeText: '开启',
      inactiveText: '关闭',
    },
  ],
  itemWidth: '100%',
  labelWidth: '100px',
  itemsGap: '20px',
  needToastError: true,
};

export const WithDateRange = Template.bind({});
WithDateRange.args = {
  modelValue: {
    dateRange: null,
    startDate: null,
    endDate: null,
  },
  config: [
    {
      type: 'daterange',
      label: '日期范围',
      startKey: 'startDate',
      endKey: 'endDate',
      key: 'dateRange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      rules: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
    },
  ],
  labelWidth: '100px',
};

export const WithAppendButton = Template.bind({});
WithAppendButton.args = {
  modelValue: {
    username: '',
  },
  config: [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      append: {
        text: '检查可用性',
        type: 'primary',
        click: (formData) => {
          console.log('检查用户名可用性:', formData.username);
        },
      },
    },
  ],
  labelWidth: '100px',
};

export const WithAutoComplete = Template.bind({});
WithAutoComplete.args = {
  modelValue: {
    city: '',
  },
  config: [
    {
      key: 'city',
      label: '城市',
      type: 'autocomplete',
      placeholder: '请输入城市名',
      fetchSuggestions: (queryString, cb) => {
        const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都'];
        const results = queryString ? cities.filter((city) => city.includes(queryString)) : cities;
        cb(results.map((city) => ({ value: city })));
      },
    },
  ],
  labelWidth: '100px',
};

export const Responsive = Template.bind({});
Responsive.args = {
  modelValue: {
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  },
  config: [
    {
      key: 'field1',
      label: '字段1',
      type: 'input',
      width: '48%',
    },
    {
      key: 'field2',
      label: '字段2',
      type: 'input',
      width: '48%',
    },
    {
      key: 'field3',
      label: '字段3',
      type: 'input',
      width: '48%',
    },
    {
      key: 'field4',
      label: '字段4',
      type: 'input',
      width: '48%',
    },
  ],
  labelWidth: '80px',
  itemsGap: '20px',
};
