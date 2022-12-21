import { toast } from "react-toastify"
import axios from "axios"

const api = axios.create()
// api.defaults.withCredentials = true

export const errorResponseHandler = (error: any) => {
  if (error?.response) {
    console.log("ERROR RESPONSE: ", error?.response?.data)

    if (typeof error?.response?.data === "string") {
      return Promise.reject(new Error(error.response.data))
    }

    if (typeof error?.response?.data?.message === "string") {
      return Promise.reject(new Error(error.response.data.message))
    }

    return Promise.reject(
      new Error("Something went wrong", {
        cause: error.response
      })
    )
  }

  if (error?.request) {
    console.error("INTERNAL SERVER ERROR: ", error?.toJSON?.())

    toast.error("Internal Server Error", {
      containerId: "fetch-error",
      toastId: "internal-server-error"
    })

    return Promise.reject(new Error("Internal server error"))
  }

  return Promise.reject(error)
}

api.interceptors.response.use((response) => response, errorResponseHandler)

export { api }
