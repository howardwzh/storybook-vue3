import { ref, type Ref } from 'vue'

export interface User {
  userId: string
  name: string
  avatar?: string
}

export interface CacheDataInterface {
  usersDictionary: Ref<any>
  addUsersDictionary: (userIds: string[]) => void
  addUsersDictionaryNow: (userIds: string[]) => Promise<void>
}

export function useCacheData(): CacheDataInterface {
  const cacheUserIds: Record<string, string[]> = {}
  const timers: Record<string, NodeJS.Timeout> = {}

  const usersDictionary = ref<Record<string, User>>({})

  const lazyFetch = (
    type: string,
    dictionary: Record<string, any>,
    ids: string[],
    fetchFn: (ids: string[]) => Promise<void>
  ) => {
    cacheUserIds[type] = [...(cacheUserIds[type] ?? []), ...ids]
    clearTimeout(timers[type])
    timers[type] = setTimeout(async () => {
      const uniqueIds = [...new Set(cacheUserIds[type])].filter((id) => !dictionary[id])
      cacheUserIds[type] = []
      if (uniqueIds.length === 0) return
      await fetchFn(uniqueIds)
    }, 100)
  }

  const addUsersDictionaryNow = async (userIds: string[]) => {
    try {
      const response = await service.user.getBatchUsersList(userIds)
      if (response.data.errCode === '0') {
        const newDictionary: Record<string, User> = {}
        response.data.data.forEach((item: User) => {
          newDictionary[item.userId] = item
        })
        usersDictionary.value = { ...usersDictionary.value, ...newDictionary }
      }
    } catch (error) {
      console.error('Failed to fetch user dictionary:', error)
    }
  }

  const addUsersDictionary = (userIds: string[]) =>
    lazyFetch('users', usersDictionary.value, userIds, addUsersDictionaryNow)

  return {
    usersDictionary,
    addUsersDictionary,
    addUsersDictionaryNow,
  }
}
