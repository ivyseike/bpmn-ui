import axios from 'axios'

export function request(config) {
  //1.创建实例
  const instance = axios.create({
    baseURL: "http://localhost:5000" ,
    //http://backend-py:8000/
    //baseURL: "http://backend-java:8090",
    //baseURL: "http://lxc-backend-java.ingress.isa.buaanlsde.cn",
    //timeout: 5000
  })

  //2.发送真正的网络请求
  return instance(config)

}

export function requestForChatbot(config){
  const instance = axios.create({
    baseURL: "http://localhost:5001" ,
    //http://backend-py:8000/
    //baseURL: "http://backend-java:8090",
    //baseURL: "http://lxc-backend-java.ingress.isa.buaanlsde.cn",
    //timeout: 5000
  })

  //2.发送真正的网络请求
  return instance(config)
}
