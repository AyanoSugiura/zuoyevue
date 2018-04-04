import axios from 'axios'


let base = 'http://127.0.0.1:8089';

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
}
