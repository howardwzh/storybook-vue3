import TabelPro from "../components/TabelPro.vue";

export default {
  title: "Components/TabelPro",
  component: TabelPro,
  tags: ["autodocs"],
};

const Template = (args) => ({
  components: { TabelPro },
  setup() {
    return { args };
  },
  template: `<TabelPro v-bind="args">
  <template #actionsSlot="{ row }">
    <el-button type="primary" @click="console.log('edit',row)">编辑</el-button>
    <el-button type="danger" @click="console.log('delete',row)">删除</el-button>
  </template>
  </TabelPro>`,
});

export const Basic = Template.bind({});
Basic.args = {
  listData: [
    {
      id: 1,
      name: "张三",
      sex: 1,
      age: 25,
      score: 95,
      createdAt: "2024-03-20T10:00:00",
      status: true,
      editable: true,
      province: "广东",
      city: "深圳",
      region: "南方",
      images:
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    },
    {
      id: 2,
      name: "李四",
      sex: 0,
      age: 30,
      score: 85,
      createdAt: "2024-03-19T15:30:00",
      status: false,
      editable: false,
      province: "北京",
      city: "北京",
      region: "",
      images:
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    },
  ],
  config: [
    {
      type: "selection",
      width: 50,
    },
    {
      type: "index",
      label: "#",
      width: 50,
      fixed: true,
    },
    {
      key: "name",
      label: "姓名",
      width: 100,
      align: "right",
      fixed: true,
    },
    {
      key: "sex",
      label: "性别",
      dictionary: {
        0: "女",
        1: "男",
      },
      filters: [
        { text: "男", value: 1 },
        { text: "女", value: 0 },
      ],
      filterMethod: (value, row) => row.sex === value,
    },
    {
      key: "createdAt",
      label: "创建时间",
      formatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "age",
      label: "年龄",
      sortable: true,
      cellStyle: (row) => {
        return row.age < 27 ? { color: "green" } : { color: "red" };
      },
    },
    {
      key: "region",
      label: "区域",
      defaultValue: "暂无",
    },
    {
      key: "score",
      label: "分数",
      input: {
        disabled: (row) => !row.editable,
        change: (newVal, oldVal, row) => {
          console.log("分数改变:", newVal, row);
          setTimeout(() => (row["score"] = oldVal), 500);
        },
      },
      width: 200,
    },
    {
      key: "address",
      label: "地址",
      children: [
        {
          key: "province",
          label: "省",
        },
        {
          key: "city",
          label: "市",
        },
      ],
    },
    {
      key: "status",
      label: "状态",
      switch: {
        change: (val, row) => console.log("状态改变:", val, row),
      },
    },
    {
      key: "images",
      label: "图片",
      type: "image",
      preview: true,
      size: { width: "auto", height: 80 },
    },
    {
      label: "操作",
      width: 200,
      buttons: [
        {
          text: "编辑",
          type: "primary",
          click: (row) => console.log("编辑:", row),
          disabled: (row) => !row.editable,
        },
        {
          text: "删除",
          type: "danger",
          click: (row) => console.log("删除:", row),
        },
      ],
    },
    {
      label: "操作(slot)",
      slot: "actionsSlot",
      width: 200,
    },
  ],
  indexOffset: 10,
};
