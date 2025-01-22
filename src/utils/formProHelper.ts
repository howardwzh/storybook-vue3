import { type ItemInterface } from '../components/formPro.vue';

export const KEY_EXTRA_SUFFIX = 'KEY_EXTRA_SUFFIX';

export const deleteRedundantItems = (data: Record<string, any>) => {
  const _data = { ...data };
  Object.keys(_data).forEach((key) => {
    if (key.indexOf(KEY_EXTRA_SUFFIX) !== -1) {
      delete _data[key];
    }
  });
  return _data;
};

export const updateConfigItem = (config: ItemInterface[], key: string, newData: ItemInterface) => {
  const itemIndex = config.findIndex((item: ItemInterface) => item.key === key);
  config[itemIndex] = { ...config[itemIndex], ...newData };
};
