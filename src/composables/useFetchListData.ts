import { ref, type Ref } from 'vue'

export interface FetchListInterface {
  fetchFn: (params: any) => Promise<any>
  fetchParams?: Record<string, any>
  isNew?: boolean
  size?: number
  needCache?: boolean
}

export interface UseFetchListDataInterface<T = any> {
  listData: Ref<T[] | undefined>
  listPage: Ref<number>
  listTotal: Ref<number>
  isLoading: Ref<boolean>
  isFinished: Ref<boolean>
  isError: Ref<boolean>
  fetchList: (config: FetchListInterface) => Promise<T[]>
}

export function useFetchListData<T = any>(): UseFetchListDataInterface<T> {
  const listData = ref<T[]>()
  const listPage = ref<number>(1)
  const listTotal = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const isFinished = ref<boolean>(false)
  const isError = ref<boolean>(false)

  const cacheAll: Record<string, any> = {}

  const fetchList = async ({
    fetchFn,
    fetchParams = {},
    size = 10,
    isNew = false,
    needCache = false,
  }: FetchListInterface): Promise<T[]> => {
    return fetchNormalList({ fetchFn, fetchParams, size, isNew, needCache })
  }

  const fetchNormalList = async ({
    fetchFn,
    fetchParams,
    size = 10,
    isNew = false,
    needCache = false,
  }: FetchListInterface): Promise<T[]> => {
    if (!isNew && isFinished.value) return listData.value || []
    updateLoadingState(true)

    const page = isNew ? 1 : listPage.value
    const params = { ...fetchParams, page, size }

    try {
      const response = needCache && cacheAll[JSON.stringify(params)]
        ? cacheAll[JSON.stringify(params)]
        : await fetchFn(params)

      if (response.data.errCode === '0') {
        const newData = response.data.data.list || []
        listData.value = isNew ? newData : [...(listData.value || []), ...newData]
        listTotal.value = response.data.data.total
        listPage.value = page + 1

        if (needCache) {
          cacheAll[JSON.stringify(params)] = response
        }

        isFinished.value = newData.length < size
      } else {
        throw new Error(`Error: ${response.data.errCode}`)
      }
    } catch (error) {
      handleError(error)
    } finally {
      updateLoadingState(false)
    }

    return listData.value || []
  }

  const updateLoadingState = (loading: boolean, finished = false) => {
    isLoading.value = loading
    isFinished.value = finished
    isError.value = false
  }

  const handleError = (error: any) => {
    console.error(error)
    isError.value = true
    isFinished.value = true
    isLoading.value = false
  }

  return {
    listData,
    listPage,
    listTotal,
    isLoading,
    isFinished,
    isError,
    fetchList,
  }
}
