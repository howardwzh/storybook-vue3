import {useFetchListData} from '../composables/useFetchListData';
import {getUsers} from "../api/user.ts"

export default {
  title: 'composables/useFetchListData',
};

const Template = (args) => ({
  setup() {
    const { listData, fetchList } = useFetchListData();
    fetchList({
      fetchFn: getUsers,
      fetchParams:{}
    })
    return { args,listData };
  },
  template: `<div>
  <div v-for="(item, index) in listData" :key="index" style="display:flex;gap:8px;">
  <span>{{item.name}}</span>
  <span>{{item.email}}</span>
  </div>
  </div>`,
});

export const Default = Template.bind({});
Default.args = {};
