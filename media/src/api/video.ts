import request from "./request";

//#region list
export function requestList() {
  return request({
    url: "/api/video/list",
    method: "get",
  });
}

export function updateVideo(data: any) {
  return request({
    url: "/api/video/upload/",
    method: "put",
    data,
  });
}

export function deleteVideo(id: string | number) {
  return request({
    url: "/api/video/" + id,
    method: "delete",
  });
}
