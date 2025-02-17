import TablePro, { type TableColumn } from '../components/TablePro.vue';
import { ElMessage } from 'element-plus';

export default {
  title: 'Components/TablePro',
  component: TablePro,
  tags: ['autodocs'],
};

const Template = (args) => ({
  components: { TablePro },
  setup() {
    const handleTagAdd = ({ row, column, value, newValue }) => {
      console.log('添加标签:', { row, column, value, newValue });
    };

    const handleTagRemove = ({ row, column, index, value, newValue }) => {
      console.log('删除标签:', { row, column, index, value, newValue });
    };

    return { args, handleTagAdd, handleTagRemove };
  },
  template: `
    <TablePro 
      v-bind="args" 
      @tag-add="handleTagAdd"
      @tag-remove="handleTagRemove"
    />
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  tableData: [
    {
      id: 1,
      name: '张三',
      sex: 1,
      age: 25,
      score: 95,
      createdAt: '2024-03-20T10:00:00',
      status: true,
      editable: true,
      province: '广东',
      city: '深圳',
      region: '南方',
      images: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      tags: ['前端', 'Vue', 'React'],
      roles: [
        { name: '管理员', type: 'danger' },
        { name: '开发者', type: 'success' },
      ],
      skills: [
        { label: 'Vue', level: 'expert' },
        { label: 'React', level: 'intermediate' },
        { label: 'Angular', level: 'beginner' },
      ],
    },
    {
      id: 2,
      name: '李四',
      sex: 0,
      age: 30,
      score: 85,
      createdAt: '2024-03-19T15:30:00',
      status: false,
      editable: false,
      province: '北京',
      city: '北京',
      region: '',
      images: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      tags: ['后端', 'Java', 'Python'],
      roles: [{ name: '测试', type: 'warning' }],
      skills: [
        { label: 'Java', level: 'expert' },
        { label: 'Python', level: 'intermediate' },
      ],
    },
  ],
  config: [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      label: '#',
      width: 50,
      fixed: true,
    },
    {
      key: 'name',
      label: '姓名',
      width: 100,
      align: 'right',
      fixed: true,
    },
    {
      key: 'sex',
      label: '性别',
      dictionary: {
        0: '女',
        1: '男',
      },
      filters: [
        { text: '男', value: 1 },
        { text: '女', value: 0 },
      ],
      filterMethod: (value, row) => row.sex === value,
    },
    {
      key: 'tags',
      label: '技术标签',
      width: 300,
      tag: {
        type: (row, value) => {
          const typeMap: Record<string, any> = {
            前端: 'success',
            后端: 'info',
            Vue: 'success',
            React: 'info',
            Java: 'warning',
            Python: 'warning',
          };
          return typeMap[value] || 'info';
        },
        effect: 'light',
        closable: true,
        addable: true,
        addPlaceholder: '输入技术标签',
        beforeAdd: (value, row) => {
          // 示例：验证标签长度
          if (value.length > 10) {
            ElMessage.warning('标签长度不能超过10个字符');
            return false;
          }
          return true;
        },
        onAdd: (value, row) => {
          console.log('标签已添加:', value, row);
        },
        onRemove: (index, value, row) => {
          console.log('标签已删除:', index, value, row);
        },
      },
    },
    {
      key: 'roles',
      label: '角色',
      width: 200,
      tag: {
        label: 'name',
        type: (row, value) => value.type,
        effect: 'dark',
        closable: true,
        addable: true,
        addPlaceholder: '输入角色名称',
        onAdd: (value, row) => {
          console.log('角色已添加:', value, row);
        },
        onRemove: (index, value, row) => {
          console.log('角色已删除:', index, value, row);
        },
      },
    },
    {
      key: 'skills',
      label: '技能',
      width: 300,
      tag: {
        label: 'label',
        type: (row, value) => {
          const dictionary: Record<string, any> = {
            expert: 'success',
            intermediate: 'warning',
            beginner: 'info',
          };
          return dictionary[value.level];
        },
        effect: 'plain',
        closable: true,
        onRemove: (index, value, row) => {
          console.log('技能已删除:', index, value, row);
        },
      },
    },
    {
      key: 'createdAt',
      label: '创建时间',
      formatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'age',
      label: '年龄',
      sortable: true,
      cellStyle: (row) => {
        return row.age < 27 ? { color: 'green' } : { color: 'red' };
      },
    },
    {
      key: 'region',
      label: '区域',
      defaultValue: '暂无',
    },
    {
      key: 'score',
      label: '分数',
      input: {
        disabled: (row) => !row.editable,
        change: (newVal, oldVal, row) => {
          console.log('分数改变:', newVal, row);
          setTimeout(() => (row['score'] = oldVal), 500);
        },
      },
      width: 200,
    },
    {
      key: 'address',
      label: '地址',
      children: [
        {
          key: 'province',
          label: '省',
        },
        {
          key: 'city',
          label: '市',
        },
      ],
    },
    {
      key: 'status',
      label: '状态',
      switch: {
        change: (val, row) => console.log('状态改变:', val, row),
      },
    },
    {
      key: 'images',
      label: '图片',
      type: 'image',
      preview: true,
      size: { width: 'auto', height: 80 },
    },
    {
      label: '操作',
      width: 200,
      buttons: [
        {
          text: '编辑',
          type: 'primary',
          click: (row) => console.log('编辑:', row),
          disabled: (row) => !row.editable,
        },
        {
          text: '删除',
          type: 'danger',
          popconfirmText: '确认删除此记录？',
          click: (row) => console.log('删除:', row),
        },
      ],
    },
  ] as TableColumn[],
  indexOffset: 10,
};
