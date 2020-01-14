import axios from "axios";
import { notification  } from "antd";
import qs from 'qs'
import _ from 'lodash'

const BASE_URL = window.location.origin;
/**
 * 创建xhr实例
 * 路径前缀
 * 超时失败时间
 */
const service = axios.create({
    baseURL: BASE_URL, 
    timeout: 500000
});

/**
 * @desc 设置服务请求拦截器
 * 定义token请求设置
 */
service.interceptors.request.use(
    config => {
        // const authToken = window.authToken || ""
        // if(authToken){
        //     config.headers.Authorization = `Bearer ${authToken}`
        // }
        return config
    },
    error => {
        Promise.reject(error);
    }
)


/**
 * @desc 设置服务响应拦截器
 * 截取返回状态 统一定义成功失败
 */
service.interceptors.response.use(
    response => {
        const { isCustomException = false } = response.config
        const data = response.data;
        const type = Object.prototype.toString.call(data)
        if(type === "[object Object]"){
            const { code, success, message: msg } = data
            if(code == 200 && success) {
                return Promise.resolve(data)
            }else if(code == 400 || code == 401){
                window.location = "/exit"
            }else{
                if(!isCustomException){ // 如果走自定义异常提示
                    notification.error({
                        message: "提示",
                        description: msg
                    })
                }
                return Promise.reject(data)
            }
        }else if(type === "[object String]" && /^<!doctype/.test(data)){ // 需要重定向
           window.location.reload()
        }else{
            return Promise.reject(data)
        }
        
    },
    error => {
        const { response } = error
        console.log("err" + error); 
        notification.error({
            message: "提示",
            description: response.data.message
        })
        return Promise.reject(error);
    }
)

function handleParam(param = {}){
    Object.keys(param).forEach(key => {
        if(param[key] === undefined || param[key] === null){
            param[key] = ""
        }
    })
}

const get = (url, params = {}, isCustomException = false) => {
    handleParam(params)
    Object.keys(params).forEach((key, index) => {
        const value = params[key]
        if(_.isArray(value)){
            value.forEach((item, idx) => {
                if(idx === index && index === 0){
                    url = url + `?${key}=${item}`
                }else{
                    url = url + `&${key}=${item}`
                }
            })
        }else{
            if(index === 0){
                url = url + `?${key}=${value}`
            }else{
                url = url + `&${key}=${value}`
            }
        }
    })
    return service({
        url,
        method: "get",
        isCustomException
    });
}

/**
 * 
 * @param {*} url 请求路径
 * @param {*} data 请求参数
 * @param {*} isCustomException 是否启用自定义异常，如果为true，需要手动添加catch去处理异常，全局的异常提示不会显示
 */
const post = (url, data = {}, isCustomException = false) => {
    handleParam(data)
    return service.post(url, qs.stringify(data), {isCustomException});
}

export { get, post, service };
export default service;
