<template>
  <el-table
    :data="listData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <template v-for="column in config" :key="column.key || column.type">
      <!-- Selection Column -->
      <el-table-column
        v-if="column.type === 'selection'"
        type="selection"
        :width="column.width"
        :fixed="column.fixed"
      />

      <!-- Index Column -->
      <el-table-column
        v-else-if="column.type === 'index'"
        type="index"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed"
      />

      <!-- Actions Column -->
      <el-table-column
        v-else-if="column.type === 'actions'"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed"
      >
        <template #default="{ row }">
          <template v-for="(btn, index) in column.buttons" :key="index">
            <el-button
              :type="btn.type"
              :disabled="btn.disabled?.(row)"
              @click="btn.click(row)"
            >
              {{ btn.text }}
            </el-button>
          </template>
        </template>
      </el-table-column>

      <!-- Image Column -->
      <el-table-column
        v-else-if="column.type === 'image'"
        :prop="column.key"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed"
      >
        <template #default="{ row }">
          <el-image
            v-if="column.key && row[column.key]"
            :src="row[column.key]"
            :preview-src-list="column.preview ? [row[column.key]] : []"
            :style="{
              width: column.size?.width + 'px',
              height: column.size?.height + 'px',
            }"
          />
        </template>
      </el-table-column>

      <!-- Custom Slot Column -->
      <el-table-column
        v-else-if="column.slot"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed"
      >
        <template #default="{ row }">
          <slot :name="column.slot" :row="row" />
        </template>
      </el-table-column>

      <!-- Nested Columns -->
      <template v-else-if="column.children">
        <el-table-column
          :label="column.label"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template v-for="child in column.children" :key="child.key">
            <el-table-column
              :prop="child.key"
              :label="child.label"
              :width="child.width"
            />
          </template>
        </el-table-column>
      </template>

      <!-- Normal Column -->
      <el-table-column
        v-else
        :prop="column.key"
        :label="column.label"
        :width="column.width"
        :align="column.align"
        :sortable="column.sortable"
        :filters="column.filters"
        :filter-method="column.filterMethod"
        :colspan="handleColspan"
        :fixed="column.fixed"
        v-show="!column.hidden"
      >
        <template #default="{ row }" v-if="column.key">
          <template v-if="column.switch">
            <el-switch
              v-model="row[column.key]"
              @change="(val) => column.switch?.change(val, row)"
            />
          </template>
          <div class="edit-wrapper" v-else-if="column.edit">
            <el-input
              type="text"
              v-model="row[column.key]"
              :readonly="!row[`${column.key}Old`]"
              @focus="
                column.key &&
                  !row[`${column.key}Old`] &&
                  (row[`${column.key}Old`] = row[column.key])
              "
              @blur="
                column.key &&
                  row[`${column.key}Old`].toString() === row[column.key] &&
                  (row[`${column.key}Old`] = undefined)
              "
            />
            <template
              v-if="
                row[`${column.key}Old`] !== undefined &&
                row[`${column.key}Old`] !== row[column.key]
              "
            >
              <el-button
                type="primary"
                size="small"
                @click="column.edit?.change(row[column.key], row)"
                >确认</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="row[column.key] = row[`${column.key}Old`]"
                >取消</el-button
              >
            </template>
          </div>
          <template v-else>
            <span :style="column.cellStyle?.(row, column)">
              {{ column.key ? formatCellValue(row[column.key], column) : "" }}
            </span>
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import type { TableColumnCtx } from "element-plus";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElSwitch,
  ElImage,
} from "element-plus";

type ButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text"
  | "default";

interface TableColumn {
  type?: "selection" | "index" | "actions" | "image";
  key?: string;
  label?: string;
  width?: number;
  align?: "left" | "center" | "right";
  hidden?: boolean;
  sortable?: boolean;
  filters?: { text: string; value: any }[];
  filterMethod?: (value: any, row: Record<string, any>) => boolean;
  colspan?: (row: Record<string, any>, column: TableColumn) => number;
  dictionary?: Record<string | number, string>;
  formatter?: (value: any) => string;
  cellStyle?: (
    row: Record<string, any>,
    column: TableColumn
  ) => Record<string, string>;
  defaultValue?: string;
  children?: TableColumn[];
  switch?: {
    change: (value: any, row: Record<string, any>) => void;
  };
  edit?: {
    change: (value: any, row: Record<string, any>) => void;
  };
  buttons?: {
    text: string;
    type: ButtonType;
    click: (row: Record<string, any>) => void;
    disabled?: (row: Record<string, any>) => boolean;
  }[];
  slot?: string;
  size?: { width: number; height: number };
  preview?: boolean;
  fixed?: boolean;
}

interface Props {
  listData: Record<string, any>[];
  config: TableColumn[];
}

const props = defineProps<Props>();
const emit = defineEmits(["selection-change"]);

const handleSelectionChange = (selection: Record<string, any>[]) => {
  emit("selection-change", selection);
};

const handleColspan = (scope: {
  row: Record<string, any>;
  column: TableColumnCtx<any>;
}) => {
  const currentColumn = props.config.find(
    (col) => col.key === scope.column.property
  );
  return currentColumn?.colspan?.(scope.row, currentColumn) ?? 1;
};

const formatCellValue = (value: any, column: TableColumn) => {
  if (value === undefined || value === null || value === "") {
    return column.defaultValue || "";
  }

  if (column.dictionary && value in column.dictionary) {
    return column.dictionary[value];
  }

  if (column.formatter) {
    return column.formatter(value);
  }

  return value;
};
</script>

<style scoped>
.el-table {
  width: 100%;
}
.edit-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.edit-wrapper .el-button + .el-button {
  margin-left: 0;
}
</style>
