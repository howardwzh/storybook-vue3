<template>
  <div class="table-pro-wrapper">
    <div class="table-order-buttons" :class="{ active: isEditingOrder }">
      <el-button size="small" type="primary" @click="confirmOrder">确定</el-button>
      <el-button size="small" type="info" @click="toggleEditingOrder(false)">取消</el-button>
      <el-button size="small" @click="resetConfig">恢复默认</el-button>
    </div>
    <el-table :data="tableData" @header-click="toggleEditingOrder(true)" border>
      <template v-for="column in finalConfig" :key="column.key || column.type">
        <!-- Selection Column -->
        <el-table-column
          v-if="column.type === 'selection'"
          :width="column.width || 40"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        >
          <template #header>
            <el-checkbox
              v-if="column.label"
              v-model="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
            >
              {{ column.label }}
            </el-checkbox>
            <el-checkbox v-else v-model="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
          </template>
          <template #default="{ row }">
            <el-checkbox
              :disabled="!checkFnAndReturnVal(column.selectable, row)"
              :model-value="!!selectedRows.find((s: Record<string, any>) => s[column.uuid] === row[column.uuid])"
              @change="toggleRowSelection(row, column)"
            />
          </template>
        </el-table-column>

        <!-- Index Column -->
        <el-table-column
          v-else-if="column.type === 'index'"
          type="index"
          :index="indexOffset || 0"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        />

        <!-- Buttons Column -->
        <el-table-column
          v-else-if="column.buttons"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        >
          <template #header>
            <div :style="`align:${column.align}`">{{ column.label }}</div>
            <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
            <div class="header-actions" v-if="isEditingOrder">
              <div
                v-if="getOrderIndex(column.key) > 0"
                class="column-order-index"
                :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                @click="toggleLeft(column.key)"
              >
                {{ getOrderIndex(column.key) }}
              </div>
              <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                <DArrowLeft />
              </el-icon>
              <el-icon
                :class="{ active: checkIfFixed(column.key, true) }"
                color="#fff"
                size="20"
                @click="toggleFixed(column.key)"
              >
                <Lock />
              </el-icon>
            </div>
          </template>
          <template #default="{ row }">
            <template v-for="(btn, index) in column.buttons" :key="index">
              <el-popconfirm
                v-if="btn.popconfirmTitle"
                :title="checkFnAndReturnVal(btn.popconfirmTitle, row)"
                :confirm-button-text="btn.popconfirmBtnText"
                :cancel-button-text="btn.popcancelBtnText"
                :icon="btn.popconfirmIcon"
                :icon-color="btn.popconfirmIconColor"
                :width="btn.width"
                @confirm="btn.click(row)"
              >
                <template #reference>
                  <el-button
                    v-if="btn.text"
                    :type="checkFnAndReturnVal(btn.type, row)"
                    :icon="checkFnAndReturnVal(btn.icon, row)"
                    :disabled="btn.disabled?.(row)"
                    :size="btn.size"
                    :round="btn.round"
                  >
                    {{ checkFnAndReturnVal(btn.text, row) }}
                  </el-button>
                  <el-button
                    v-else
                    :type="checkFnAndReturnVal(btn.type, row)"
                    :icon="checkFnAndReturnVal(btn.icon, row)"
                    :disabled="btn.disabled?.(row)"
                    :size="btn.size"
                    :circle="btn.circle"
                  />
                </template>
              </el-popconfirm>
              <el-button
                v-else-if="btn.text"
                :type="checkFnAndReturnVal(btn.type, row)"
                :icon="checkFnAndReturnVal(btn.icon, row)"
                :disabled="btn.disabled?.(row)"
                :size="btn.size"
                :round="btn.round"
                @click="btn.click(row)"
              >
                {{ checkFnAndReturnVal(btn.text, row) }}
              </el-button>
              <el-button
                v-else
                :type="checkFnAndReturnVal(btn.type, row)"
                :icon="checkFnAndReturnVal(btn.icon, row)"
                :disabled="btn.disabled?.(row)"
                :size="btn.size"
                :circle="btn.circle"
                @click="btn.click(row)"
              />
            </template>
          </template>
        </el-table-column>

        <!-- Image Column -->
        <el-table-column
          v-else-if="column.type === 'image'"
          :prop="column.key"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        >
          <template #header>
            <div :style="`align:${column.align}`">{{ column.label }}</div>
            <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
            <div class="header-actions" v-if="isEditingOrder">
              <div
                v-if="getOrderIndex(column.key) > 0"
                class="column-order-index"
                :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                @click="toggleLeft(column.key)"
              >
                {{ getOrderIndex(column.key) }}
              </div>
              <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                <DArrowLeft />
              </el-icon>
              <el-icon
                :class="{ active: checkIfFixed(column.key, true) }"
                color="#fff"
                size="20"
                @click="toggleFixed(column.key)"
              >
                <Lock />
              </el-icon>
            </div>
          </template>
          <template #default="{ row }">
            <el-image
              v-if="column.key && row[column.key]"
              :src="row[column.key]"
              :preview-src-list="column.preview ? [row[column.key]] : []"
              preview-teleported
              :style="{
                width: column.size?.width + 'px',
                height: column.size?.height + 'px',
              }"
            />
          </template>
        </el-table-column>

        <!-- Link Column -->
        <el-table-column
          v-else-if="column.type === 'link'"
          :prop="column.key"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        >
          <template #header>
            <div :style="`align:${column.align}`">{{ column.label }}</div>
            <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
            <div class="header-actions" v-if="isEditingOrder">
              <div
                v-if="getOrderIndex(column.key) > 0"
                class="column-order-index"
                :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                @click="toggleLeft(column.key)"
              >
                {{ getOrderIndex(column.key) }}
              </div>
              <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                <DArrowLeft />
              </el-icon>
              <el-icon
                :class="{ active: checkIfFixed(column.key, true) }"
                color="#fff"
                size="20"
                @click="toggleFixed(column.key)"
              >
                <Lock />
              </el-icon>
            </div>
          </template>
          <template #default="{ row }">
            <a
              class="element-to-lj"
              :href="(column.checkSSL && column.checkSSL(row) ? 'http://' : 'https://') + row[column.key ?? '']"
              target="_blank"
            >
              {{ row[column.key ?? ''] }}
            </a>
          </template>
        </el-table-column>

        <!-- Custom Slot Column -->
        <el-table-column
          v-else-if="column.slot"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :fixed="checkIfFixed(column.key)"
        >
          <template #header>
            <div :style="`align:${column.align}`">{{ column.label }}</div>
            <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
            <div class="header-actions" v-if="isEditingOrder">
              <div
                v-if="getOrderIndex(column.key) > 0"
                class="column-order-index"
                :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                @click="toggleLeft(column.key)"
              >
                {{ getOrderIndex(column.key) }}
              </div>
              <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                <DArrowLeft />
              </el-icon>
              <el-icon
                :class="{ active: checkIfFixed(column.key, true) }"
                color="#fff"
                size="20"
                @click="toggleFixed(column.key)"
              >
                <Lock />
              </el-icon>
            </div>
          </template>
          <template #default="{ row }">
            <slot :name="column.slot" :row="row" />
          </template>
        </el-table-column>

        <!-- Nested Columns -->
        <template v-else-if="column.children">
          <el-table-column
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align"
            :fixed="checkIfFixed(column.key)"
          >
            <template #header>
              <div :style="`align:${column.align}`">{{ column.label }}</div>
              <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
              <div class="header-actions" v-if="isEditingOrder">
                <div
                  v-if="getOrderIndex(column.key) > 0"
                  class="column-order-index"
                  :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                  @click="toggleLeft(column.key)"
                >
                  {{ getOrderIndex(column.key) }}
                </div>
                <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                  <DArrowLeft />
                </el-icon>
                <el-icon
                  :class="{ active: checkIfFixed(column.key, true) }"
                  color="#fff"
                  size="20"
                  @click="toggleFixed(column.key)"
                >
                  <Lock />
                </el-icon>
              </div>
            </template>
            <template v-for="child in column.children" :key="child.key">
              <el-table-column :prop="child.key" :label="child.label" :width="child.width" />
            </template>
          </el-table-column>
        </template>

        <!-- Normal Column -->
        <el-table-column
          v-else
          :prop="column.key"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :sortable="column.sortable"
          :filters="column.filters"
          :filter-method="column.filterMethod"
          :fixed="checkIfFixed(column.key)"
          v-show="!column.hidden"
        >
          <template #header>
            <div :style="`align:${column.align}`">{{ column.label }}</div>
            <slot v-if="column.headerSlot" :name="column.headerSlot"></slot>
            <div class="header-actions" v-if="isEditingOrder">
              <div
                v-if="getOrderIndex(column.key) > 0"
                class="column-order-index"
                :class="{ 'is-fixed': checkIfFixed(column.key, true) }"
                @click="toggleLeft(column.key)"
              >
                {{ getOrderIndex(column.key) }}
              </div>
              <el-icon v-else color="#fff" size="20" @click="toggleLeft(column.key)">
                <DArrowLeft />
              </el-icon>
              <el-icon
                :class="{ active: checkIfFixed(column.key, true) }"
                color="#fff"
                size="20"
                @click="toggleFixed(column.key)"
              >
                <Lock />
              </el-icon>
            </div>
          </template>
          <template #default="{ row, $index }" v-if="column.key">
            <template v-if="column.switch">
              <el-switch
                v-model="row[column.key]"
                :style="{
                  '--el-switch-on-color': column.switch?.onColor || '#13ce66',
                  '--el-switch-off-color': column.switch?.offColor || '#ff4949',
                }"
                :active-value="column.switch?.activeValue"
                :inactive-value="column.switch?.inactiveValue"
                :active-text="column.switch?.activeText"
                :inactive-text="column.switch?.inactiveText"
                inline-prompt
                :loading="row.loading"
                @change="
                  (val) =>
                    column.switch?.change(
                      val,
                      val === column.switch?.activeValue ? column.switch?.inactiveValue : column.switch?.activeValue,
                      row
                    )
                "
              />
            </template>
            <div class="input-wrapper" v-else-if="column.input">
              <el-input
                v-model="row[column.key]"
                :type="column.input?.type || 'text'"
                :placeholder="column.input?.placeholder || '请输入'"
                :maxlength="column.input?.maxlength"
                :show-word-limit="!!column.input?.maxlength"
                :disabled="column.input?.disabled?.(row)"
                @focus="column.key && !row[`${column.key}-old`] && (row[`${column.key}-old`] = row[column.key])"
                @blur="
                  column.key &&
                    row[`${column.key}-old`].toString() === row[column.key] &&
                    (row[`${column.key}-old`] = undefined)
                "
              />
              <template v-if="row[`${column.key}-old`] !== undefined && row[`${column.key}-old`] !== row[column.key]">
                <el-button
                  type="primary"
                  size="small"
                  @click="column.input?.change(row[column.key], row[`${column.key}-old`], row)"
                >
                  确认
                </el-button>
                <el-button size="small" @click="row[column.key] = row[`${column.key}-old`]">取消</el-button>
              </template>
            </div>
            <template v-else-if="column.tag">
              <div class="tags-wrapper">
                <template v-if="Array.isArray(row[column.key])">
                  <template v-for="(value, index) in row[column.key]" :key="index">
                    <el-tag
                      :type="checkFnAndReturnVal(column.tag.type, row, value)"
                      :effect="column.tag.effect || 'dark'"
                      :closable="column.tag.closable"
                      @close="handleTagClose(row, column, index)"
                    >
                      {{ formatTagValue(value, column) }}
                    </el-tag>
                  </template>
                  <div v-if="column.tag.addable" class="tag-input-wrapper">
                    <el-input
                      v-if="tempBooleans[getRowColumnKey(row, column, $index)]"
                      :id="getRowColumnKey(row, column, $index)"
                      v-model="tagInputValues[getRowColumnKey(row, column, $index)]"
                      :placeholder="column.tag.addPlaceholder || '请输入'"
                      size="small"
                      @keyup.enter="handleTagAdd(row, column, $index)"
                      @blur="handleTagInputBlur(row, column, $index)"
                    />
                    <el-button v-else size="small" @click="(event: MouseEvent) => showTagInput(row, column, $index)">
                      + 新标签
                    </el-button>
                  </div>
                </template>
                <template v-else>
                  <el-tag
                    :type="checkFnAndReturnVal(column.tag.type, row, row[column.key])"
                    :effect="column.tag.effect || 'dark'"
                  >
                    {{ formatTagValue(row[column.key], column) }}
                  </el-tag>
                </template>
              </div>
            </template>
            <template v-else>
              <span :style="column.cellStyle?.(row, column)">
                {{ column.key ? formatCellValue(row[column.key], column, row) : '' }}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, toRef } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElSwitch,
  ElImage,
  ElTag,
  ElInput,
  ElPopconfirm,
  ElMessage,
  ElIcon,
} from 'element-plus'
import { DArrowLeft, Lock, Refresh } from '@element-plus/icons-vue'

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

export interface TableColumn {
  uuid?: string
  type?: 'selection' | 'index' | 'image' | 'link'
  key?: string
  label?: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  hidden?: boolean
  sortable?: boolean
  selectable?: boolean | ((row: Record<string, any>) => boolean)
  filters?: { text: string; value: any }[]
  dictionary?: Record<string | number, string>
  defaultValue?: string
  children?: TableColumn[]
  switch?: {
    activeValue: any
    inactiveValue: any
    onColor?: string
    offColor?: string
    activeText?: string
    inactiveText?: string
    change: (newValue: any, oldValue: any, row: Record<string, any>) => void
  }
  input?: {
    type?: 'text' | 'number' | 'textarea'
    maxlength?: number
    placeholder?: string
    change: (newValue: any, oldValue: any, row: Record<string, any>) => void
    disabled?: (row: Record<string, any>) => boolean
  }
  buttons?: {
    type: ButtonType | ((row: Record<string, any>) => ButtonType)
    click: (row: Record<string, any>) => void
    text?: string | ((row: Record<string, any>) => string)
    icon?: any
    disabled?: (row: Record<string, any>) => boolean
    popconfirmTitle?: string | ((row: Record<string, any>) => string)
    popconfirmBtnText?: string
    popcancelBtnText?: string
    popconfirmIcon?: any
    popconfirmIconColor?: string
    width?: string
    size?: 'large' | 'default' | 'small'
    round?: boolean
    circle?: boolean
  }[]
  slot?: string
  size?: { width: number; height: number }
  preview?: boolean
  fixed?: boolean
  headerSlot?: string
  tag?: {
    type?: TagType | ((row: Record<string, any>, value?: any) => TagType)
    effect?: 'dark' | 'light' | 'plain'
    closable?: boolean
    addable?: boolean
    addPlaceholder?: string
    label?: string
    beforeAdd?: (value: string, row: Record<string, any>) => boolean | Promise<boolean>
    beforeRemove?: (index: number, value: any, row: Record<string, any>) => boolean | Promise<boolean>
    onAdd?: (value: string, row: Record<string, any>) => void
    onRemove?: (index: number, value: any, row: Record<string, any>) => void
  }
  filterMethod?: (value: any, row: Record<string, any>) => boolean
  colspan?: (row: Record<string, any>, column: TableColumn) => number
  formatter?: (value: any, row?: Record<string, any>) => string
  cellStyle?: (row: Record<string, any>, column: TableColumn) => Record<string, string>
  checkSSL?: (row: Record<string, any>) => boolean
}

interface Props {
  tableData: Record<string, any>[]
  config: TableColumn[]
  indexOffset?: number
  controllable?: boolean
  selectedRows?: Record<string, any>[]
}

const props = withDefaults(defineProps<Props>(), { controllable: true })
const emit = defineEmits(['selection-change'])

// Store input values for tag adding
const _preOriginOrderConfig: string[] = []
const _preFixedColumns: string[] = []
const _config: TableColumn[] = props.config.map((column: TableColumn, index: number) => {
  const key = column.key || `column-${index}`
  _preOriginOrderConfig.push(key)
  column.fixed && _preFixedColumns.push(key)
  return {
    ...column,
    key,
  }
})
const cacheKey = JSON.stringify(_preOriginOrderConfig)
const cacheFixedColumns = JSON.parse(localStorage.getItem(`fixedColumns-${cacheKey}`) || 'null')
const cacheLeftOrderConfig = JSON.parse(localStorage.getItem(`leftOrderConfig-${cacheKey}`) || 'null')
const tagInputValues = ref<Record<string, string>>({})
const tempBooleans = ref<Record<string, boolean>>({})
const tempFixedColumns = ref<string[]>([])
const fixedColumns = ref<string[]>(cacheFixedColumns || _preFixedColumns)
const tempLeftOrderConfig = ref<string[]>([])
const leftOrderConfig = ref<string[]>(cacheLeftOrderConfig || [])
const originOrderConfig = ref<string[]>(_preOriginOrderConfig)
const isEditingOrder = ref(false)
const selectedRows = toRef(props.selectedRows || [])

const finalConfig = computed((): TableColumn[] => {
  const result: TableColumn[] = []
  fixedColumns.value.map((key: string) => {
    const keyOne = _config.find((column: TableColumn) => column.key === key)
    keyOne && result.push(keyOne)
  })
  const checkIfFixed = (key: string) => fixedColumns.value.indexOf(key) !== -1
  tempFixedColumns.value.map((key: string) => {
    if (checkIfFixed(key)) return
    result.push()
  })
  leftOrderConfig.value.map((key: string) => {
    if (checkIfFixed(key)) return
    const keyOne = _config.find((column: TableColumn) => column.key === key)
    keyOne && result.push(keyOne)
  })
  originOrderConfig.value.map((key: string) => {
    if (checkIfFixed(key) || leftOrderConfig.value.indexOf(key) !== -1) return
    const keyOne = _config.find((column: TableColumn) => column.key === key)
    keyOne && result.push(keyOne)
  })
  return result
})

const toggleEditingOrder = (open?: boolean) => {
  if (!props.controllable || isEditingOrder.value === open) return
  isEditingOrder.value = open !== undefined ? open : !isEditingOrder.value
  if (isEditingOrder.value) {
    tempFixedColumns.value = [...fixedColumns.value]
    tempLeftOrderConfig.value = [...leftOrderConfig.value]
  }
}

const getRowColumnKey = (row: Record<string, any>, column: TableColumn, index: number) => {
  return `${index}-${row.id || ''}-${column.key || ''}`
}

const checkFnAndReturnVal = (
  val: any | ((row: Record<string, any>) => any),
  row: Record<string, any>,
  argsValue?: any
) => (typeof val === 'function' ? val(row, argsValue) : val)

// 计算是否所有行都被选中
const isAllSelected = computed(() => props.tableData.length > 0 && selectedRows.value.length === props.tableData.length)

// 计算是否部分选中（半选状态）
const isIndeterminate = computed(
  () => selectedRows.value.length > 0 && selectedRows.value.length < props.tableData.length
)

// 处理单行选中
const toggleRowSelection = (row: Record<string, any>, column: TableColumn) => {
  const index = selectedRows.value.findIndex((item) => item[column.uuid ?? ''] === row[column.uuid ?? ''])
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  handleSelectionChange(selectedRows.value)
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...props.tableData]
  }
  handleSelectionChange(selectedRows.value)
}

const handleSelectionChange = (selection: Record<string, any>[]) => {
  emit('selection-change', selection)
}

const handleTagInputBlur = (row: Record<string, any>, column: TableColumn, index: number) => {
  const inputKey = getRowColumnKey(row, column, index)
  !tagInputValues.value[inputKey] && (tempBooleans.value[inputKey] = false)
}

const showTagInput = (row: Record<string, any>, column: TableColumn, index: number) => {
  const inputKey = getRowColumnKey(row, column, index)
  tempBooleans.value[inputKey] = true
  nextTick(() => {
    const input = document.getElementById(inputKey) as HTMLInputElement
    input?.focus()
  })
}

const handleTagClose = async (row: Record<string, any>, column: TableColumn, index: number) => {
  if (!column.key) return

  const value = row[column.key][index]

  if (column.tag?.beforeRemove) {
    const canRemove = await column.tag.beforeRemove(index, value, row)
    if (!canRemove) return
  }

  const newValue = [...row[column.key]]
  newValue.splice(index, 1)
  row[column.key] = newValue

  column.tag?.onRemove?.(index, value, row)
}

const handleTagAdd = async (row: Record<string, any>, column: TableColumn, index: number) => {
  if (!column.key) return

  const inputKey = getRowColumnKey(row, column, index)
  const value = tagInputValues.value[inputKey]?.trim()

  if (!value) return

  // Check for duplicate tags
  if (Array.isArray(row[column.key]) && row[column.key].includes(value)) {
    ElMessage.warning('标签已存在')
    return
  }

  if (column.tag?.beforeAdd) {
    const canAdd = await column.tag.beforeAdd(value, row)
    if (!canAdd) return
  }

  if (!Array.isArray(row[column.key])) {
    row[column.key] = []
  }

  const newValue = [...row[column.key], value]
  row[column.key] = newValue

  column.tag?.onAdd?.(value, row)

  // Clear input
  tagInputValues.value[inputKey] = ''
}

const formatCellValue = (value: any, column: TableColumn, row?: Record<string, any>) => {
  if (column.formatter) {
    return column.formatter(value, row)
  }

  if (value === undefined || value === null || value === '') {
    return column.defaultValue || ''
  }

  if (column.dictionary && value in column.dictionary) {
    return column.dictionary[value]
  }

  return value
}

const formatTagValue = (value: any, column: TableColumn) => {
  if (typeof value === 'object' && value !== null) {
    return value[column.tag?.label ?? '']
  }
  return formatCellValue(value, column)
}

const toggleLeft = (key: string = '') => {
  if (checkIfFixed(key, true)) return
  const index = tempLeftOrderConfig.value.indexOf(key)
  if (index === -1) {
    tempLeftOrderConfig.value.push(key)
  } else {
    tempLeftOrderConfig.value.splice(index, 1)
  }
}
const toggleFixed = (key: string = '') => {
  const index = tempFixedColumns.value.indexOf(key)
  if (index === -1) {
    tempFixedColumns.value.push(key)
  } else {
    tempFixedColumns.value.splice(index, 1)
  }
}
const getOrderIndex = (key: string = '') => {
  let index = tempFixedColumns.value.indexOf(key)
  if (index === -1) {
    index = tempLeftOrderConfig.value.indexOf(key)
    index = index !== -1 ? index + tempFixedColumns.value.length : index
  }
  return index + 1
}
const checkIfFixed = (key: string = '', isTemp?: boolean) => {
  return (isTemp ? tempFixedColumns.value : fixedColumns.value).indexOf(key) !== -1
}
const resetConfig = () => {
  fixedColumns.value = _preFixedColumns
  leftOrderConfig.value = []
  localStorage.setItem(`fixedColumns-${cacheKey}`, JSON.stringify(fixedColumns.value))
  localStorage.setItem(`leftOrderConfig-${cacheKey}`, JSON.stringify(leftOrderConfig.value))
  toggleEditingOrder(false)
}
const confirmOrder = () => {
  fixedColumns.value = [...tempFixedColumns.value]
  leftOrderConfig.value = [...tempLeftOrderConfig.value]
  localStorage.setItem(`fixedColumns-${cacheKey}`, JSON.stringify(fixedColumns.value))
  localStorage.setItem(`leftOrderConfig-${cacheKey}`, JSON.stringify(leftOrderConfig.value))
  toggleEditingOrder(false)
}
</script>

<style scoped>
.table-pro-wrapper {
  position: relative;
  height: fit-content;
  overflow: hidden;
}
.table-order-buttons {
  display: none;
}
.table-order-buttons.active {
  position: absolute;
  display: flex;
  background-color: rgba(0, 0, 0, 0.3);
  gap: 8px;
  bottom: 0;
  right: 0;
  z-index: 10;
  padding: 4px 8px;
}
.el-table {
  width: 100%;
  height: 100%;
  font-size: 14px;
}
.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-wrapper .el-button + .el-button {
  margin-left: 0;
}
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.tags-wrapper .el-tag {
  margin: 0;
  cursor: default;
  font-size: 12px;
}
.tags-wrapper .el-tag.is-closable {
  cursor: pointer;
}
.tag-input-wrapper {
  width: 70px;
  line-height: 24px;
}
.tag-input-wrapper .el-input,
.tag-input-wrapper .el-button {
  width: 100%;
}
.el-table .el-table__cell .header-actions {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  background-color: rgba(0, 0, 0, 0.2);
}
.el-table .el-table__cell .header-actions .el-icon {
  background-color: #909399;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
}

.el-table .el-table__cell .header-actions .el-icon.active {
  background-color: #303133;
}
.el-table .el-table__cell .header-actions .el-icon:hover,
.el-table .el-table__cell .header-actions .el-icon.active:hover {
  background-color: #4f5562;
}
.el-table .el-table__cell .header-actions .column-order-index {
  background-color: #303133;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  position: relative;
}
.el-table .el-table__cell .header-actions .column-order-index.is-fixed {
  opacity: 0.6;
  cursor: not-allowed;
}
.el-table .el-table__cell .header-actions .column-order-index:not(.is-fixed):hover::before {
  content: 'X';
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background-color: #4f5562;
}
</style>

