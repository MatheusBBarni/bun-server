import { HttpMethods } from "../types/app-types";

export const httpMethodToEnum = (method: string): HttpMethods => {
  if (method === 'POST') {
    return HttpMethods.POST
  }

  if (method === 'DELETE') {
    return HttpMethods.DELETE
  }

  if (method === 'PATCH') {
    return HttpMethods.PATCH
  }

  if (method === 'PUT') {
    return HttpMethods.PUT
  }

  return HttpMethods.GET
}