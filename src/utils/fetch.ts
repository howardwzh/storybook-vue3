import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/mock/', // 设置基础 URL，可根据需要修改
  timeout: 5000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，比如添加 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误时处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做一些处理
    return response.data;
  },
  (error) => {
    // 处理响应错误
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 通用请求方法封装
const fetch = {
  async request<T = any>(
    url: string,
    method: AxiosRequestConfig['method'],
    dataOrParams?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const isGet = method === 'GET';
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      ...(isGet ? { params: dataOrParams } : { data: dataOrParams }),
      ...config,
    };
    return axiosInstance.request<T>(requestConfig);
  },

  // 简化的 GET 方法
  async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return fetch.request<T>(url, 'GET', params, config);
  },

  // 简化的 POST 方法
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return fetch.request<T>(url, 'POST', data, config);
  },

  // 简化的 PUT 方法
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return fetch.request<T>(url, 'PUT', data, config);
  },

  // 简化的 DELETE 方法
  async delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return fetch.request<T>(url, 'DELETE', params, config);
  },
};

export default fetch;

// 示例用法
// (async () => {
//   try {
//     // GET 请求
//     const users = await fetch.get<{ id: number; name: string }[]>('/users', { limit: 10 });
//     console.log('GET Users:', users);

//     // POST 请求
//     const newUser = await fetch.post<{ id: number; name: string }>('/users', {
//       name: 'New User',
//     });
//     console.log('POST New User:', newUser);

//     // PUT 请求
//     const updatedUser = await fetch.put<{ id: number; name: string }>('/users/1', {
//       name: 'Updated Name',
//     });
//     console.log('PUT Updated User:', updatedUser);

//     // DELETE 请求
//     const deletedUser = await fetch.delete<{ success: boolean }>('/users/1');
//     console.log('DELETE User:', deletedUser);
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// })();
